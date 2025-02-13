// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '@semaphore-protocol/contracts/interfaces/ISemaphore.sol';
import 'hardhat/console.sol';

contract EvaluationPlatform {
    ISemaphore public semaphore;

    struct Evaluation {
        address creator;  // Creator of the evaluation
        uint256 voteCount; // Number of votes
        mapping(uint256 => bool) participants; // Tracks participants
        uint256[] participantList; // List of participants (identityCommitments)
        bool finalized; // Whether the evaluation is finalized
        string name;
        uint256 startDate; // Start date of the evaluation
        uint256 endDate; // End date of the evaluation
    }

    struct Question {
        uint8 id; // Frage-ID
        string question; // Fragetext
    }

    struct Student {
        uint256 identityCommitment;
        string name;
        string matNr;
    }

    enum QuestionType {
        FivePointLikeScale, // For questions like "Rate this from 1 to 5"
        YesNo,              // For yes/no questions
        Open,               // For open-ended questions
        Degree              // For degree questions
    }

    struct Answer {
        uint8 questionId;       // The ID of the question (e.g., 0, 1, 2, etc.)
        QuestionType questionType; // The type of question (e.g., FivePointLikeScale)
        uint8 numericAnswer;    // For numeric answers (e.g., 1, 2, 3, 4, 5)
        bytes openAnswer;       // For text answers (e.g., "I loved it!")
    }

    event EvaluationCreated(uint256 groupId, address creator);

    mapping(uint256 => Evaluation) public evaluations; // Maps evaluation IDs to their data
    mapping(address => uint256[]) public creatorAddressEvaluations; // creatorAddress => groupId[]
    mapping(uint256 => uint256[]) public participantICEvaluation; // participantIdentityCommit => groupId[]
    mapping(uint256 => mapping(uint256 => Answer[])) public answers; // evaluationId => participantIdentityCommitment => Answer[]

    // Fragen als immutable Variable
    Question[] public QUESTIONS;

    constructor(address _semaphore) {
        semaphore = ISemaphore(_semaphore);
        initializeQuestions();
    }

    function initializeQuestions() private {
        QUESTIONS.push(Question(0,  unicode'Die Lehrperson geht nach einer nachvollziehbaren Gliederung vor.'));
        QUESTIONS.push(Question(1,  unicode'Die Lehrperson verdeutlicht die Lernziele, die die Studierenden in der Lehrveranstaltung erreichen sollen.'));
        QUESTIONS.push(Question(2,  unicode'Die Lehrperson stellt hilfreiche Materialien  (z. B. Literatur, Skript/Folien) zur Verfügung.'));
        QUESTIONS.push(Question(3,  unicode'Die Lehrperson benutzt Beispiele, die zu meinem Verständnis der Lehrinhalte beitragen.'));
        QUESTIONS.push(Question(4,  unicode'Die Lehrperson bereitet die Inhalte klar und verständlich auf.'));
        QUESTIONS.push(Question(5,  unicode'Die Lehrperson gestaltet die Veranstaltung interessant und anregend.'));
        QUESTIONS.push(Question(6,  unicode'Die Lehrperson setzt Darstellungsweisen (z. B. Tafel, Präsentationen) sinnvoll ein.'));
        QUESTIONS.push(Question(7,  unicode'Die Lehrperson spricht deutlich und gut hörbar.'));
        QUESTIONS.push(Question(8,  unicode'Die Lehrperson ist auf die Veranstaltung gut vorbereitet.'));
        QUESTIONS.push(Question(9,  unicode'Die Lehrperson geht auf Fragen und Anregungen der Studierenden angemessen ein.'));
        QUESTIONS.push(Question(10, unicode'Die Lehrperson knüpft an mein Vorwissen oder meine Vorerfahrungen an.'));
        QUESTIONS.push(Question(11, unicode'Die Lehrperson regt mich zur aktiven Auseinandersetzung mit den Inhalten an.'));
        QUESTIONS.push(Question(12, unicode'Die Lehrperson verhält sich den Studierenden gegenüber freundlich und respektvoll.'));
        QUESTIONS.push(Question(13, unicode'Die Lehrperson macht Zusammenhänge innerhalb des Themengebietes deutlich.'));
        QUESTIONS.push(Question(14, unicode'Die Lehrperson stellt Querbezüge zu Themen außerhalb der Veranstaltung her.'));
        QUESTIONS.push(Question(15, unicode'Die Lehrperson thematisiert Nutzen oder mögliche Anwendungen der Inhalte.'));
        QUESTIONS.push(Question(16, unicode'So ist es aktuell: Ich weiß sehr viel über das Thema der Veranstaltung.'));
        QUESTIONS.push(Question(17, unicode'So ist es aktuell: Ich kann die Inhalte der Veranstaltung anwenden.'));
        QUESTIONS.push(Question(18, unicode'So ist es aktuell: Ich finde das Thema der Veranstaltung interessant.'));
        QUESTIONS.push(Question(19, unicode'So war es vor der Veranstaltung: Ich wusste sehr viel über das Thema der Veranstaltung.'));
        QUESTIONS.push(Question(20, unicode'So war es vor der Veranstaltung: Ich konnte die Inhalte der Veranstaltung bereits anwenden.'));
        QUESTIONS.push(Question(21, unicode'So war es vor der Veranstaltung: Ich fand das Thema der Veranstaltung schon vorher interessant.'));
        QUESTIONS.push(Question(22, unicode'Die in dieser Veranstaltung gestellten Anforderungen sind...'));
        QUESTIONS.push(Question(23, unicode'Wie viele Stunden pro Woche bereiten Sie diese Lehrveranstaltung aktuell im Schnitt vor und nach?'));
        QUESTIONS.push(Question(24, unicode'Handelt es sich bei der Lehrveranstaltung ausschließlich um synchrone und/oder asynchrone Online-Lehre?'));
        QUESTIONS.push(Question(25, unicode'Haben Sie in der Lehrveranstaltung bisher Arbeitsaufträge/Aufgaben für das Selbststudium erhalten?'));
        QUESTIONS.push(Question(26, unicode'Wurden in der Lehrveranstaltung bisher kommunikative Lehr-Lernformen (z. B. Gruppenarbeiten, Diskussionen etc.) eingesetzt?'));
        QUESTIONS.push(Question(27, unicode'Wurden in der Lehrveranstaltung bisher digitale Tools eingesetzt (z. B. Live-Quizzes, virtuelle Whiteboards etc.)?'));
        QUESTIONS.push(Question(28, unicode'Wurden in der Lehrveranstaltung bisher Live-Veranstaltungen via Videokonferenztool angeboten?'));
        QUESTIONS.push(Question(29, unicode'Wurden in der Lehrveranstaltung bisher Lernvideos bzw. Vorlesungsaufzeichnungen bereitgestellt?'));
        QUESTIONS.push(Question(30, unicode'Welche Note (1-5) würden Sie der Veranstaltung geben?'));
        QUESTIONS.push(Question(31, unicode'Was hat Ihnen an dieser Veranstaltung bisher besonders gut gefallen?'));
        QUESTIONS.push(Question(32, unicode'Was könnte künftig besser gemacht werden?'));
        QUESTIONS.push(Question(33, unicode'Was möchten Sie noch mitteilen? Bitte nutzen Sie den Platz für weitere Verbesserungsvorschläge, Anregungen und Anmerkungen!'));
        QUESTIONS.push(Question(34, unicode'An dieser Lehrveranstaltung habe ich in folgendem Umfang teilgenommen.'));
        QUESTIONS.push(Question(35, unicode'In welchem Studiengang sind Sie aktuell eingeschrieben?'));
    }

    function createEvaluation(
        string memory name,
        uint256 startDate,
        uint256 endDate
    ) external returns (uint256) {
        require(startDate < endDate, "Start date must be before end date");
        require(startDate >= block.timestamp, "Start date must be in the future");

        uint256 groupId = semaphore.createGroup();

        console.log('createEvaluation: ', groupId);

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
        Evaluation storage evaluation = evaluations[groupId];
        require(!evaluation.participants[identityCommitment], 'Participant already added');
        require(!evaluation.finalized, 'Evaluation is finalized');

        evaluation.participants[identityCommitment] = true;
        evaluation.participantList.push(identityCommitment);
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
        require(block.timestamp >= evaluation.startDate, "Voting has not started yet");
        require(block.timestamp <= evaluation.endDate, "Voting has ended");

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

    function submitAnswers(
        uint256 evaluationId,
        uint256 identityCommitment,
        Answer[] calldata participantAnswers
    ) external {
        // Check if the evaluation is still open
        require(!evaluations[evaluationId].finalized, "Evaluation is finalized");

        // Check if the participant is allowed to submit answers
        require(evaluations[evaluationId].participants[identityCommitment], "Participant not found");

        // Clear previous answers (if any)
        delete answers[evaluationId][identityCommitment];

        // Store new answers
        for (uint256 i = 0; i < participantAnswers.length; i++) {
            answers[evaluationId][identityCommitment].push(participantAnswers[i]);
        }
    }

    function getAnswers(
        uint256 evaluationId,
        uint256 identityCommitment
    ) external view returns (Answer[] memory) {
        // Check if the evaluation is finalized
        require(evaluations[evaluationId].finalized, "Evaluation is not finalized");

        // Return the answers
        return answers[evaluationId][identityCommitment];
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