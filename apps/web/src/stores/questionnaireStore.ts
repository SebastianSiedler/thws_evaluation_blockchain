import { defineStore } from 'pinia';

export type FivePointLikeScale = 1 | 2 | 3 | 4 | 5;
export type Degree =
  | 1 // Bachelor Digitale Gesellschaft
  | 2 // Bachelor E-Commerce
  | 3 // Bachelor Informatik
  | 4 // Bachelor Informationssicherheit
  | 5 // Bachelor Wirtschaftsinformatik
  | 6 // Master Artificial Intelligence
  | 7 // Master Digital Business Systems
  | 8; // Anderer Studiengang

export type FivePointLikeScaleQuestion = {
  id: number;
  type: 'five-point-like-question';
  question: string;
  answer: FivePointLikeScale | 0;
};
export type FivePointHighToLowQuestion = {
  id: number;
  type: 'five-point-high-to-low-question';
  question: string;
  answer: FivePointLikeScale | 0;
};
export type FivePointTimeEstimateQuestion = {
  id: number;
  type: 'five-point-time-estimate-question';
  question: string;
  answer: FivePointLikeScale | 0;
};

type DegreeQuestion = {
  id: number;
  type: 'degree-question';
  question: string;
  answer: Degree | 0;
};

export type FivePointQuestion =
  | FivePointLikeScaleQuestion
  | FivePointHighToLowQuestion
  | FivePointTimeEstimateQuestion;

type Yes = 1;
type No = 2;

type YesNoQuestion = {
  id: number;
  type: 'yes-no-question';
  question: string;
  answer: Yes | No | 0;
};

type OpenQuestion = {
  id: number;
  type: 'open-question';
  question: string;
  answer: string;
};

export type Question =
  | FivePointLikeScaleQuestion
  | YesNoQuestion
  | OpenQuestion
  | FivePointTimeEstimateQuestion
  | FivePointHighToLowQuestion
  | FivePointHighToLowQuestion
  | DegreeQuestion;

type Category = {
  title: string;
  questions: Question[];
  completed: boolean;
};

