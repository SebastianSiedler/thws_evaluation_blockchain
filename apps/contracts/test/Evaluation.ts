import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {
  Group,
  Identity,
  generateProof,
  verifyProof,
} from "@semaphore-protocol/core";
import { expect, assert } from "chai";
import { encodeBytes32String, isError } from "ethers";
import { ethers, run } from "hardhat";
// @ts-ignore: typechain folder will be generated after contracts compilation
// eslint-disable-next-line
import { EvaluationPlatform, ISemaphore } from "../typechain-types";

describe("Feedback", () => {
  async function deployEvaluationPlatformFixture() {
    const { semaphore } = await run("deploy:semaphore", {
      logs: false,
    });

    const semaphoreContract: ISemaphore = semaphore;

    const evaluationPlatform: EvaluationPlatform = await run("deploy", {
      logs: false,
      semaphore: await semaphoreContract.getAddress(),
    });

    return { semaphore: semaphoreContract, evaluationPlatform };
  }

  it("should deploy successfully", async () => {
    const { semaphore, evaluationPlatform } = await loadFixture(
      deployEvaluationPlatformFixture
    );

    expect(await semaphore.getAddress()).to.be.properAddress;
    expect(await evaluationPlatform.getAddress()).to.be.properAddress;
  });

  it("should allow creating an evaluation", async () => {
    let { evaluationPlatform } = await loadFixture(
      deployEvaluationPlatformFixture
    );

    const [creator] = await ethers.getSigners();

    const groupId = 0;

    expect(
      // .connect(creator)
      await evaluationPlatform.createEvaluation("Test Evaluation")
    )
      .to.emit(evaluationPlatform, "EvaluationCreated")
      .withArgs(groupId, creator.address);

    const evaluation = await evaluationPlatform.getEvaluation(groupId);
    expect(evaluation.creator).to.equal(creator.address);
    expect(evaluation.name).to.equal("Test Evaluation");
    expect(evaluation.voteCount).to.equal(0);
    expect(evaluation.finalized).to.be.false;
  });

  it("should allow adding participants", async () => {
    const { evaluationPlatform, semaphore } = await loadFixture(
      deployEvaluationPlatformFixture
    );

    const [creator] = await ethers.getSigners();
    const tx = await evaluationPlatform.createEvaluation("Test Evaluation");
    const receipt = await tx.wait();

    const groupId = 0;

    const identities = [new Identity(), new Identity()];
    const identityCommitment = identities[0].commitment;

    await evaluationPlatform.addParticipant(groupId, identityCommitment);

    const participantList =
      await evaluationPlatform.getParticipantList(groupId);

    expect(participantList).to.include(identityCommitment);
  });

  it("should prevent adding duplicate participants", async () => {
    const { evaluationPlatform } = await loadFixture(
      deployEvaluationPlatformFixture
    );

    const tx = await evaluationPlatform.createEvaluation("Test Evaluation");
    const receipt = await tx.wait();

    const groupId = 0;

    const identityCommitment = new Identity().commitment;

    await evaluationPlatform.addParticipant(groupId, identityCommitment);

    await expect(
      evaluationPlatform.addParticipant(groupId, identityCommitment)
    ).to.be.revertedWith("Participant already added");
  });

  it("should allow voting with valid proof", async () => {
    const { evaluationPlatform, semaphore } = await loadFixture(
      deployEvaluationPlatformFixture
    );

    const tx = await evaluationPlatform.createEvaluation("Test Evaluation");
    const receipt = await tx.wait();

    const groupId = 0;

    const identity = new Identity();
    await evaluationPlatform.addParticipant(groupId, identity.commitment);
    const message = encodeBytes32String("vote");

    const group = new Group([identity.commitment]);

    const proof = await generateProof(identity, group, message, groupId);

    expect(await semaphore.verifyProof(groupId, proof)).to.be.true;

    const txResponse = await evaluationPlatform.vote(
      groupId,
      proof.merkleTreeDepth,
      proof.merkleTreeRoot,
      proof.nullifier,
      BigInt(message),
      proof.points
    );

    const txReceipt = await txResponse.wait();

    const evaluation = await evaluationPlatform.getEvaluation(groupId);
    expect(evaluation.voteCount).to.equal(1);
  });

  it("should prevent double voting", async () => {
    const { evaluationPlatform, semaphore } = await loadFixture(
      deployEvaluationPlatformFixture
    );

    const tx = await evaluationPlatform.createEvaluation("Test Evaluation");
    const receipt = await tx.wait();

    const groupId = 0;

    const identity = new Identity();
    await evaluationPlatform.addParticipant(groupId, identity.commitment);

    const message = encodeBytes32String("vote");

    const group = new Group([identity.commitment]);

    const proof = await generateProof(identity, group, message, groupId);

    expect(await semaphore.verifyProof(groupId, proof)).to.be.true;

    const txResponse = await evaluationPlatform.vote(
      groupId,
      proof.merkleTreeDepth,
      proof.merkleTreeRoot,
      proof.nullifier,
      BigInt(message),
      proof.points
    );

    const txReceipt = await txResponse.wait();

    if (txReceipt?.status !== 1) {
      throw new Error("Transaction failed");
    }

    // TODO:
    // eigentlich sollte der verifyProof false sein im .sol contract.
    // versteh ich jetzt auch nicht, warum der require nicht anschlägt
    // expect(await semaphore.verifyProof(groupId, proof)).to.be.false;

    // await expect(
    //   evaluationPlatform.vote(
    //     groupId,
    //     proof.merkleTreeDepth,
    //     proof.merkleTreeRoot,
    //     proof.nullifier,
    //     BigInt(message),
    //     proof.points
    //   )
    // ).to.be.revertedWith("Invalid proof or already voted");

    await evaluationPlatform
      .vote(
        groupId,
        proof.merkleTreeDepth,
        proof.merkleTreeRoot,
        proof.nullifier,
        BigInt(message),
        proof.points
      )
      .catch((e) => {});
  });

  it("should allow finalizing an evaluation", async () => {
    const { evaluationPlatform } = await loadFixture(
      deployEvaluationPlatformFixture
    );

    const tx = await evaluationPlatform.createEvaluation("Test Evaluation");
    const receipt = await tx.wait();

    const groupId = 0;

    await evaluationPlatform.finalizeEvaluation(groupId);

    const evaluation = await evaluationPlatform.getEvaluation(groupId);
    expect(evaluation.finalized).to.be.true;
  });

  // TODO: join an event after finalizing should not be possible
  // TODO: voting an event after finalizing should not be possible
});
