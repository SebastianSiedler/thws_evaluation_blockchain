import Fastify from "fastify";
import { initServer } from "@ts-rest/fastify";
import { contract } from "./contract";
import cors from "@fastify/cors";
import { getEvaluationContract } from "./contracts/evaluation";
import { EvaluationPlatform } from "@acme/contracts/typechain-types";
import { SemaphoreEthers } from "@semaphore-protocol/data";
import { SEMAPHORE_CONTRACT_ADDRESS } from "@acme/contracts/addresses/SemaphoreContract";
import { generateProof, Group, Identity } from "@semaphore-protocol/core";
import { encodeBytes32String } from "ethers";

const app = Fastify();
let evaluationContract: EvaluationPlatform;

app.register(cors, {
  origin: "*", //TODO: .env only :9000
});

const s = initServer();
const ethNetworkProviderUrl = "http://127.0.0.1:8545"; // TODO: .env

const semaphore = new SemaphoreEthers(ethNetworkProviderUrl, {
  address: SEMAPHORE_CONTRACT_ADDRESS,
});

export const router = s.router(contract, {
  vote: async ({ body }) => {
    console.log("vote");
    const { vote, identityPk, groupId } = body;

    const _users = await semaphore.getGroupMembers(groupId);
    console.log({ _users });
    const group = new Group(_users);

    const message = encodeBytes32String(vote);

    const _identity = Identity.import(identityPk);
    console.log("received identity", _identity.commitment.toString());

    const proof = await generateProof(_identity, group, message, groupId);
    // console.log({ proof });

    // console.log(message, proof.message);

    const txResponse = await evaluationContract.vote(
      groupId,
      proof.merkleTreeDepth,
      proof.merkleTreeRoot,
      proof.nullifier,
      BigInt(message),
      proof.points
    );

    const txReceipt = await txResponse.wait();

    console.log({ txReceipt });

    if (txReceipt?.status !== 1) {
      throw new Error("Transaction failed");
    }

    return {
      status: 200,
      body: null,
    };
  },
});

app.register(s.plugin(router));

const start = async () => {
  evaluationContract = await getEvaluationContract();

  try {
    console.log("Starting server...", { port: 3000 });
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
