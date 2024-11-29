// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {EvaluationPlatform} from "../src/Evaluation.sol";
import {DeployEvaluation} from "../script/DeployEvaluation.s.sol";
import {ISemaphore} from "@semaphore/contracts/contracts/interfaces/ISemaphore.sol";
import "forge-std/Test.sol";
import "forge-std/Vm.sol";

contract TestEvaluationPlatform is Test {
    event EvaluationCreated(uint256 indexed groupId, address indexed creator);
    event ParticipantAdded(uint256 indexed groupId, uint256 identityCommitment);
    event Voted(uint256 indexed groupId, uint256 identityCommitment);

    EvaluationPlatform evaluationPlatform;
    ISemaphore semaphore;

    address creator = address(0x1);
    address voter = address(0x2);

    function setUp() external {
        DeployEvaluation deployEvaluation = new DeployEvaluation();
        (address platformAddress, address semaphoreAddress) = deployEvaluation
            .run();

        evaluationPlatform = EvaluationPlatform(platformAddress);
        semaphore = ISemaphore(semaphoreAddress);
    }

    // function testCreateEvaluation() external {
    //     vm.prank(creator);
    //     uint256 groupId = evaluationPlatform.createEvaluation();

    //     (
    //         address storedCreator,
    //         uint256 voteCount,
    //         bool finalized
    //     ) = evaluationPlatform.evaluations(groupId);

    //     assertEq(storedCreator, creator);
    //     assertEq(voteCount, 0);
    //     assertEq(finalized, false);
    // }

    // function testAddParticipant() external {
    //     vm.prank(creator);
    //     uint256 groupId = evaluationPlatform.createEvaluation();

    //     uint256 identityCommitment = 12345;

    //     vm.prank(creator);
    //     // vm.expectEmit(true, true, true, false);
    //     // emit ParticipantAdded(1, identityCommitment);

    //     evaluationPlatform.addParticipant(groupId, identityCommitment);

    //     uint256[] memory participantList = evaluationPlatform
    //         .getParticipantList(groupId);
    //     assertEq(participantList.length, 1);
    //     assertEq(participantList[0], identityCommitment);
    // }

    // function testCannotAddParticipantByNonCreator() external {
    //     vm.prank(creator);
    //     uint256 groupId = evaluationPlatform.createEvaluation();

    //     uint256 identityCommitment = 12345;

    //     vm.prank(voter);
    //     vm.expectRevert("Only creator can add participants");
    //     evaluationPlatform.addParticipant(groupId, identityCommitment);
    // }

    // function testCannotAddDuplicateParticipant() external {
    //     vm.prank(creator);
    //     uint256 groupId = evaluationPlatform.createEvaluation();

    //     uint256 identityCommitment = 12345;

    //     vm.prank(creator);
    //     evaluationPlatform.addParticipant(groupId, identityCommitment);

    //     vm.prank(creator);
    //     vm.expectRevert("Participant already added");
    //     evaluationPlatform.addParticipant(groupId, identityCommitment);
    // }

    // function testVote() external {
    //     vm.prank(creator);
    //     uint256 groupId = evaluationPlatform.createEvaluation();

    //     uint256 identityCommitment = 15072455385723004728391568434269917452175057560864330595979104241296826134229;

    //     vm.prank(creator);
    //     evaluationPlatform.addParticipant(groupId, identityCommitment);

    //     // proof
    //     uint256 merkleTreeDepth = 1;
    //     uint256 merkleTreeRoot = 15072455385723004728391568434269917452175057560864330595979104241296826134229;
    //     uint256 nullifier = 19686122779422310562166284157356225273555811832250923548604308577995736533741;
    //     uint256 _feedback = 10;
    //     uint256[8] memory points = [
    //         12048312860461559338883155239253399933546666729690013703471566999549175452467,
    //         21840091385609522690103928000869734241136862303146585471149748945500784854265,
    //         10054166788431277732934266072748176286083365382773741957806739135617485223542,
    //         9116054769380232069869558420495933708797671282085269461846220481242548419978,
    //         6948551756635965397908570768367265912884504926499199123083878377204200654789,
    //         2245690128809758381379719477871572712156305432595569015554741897717367802975,
    //         5611601698470220983640634359607737788561497874240905720723835997666161640377,
    //         10003362076211645361201917446734540672642362716488164733173444779942043660944
    //     ];

    //     // Mock Semaphore verifyProof logic if needed using vm.mockCall or integrate real semaphore setup
    //     vm.prank(voter);
    //     // vm.expectEmit(true, true, true, false);
    //     // emit Voted(1, identityCommitment);

    //     evaluationPlatform.vote(
    //         groupId,
    //         merkleTreeDepth,
    //         merkleTreeRoot,
    //         nullifier,
    //         _feedback,
    //         points
    //     );

    //     (
    //         address creator,
    //         uint256 voteCount,
    //         bool finalized
    //     ) = evaluationPlatform.evaluations(groupId);
    //     console.log("voteCount");
    //     console.log(voteCount);
    // }

    // function testCannotVoteAfterFinalization() external {
    //     vm.prank(creator);
    //     evaluationPlatform.createEvaluation(1, groupId);

    //     uint256 identityCommitment = 12345;

    //     vm.prank(creator);
    //     evaluationPlatform.addParticipant(1, identityCommitment);

    //     vm.prank(creator);
    //     evaluationPlatform.finalizeEvaluation(1);

    //     uint256 merkleTreeDepth = 20;
    //     uint256 merkleTreeRoot = 123456789;
    //     uint256 nullifierHash = 987654321;
    //     uint256 feedback = 5;
    //     uint256[8] memory proofPoints = [uint256(1), 2, 3, 4, 5, 6, 7, 8];

    //     vm.prank(voter);
    //     vm.expectRevert("Evaluation is finalized");
    //     evaluationPlatform.vote(
    //         1,
    //         merkleTreeDepth,
    //         merkleTreeRoot,
    //         nullifierHash,
    //         feedback,
    //         proofPoints
    //     );
    // }

    // function testFinalizeEvaluation() external {
    //     vm.prank(creator);
    //     evaluationPlatform.createEvaluation(1, groupId);

    //     vm.prank(creator);
    //     evaluationPlatform.finalizeEvaluation(1);

    //     (, , , bool finalized) = evaluationPlatform.evaluations(1);
    //     assertEq(finalized, true);
    // }

    // function testCannotFinalizeByNonCreator() external {
    //     vm.prank(creator);
    //     evaluationPlatform.createEvaluation(1, groupId);

    //     vm.prank(voter);
    //     vm.expectRevert("Only creator can finalize");
    //     evaluationPlatform.finalizeEvaluation(1);
    // }

    // function testGetParticipantList() external {
    //     vm.prank(creator);
    //     evaluationPlatform.createEvaluation(1, groupId);

    //     uint256 identityCommitment1 = 12345;
    //     uint256 identityCommitment2 = 67890;

    //     vm.prank(creator);
    //     evaluationPlatform.addParticipant(1, identityCommitment1);

    //     vm.prank(creator);
    //     evaluationPlatform.addParticipant(1, identityCommitment2);

    //     uint256[] memory participants = evaluationPlatform.getParticipantList(
    //         1
    //     );

    //     assertEq(participants.length, 2);
    //     assertEq(participants[0], identityCommitment1);
    //     assertEq(participants[1], identityCommitment2);
    // }
}
