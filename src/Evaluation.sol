// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "forge-std/Script.sol";

contract EvaluationPlatform {
    ISemaphore public semaphore;

    struct Evaluation {
        address creator;
        // mapping(uint256 => bool) hasVoted; // Tracks if an identityCommitment has voted
        uint256 voteCount; // Number of votes
        mapping(uint256 => bool) participants; // Tracks participants
        uint256[] participantList; // List of participants (identityCommitments)
        bool finalized; // Whether the evaluation is finalized
    }

    mapping(uint256 => Evaluation) public evaluations; // Maps evaluation IDs to their data
    mapping(address => uint256[]) public userEvaluations; // Maps user to evaluations they are part of

    // event EvaluationCreated(
    //     uint256 indexed evaluationId,
    //     address indexed creator,
    //     uint256 groupId
    // );
    // event ParticipantAdded(
    //     uint256 indexed evaluationId,
    //     uint256 identityCommitment
    // );
    // event Voted(uint256 indexed evaluationId, uint256 identityCommitment);

    constructor(address _semaphore) {
        semaphore = ISemaphore(_semaphore);
    }

    function createEvaluation() external returns (uint256) {
        uint256 groupId = semaphore.createGroup();

        console.log("createEvaluation: ");

        evaluations[groupId].creator = msg.sender;
        evaluations[groupId].finalized = false;

        userEvaluations[msg.sender].push(groupId);

        return groupId;

        // emit EvaluationCreated(groupId, msg.sender, groupId);
    }

    function addParticipant(
        uint256 groupId,
        uint256 identityCommitment
    ) external {
        console.log("sender: ");
        console.log(msg.sender);
        console.log("creator: ");
        console.log(evaluations[groupId].creator);
        // require(
        //     msg.sender == evaluations[groupId].creator,
        //     "Only creator can add participants"
        // );
        require(
            !evaluations[groupId].participants[identityCommitment],
            "Participant already added"
        );

        // make sure the evaluation is not finalized
        require(!evaluations[groupId].finalized, "Evaluation is finalized");

        evaluations[groupId].participants[identityCommitment] = true;
        evaluations[groupId].participantList.push(identityCommitment);

        semaphore.addMember(groupId, identityCommitment);

        // emit ParticipantAdded(evaluationId, identityCommitment);
    }

    function vote(
        uint256 groupId,
        uint256 merkleTreeDepth,
        uint256 merkleTreeRoot,
        uint256 nullifierHash,
        uint256 feedback,
        uint256[8] calldata points
    ) external {
        Evaluation storage evaluation = evaluations[groupId];
        // require(msg.sender != evaluation.creator, "Creator cannot vote");
        require(!evaluation.finalized, "Evaluation is finalized");

        ISemaphore.SemaphoreProof memory proof = ISemaphore.SemaphoreProof(
            merkleTreeDepth,
            merkleTreeRoot,
            nullifierHash,
            feedback,
            groupId,
            points
        );

        // prevent double voting
        bool verifyProof = semaphore.verifyProof(groupId, proof);
        require(verifyProof, "Invalid proof or already voted");

        semaphore.validateProof(groupId, proof);
        evaluation.voteCount += 1;
    }

    function finalizeEvaluation(uint256 evaluationId) external {
        require(
            msg.sender == evaluations[evaluationId].creator,
            "Only creator can finalize"
        );
        evaluations[evaluationId].finalized = true;
    }

    function getParticipantList(
        uint256 evaluationId
    ) external view returns (uint256[] memory) {
        return evaluations[evaluationId].participantList;
    }

    function getUserEvaluations(
        address user
    ) external view returns (uint256[] memory) {
        return userEvaluations[user];
    }

    function getVoteCount(
        uint256 evaluationId
    ) external view returns (uint256) {
        return evaluations[evaluationId].voteCount;
    }

    struct EvaluationData {
        address creator;
        uint256 voteCount;
        uint256[] participantList;
        bool finalized;
    }

    function getEvaluation(
        uint256 evaluationId
    ) external view returns (EvaluationData memory) {
        Evaluation storage evaluation = evaluations[evaluationId];
        return
            EvaluationData(
                evaluation.creator,
                evaluation.voteCount,
                evaluation.participantList,
                evaluation.finalized
            );
    }
}