export const useQuestionnaireStore = defineStore('questionnaire', () => {
  const questionnaire: Category[] = [
    {
      title: 'Dozierendenverhalten',
      questions: [
        {
          id: 0,
          type: 'five-point-like-question',
          question:
            'Die Lehrperson geht nach einer nachvollziehbaren Gliederung vor.',
          answer: 0,
        },
        {
          id: 1,
          type: 'five-point-like-question',
          question:
            'Die Lehrperson verdeutlicht die Lernziele, die die Studierenden in der Lehrveranstaltung erreichen sollen.',
          answer: 0,
        },
        {
          id: 2,
          type: 'five-point-like-question',
          question:
            'Die Lehrperson stellt hilfreiche Materialien  (z. B. Literatur, Skript/Folien) zur Verfügung.',
          answer: 0,
        },
        {
          id: 3,
          type: 'five-point-like-question',
          question:
            'Die Lehrperson benutzt Beispiele, die zu meinem Verständnis der Lehrinhalte beitragen.',
          answer: 0,
        },
      ],
      completed: false,
    },
    {
      title: 'Lernatmosphäre',
      questions: [
        {
          id: 4,
          type: 'five-point-like-question',
          question:
            'Die Lehrperson bereitet die Inhalte klar und verständlich auf.',
          answer: 0,
        },
        {
          id: 5,
          type: 'five-point-like-question',
          question:
            'Die Lehrperson gestaltet die Veranstaltung interessant und anregend.',
          answer: 0,
        },
        {
          id: 6,
          type: 'five-point-like-question',
          question:
            'Die Lehrperson setzt Darstellungsweisen (z. B. Tafel, Präsentationen) sinnvoll ein.',
          answer: 0,
        },
        {
          id: 7,
          type: 'five-point-like-question',
          question: 'Die Lehrperson spricht deutlich und gut hörbar.',
          answer: 0,
        },
        {
          id: 8,
          type: 'five-point-like-question',
          question: 'Die Lehrperson ist auf die Veranstaltung gut vorbereitet.',
          answer: 0,
        },
      ],
      completed: false,
    },
    {
      title: 'Interaktion',
      questions: [
        {
          id: 9,
          type: 'five-point-like-question',
          question:
            'Die Lehrperson geht auf Fragen und Anregungen der Studierenden angemessen ein.',
          answer: 0,
        },
        {
          id: 10,
          type: 'five-point-like-question',
          question:
            'Die Lehrperson knüpft an mein Vorwissen oder meine Vorerfahrungen an.',
          answer: 0,
        },
        {
          id: 11,
          type: 'five-point-like-question',
          question:
            'Die Lehrperson regt mich zur aktiven Auseinandersetzung mit den Inhalten an.',
          answer: 0,
        },
        {
          id: 12,
          type: 'five-point-like-question',
          question:
            'Die Lehrperson verhält sich den Studierenden gegenüber freundlich und respektvoll.',
          answer: 0,
        },
      ],
      completed: false,
    },
    {
      title: 'Überblick und Transfer',
      questions: [
        {
          id: 13,
          type: 'five-point-like-question',
          question:
            'Die Lehrperson macht Zusammenhänge innerhalb des Themengebietes deutlich.',
          answer: 0,
        },
        {
          id: 14,
          type: 'five-point-like-question',
          question:
            'Die Lehrperson stellt Querbezüge zu Themen außerhalb der Veranstaltung her.',
          answer: 0,
        },
        {
          id: 15,
          type: 'five-point-like-question',
          question:
            'Die Lehrperson thematisiert Nutzen oder mögliche Anwendungen der Inhalte.',
          answer: 0,
        },
      ],
      completed: false,
    },
    {
      title: 'Lernzuwachs',
      questions: [
        {
          id: 16,
          type: 'five-point-like-question',
          question:
            'So ist es aktuell: Ich weiß sehr viel über das Thema der Veranstaltung.',
          answer: 0,
        },
        {
          id: 17,
          type: 'five-point-like-question',
          question:
            'So ist es aktuell: Ich kann die Inhalte der Veranstaltung anwenden.',
          answer: 0,
        },
        {
          id: 18,
          type: 'five-point-like-question',
          question:
            'So ist es aktuell: Ich finde das Thema der Veranstaltung interessant.',
          answer: 0,
        },
        {
          id: 19,
          type: 'five-point-like-question',
          question:
            'So war es vor der Veranstaltung: Ich wusste sehr viel über das Thema der Veranstaltung.',
          answer: 0,
        },
        {
          id: 20,
          type: 'five-point-like-question',
          question:
            'So war es vor der Veranstaltung: Ich konnte die Inhalte der Veranstaltung bereits anwenden.',
          answer: 0,
        },
        {
          id: 21,
          type: 'five-point-like-question',
          question:
            'So war es vor der Veranstaltung: Ich fand das Thema der Veranstaltung schon vorher interessant.',
          answer: 0,
        },
      ],
      completed: false,
    },
    // {
    //   title: 'Arbeitsbelastung und Beurteilung der Lehrveranstaltung',
    //   questions: [
    //     {
    //       id: 22,
    //       type: 'five-point-like-question',
    //       question:
    //         'Die in dieser Veranstaltung gestellten Anforderungen sind...',
    //       answer: 0,
    //     },
    //     {
    //       id: 23,
    //       type: 'five-point-time-estimate-question',
    //       question:
    //         'Wie viele Stunden pro Woche bereiten Sie diese Lehrveranstaltung aktuell im Schnitt vor und nach?',
    //       answer: 0,
    //     },
    //     {
    //       id: 24,
    //       type: 'yes-no-question',
    //       question:
    //         'Handelt es sich bei der Lehrveranstaltung ausschließlich um synchrone und/oder asynchrone Online-Lehre?',
    //       answer: 0,
    //     },
    //     {
    //       id: 25,
    //       type: 'yes-no-question',
    //       question:
    //         'Haben Sie in der Lehrveranstaltung bisher Arbeitsaufträge/Aufgaben für das Selbststudium erhalten?',
    //       answer: 0,
    //     },
    //     {
    //       id: 26,
    //       type: 'yes-no-question',
    //       question:
    //         'Wurden in der Lehrveranstaltung bisher kommunikative Lehr-Lernformen (z. B. Gruppenarbeiten, Diskussionen etc.) eingesetzt?',
    //       answer: 0,
    //     },
    //     {
    //       id: 27,
    //       type: 'yes-no-question',
    //       question:
    //         'Wurden in der Lehrveranstaltung bisher digitale Tools eingesetzt (z. B. Live-Quizzes, virtuelle Whiteboards etc.)?',
    //       answer: 0,
    //     },
    //     {
    //       id: 28,
    //       type: 'yes-no-question',
    //       question:
    //         'Wurden in der Lehrveranstaltung bisher Live-Veranstaltungen via Videokonferenztool angeboten?',
    //       answer: 0,
    //     },
    //     {
    //       id: 29,
    //       type: 'yes-no-question',
    //       question:
    //         'Wurden in der Lehrveranstaltung bisher Lernvideos bzw. Vorlesungsaufzeichnungen bereitgestellt?',
    //       answer: 0,
    //     },
    //     {
    //       id: 30,
    //       type: 'five-point-like-question',
    //       question: 'Welche Note (1-5) würden Sie der Veranstaltung geben?',
    //       answer: 0,
    //     },
    //     {
    //       id: 31,
    //       type: 'open-question',
    //       question:
    //         'Was hat Ihnen an dieser Veranstaltung bisher besonders gut gefallen?',
    //       answer: '',
    //     },
    //     {
    //       id: 32,
    //       type: 'open-question',
    //       question: 'Was könnte künftig besser gemacht werden?',
    //       answer: '',
    //     },
    //     {
    //       id: 33,
    //       type: 'open-question',
    //       question:
    //         'Was möchten Sie noch mitteilen? Bitte nutzen Sie den Platz für weitere Verbesserungsvorschläge, Anregungen und Anmerkungen!',
    //       answer: '',
    //     },
    //   ],
    //   completed: false,
    // },
    {
      title: 'Weitere Angaben',
      questions: [
        {
          id: 34,
          type: 'five-point-like-question',
          question:
            'An dieser Lehrveranstaltung habe ich in folgendem Umfang teilgenommen.',
          answer: 0,
        },
        {
          id: 35,
          type: 'degree-question',
          question: 'In welchem Studiengang sind Sie aktuell eingeschrieben?',
          answer: 0,
        },
      ],
      completed: false,
    },
  ];

  return {
    questionnaire,
  };
});
