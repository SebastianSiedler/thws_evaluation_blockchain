// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '@semaphore-protocol/contracts/interfaces/ISemaphore.sol';
import 'hardhat/console.sol';

contract EvaluationPlatform {
    ISemaphore public semaphore;

    struct Evaluation {
        address creator;
        uint256 voteCount; // Number of votes
        mapping(uint256 => bool) participants; // Tracks participants
        uint256[] participantList; // List of participants (identityCommitments)
        bool finalized; // Whether the evaluation is finalized
        string name;
        uint256 startDate; // Start date of the evaluation
        uint256 endDate; // End date of the evaluation
    }

    struct Student {
        uint256 identityCommitment;
        string name;
        string matNr;
    }

    struct EvaluationQuestionnaire {
        string question;
        uint256[8] points;
    }

    event EvaluationCreated(uint256 groupId, address creator);

    mapping(uint256 => Evaluation) public evaluations; // Maps evaluation IDs to their data
    mapping(address => uint256[]) public creatorAddressEvaluations; // creatorAddress => groupId[]
    mapping(uint256 => uint256[]) public participantICEvaluation; // participantIdentityCommit => groupId[]

    constructor(address _semaphore) {
        semaphore = ISemaphore(_semaphore);
    }

    function createEvaluation(
        string memory name,
        uint256 startDate,
        uint256 endDate
    ) external returns (uint256) {
        require(startDate < endDate, 'Start date must be before end date');
        require(
            startDate / 86400 >= block.timestamp / 86400,
            'Start date must be today or in the future'
        );

        uint256 groupId = semaphore.createGroup();

        console.log('createEvaluation: ');

        evaluations[groupId].creator = msg.sender;
        evaluations[groupId].finalized = false;
        evaluations[groupId].name = name;
        evaluations[groupId].startDate = startDate;
        evaluations[groupId].endDate = endDate;

        creatorAddressEvaluations[msg.sender].push(groupId);

        emit EvaluationCreated(groupId, msg.sender);

        return groupId;
    }

    function addParticipant(
        uint256 groupId,
        uint256 identityCommitment
    ) external {
        require(
            !evaluations[groupId].participants[identityCommitment],
            'Participant already added'
        );
        require(!evaluations[groupId].finalized, 'Evaluation is finalized');

        evaluations[groupId].participants[identityCommitment] = true;
        evaluations[groupId].participantList.push(identityCommitment);
        participantICEvaluation[identityCommitment].push(groupId);

        semaphore.addMember(groupId, identityCommitment);
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
        require(!evaluation.finalized, 'Evaluation is finalized');
        require(
            block.timestamp >= evaluation.startDate,
            'Voting has not started yet'
        );
        require(block.timestamp <= evaluation.endDate, 'Voting has ended');

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
        require(verifyProof, 'Invalid proof or already voted');

        semaphore.validateProof(groupId, proof);
        evaluation.voteCount += 1;
    }

    function finalizeEvaluation(uint256 evaluationId) external {
        require(
            msg.sender == evaluations[evaluationId].creator,
            'Only creator can finalize'
        );
        evaluations[evaluationId].finalized = true;
    }

    function getParticipantList(
        uint256 evaluationId
    ) external view returns (uint256[] memory) {
        return evaluations[evaluationId].participantList;
    }

    struct EvaluationListItem {
        uint256 voteCount;
        bool finalized;
        uint256 groupId;
        string name;
    }

    function getCreatorEvaluationList(
        address creatorAddress
    ) external view returns (EvaluationListItem[] memory) {
        uint256[] memory groupIds = creatorAddressEvaluations[creatorAddress];
        EvaluationListItem[] memory evaluationList = new EvaluationListItem[](
            groupIds.length
        );

        for (uint256 i = 0; i < groupIds.length; i++) {
            Evaluation storage evaluation = evaluations[groupIds[i]];
            evaluationList[i] = EvaluationListItem(
                evaluation.voteCount,
                evaluation.finalized,
                groupIds[i],
                evaluation.name
            );
        }

        return evaluationList;
    }

    function getParticipantEvaluationList(
        uint256 identityCommit
    ) external view returns (EvaluationListItem[] memory) {
        uint256[] memory groupIds = participantICEvaluation[identityCommit];
        EvaluationListItem[] memory evaluationList = new EvaluationListItem[](
            groupIds.length
        );

        for (uint256 i = 0; i < groupIds.length; i++) {
            Evaluation storage evaluation = evaluations[groupIds[i]];
            evaluationList[i] = EvaluationListItem(
                evaluation.voteCount,
                evaluation.finalized,
                groupIds[i],
                evaluation.name
            );
        }

        return evaluationList;
    }

    struct EvaluationData {
        address creator;
        uint256 voteCount;
        uint256[] participantList;
        bool finalized;
        string name;
        uint256 startDate;
        uint256 endDate;
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
                evaluation.finalized,
                evaluation.name,
                evaluation.startDate,
                evaluation.endDate
            );
    }
}
