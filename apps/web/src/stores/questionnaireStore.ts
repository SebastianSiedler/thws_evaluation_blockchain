import { defineStore } from 'pinia';

export type FivePointLikeScale = 1 | 2 | 3 | 4 | 5 | null;
export type Degree = 
  'Bachelor Digitale Gesellschaft' |
  'Bachelor E-Commerce' |
  'Bachelor Informatik' |
  'Bachelor Informationssicherheit' |
  'Bachelor Wirtschaftsinformatik' |
  'Master Artificial Intelligence' |
  'Master Digital Business Systems' |
  'Anderer Studiengang' | 
  null;

export type FivePointLikeScaleQuestion = {
type: 'five-point-like-question';
question: string;
answer: FivePointLikeScale | null;
};
export type FivePointHighToLowQuestion = {
  type: 'five-point-high-to-low-question';
  question: string;
  answer: FivePointLikeScale | null;
};
export type FivePointTimeEstimateQuestion = {
  type: 'five-point-time-estimate-question';
  question: string;
  answer: FivePointLikeScale | null;
};

type DegreeQuestion = {
    type: 'degree-question';
    question: string;
    answer: Degree | null
  }

export type FivePointQuestion = FivePointLikeScaleQuestion | FivePointHighToLowQuestion | FivePointTimeEstimateQuestion;

type Yes = true;
type No = false;

type YesNoQuestion = {
  type: 'yes-no-question';
  question: string;
  answer: Yes | No | null;
};

type OpenQuestion = {
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
          type: 'five-point-like-question',
          question:
            'Die Lehrperson geht nach einer nachvollziehbaren Gliederung vor.',
          answer: null,
        },
        {
          type: 'five-point-like-question',
          question:
            'Die Lehrperson verdeutlicht die Lernziele, die die Studierenden in der Lehrveranstaltung erreichen sollen.',
          answer: null,
        },
        {
          type: 'five-point-like-question',
          question:
            'Die Lehrperson stellt hilfreiche Materialien  (z. B. Literatur, Skript/Folien) zur Verfügung.',
          answer: null,
        },
        {
          type: 'five-point-like-question',
          question:
            'Die Lehrperson benutzt Beispiele, die zu meinem Verständnis der Lehrinhalte beitragen.',
          answer: null,
        },
      ],
      completed: false,
    },
    {
      title: 'Lernatmosphäre',
      questions: [
        {
          type: 'five-point-like-question',
          question:
            'Die Lehrperson bereitet die Inhalte klar und verständlich auf.',
          answer: null,
        },
        {
          type: 'five-point-like-question',
          question:
            'Die Lehrperson gestaltet die Veranstaltung interessant und anregend.',
          answer: null,
        },
        {
          type: 'five-point-like-question',
          question:
            'Die Lehrperson setzt Darstellungsweisen (z. B. Tafel, Präsentationen) sinnvoll ein.',
          answer: null,
        },
        {
          type: 'five-point-like-question',
          question: 'Die Lehrperson spricht deutlich und gut hörbar.',
          answer: null,
        },
        {
          type: 'five-point-like-question',
          question: 'Die Lehrperson ist auf die Veranstaltung gut vorbereitet.',
          answer: null,
        },
      ],
      completed: false,
    },
    {
      title: 'Interaktion',
      questions: [
        {
          type: 'five-point-like-question',
          question:
            'Die Lehrperson geht auf Fragen und Anregungen der Studierenden angemessen ein.',
          answer: null,
        },
        {
          type: 'five-point-like-question',
          question:
            'Die Lehrperson knüpft an mein Vorwissen oder meine Vorerfahrungen an.',
          answer: null,
        },
        {
          type: 'five-point-like-question',
          question:
            'Die Lehrperson regt mich zur aktiven Auseinandersetzung mit den Inhalten an.',
          answer: null,
        },
        {
          type: 'five-point-like-question',
          question:
            'Die Lehrperson verhält sich den Studierenden gegenüber freundlich und respektvoll.',
          answer: null,
        },
      ],
      completed: false,
    },
    {
      title: 'Überblick und Transfer',
      questions: [
        {
          type: 'five-point-like-question',
          question:
            'Die Lehrperson macht Zusammenhänge innerhalb des Themengebietes deutlich.',
          answer: null,
        },
        {
          type: 'five-point-like-question',
          question:
            'Die Lehrperson stellt Querbezüge zu Themen außerhalb der Veranstaltung her.',
          answer: null,
        },
        {
          type: 'five-point-like-question',
          question:
            'Die Lehrperson thematisiert Nutzen oder mögliche Anwendungen der Inhalte.',
          answer: null,
        },
      ],
      completed: false,
    },
    {
      title: 'Lernzuwachs',
      questions: [
        {
          type: 'five-point-like-question',
          question:
            'So ist es aktuell: Ich weiß sehr viel über das Thema der Veranstaltung.',
          answer: null,
        },
        {
          type: 'five-point-like-question',
          question:
            'So ist es aktuell: Ich kann die Inhalte der Veranstaltung anwenden.',
          answer: null,
        },
        {
          type: 'five-point-like-question',
          question:
            'So ist es aktuell: Ich finde das Thema der Veranstaltung interessant.',
          answer: null,
        },
        {
          type: 'five-point-like-question',
          question:
            'So war es vor der Veranstaltung: Ich wusste sehr viel über das Thema der Veranstaltung.',
          answer: null,
        },
        {
          type: 'five-point-like-question',
          question:
            'So war es vor der Veranstaltung: Ich konnte die Inhalte der Veranstaltung bereits anwenden.',
          answer: null,
        },
        {
          type: 'five-point-like-question',
          question:
            'So war es vor der Veranstaltung: Ich fand das Thema der Veranstaltung schon vorher interessant.',
          answer: null,
        },
      ],
      completed: false,
    },
    {
      title: 'Arbeitsbelastung und Beurteilung der Lehrveranstaltung',
      questions: [
        {
          type: 'five-point-like-question',
          question:
            'Die in dieser Veranstaltung gestellten Anforderungen sind...',
          answer: null,
        },
        {
          type: 'five-point-time-estimate-question',
          question:
            'Wie viele Stunden pro Woche bereiten Sie diese Lehrveranstaltung aktuell im Schnitt vor und nach?',
          answer: null,
        },
        {
          type: 'yes-no-question',
          question:
            'Handelt es sich bei der Lehrveranstaltung ausschließlich um synchrone und/oder asynchrone Online-Lehre?',
          answer: null,
        },
        {
          type: 'yes-no-question',
          question:
            'Haben Sie in der Lehrveranstaltung bisher Arbeitsaufträge/Aufgaben für das Selbststudium erhalten?',
          answer: null,
        },
        {
          type: 'yes-no-question',
          question:
            'Wurden in der Lehrveranstaltung bisher kommunikative Lehr-Lernformen (z. B. Gruppenarbeiten, Diskussionen etc.) eingesetzt?',
          answer: null,
        },
        {
          type: 'yes-no-question',
          question:
            'Wurden in der Lehrveranstaltung bisher digitale Tools eingesetzt (z. B. Live-Quizzes, virtuelle Whiteboards etc.)?',
          answer: null,
        },
        {
          type: 'yes-no-question',
          question:
            'Wurden in der Lehrveranstaltung bisher Live-Veranstaltungen via Videokonferenztool angeboten?',
          answer: null,
        },
        {
          type: 'yes-no-question',
          question:
            'Wurden in der Lehrveranstaltung bisher Lernvideos bzw. Vorlesungsaufzeichnungen bereitgestellt?',
          answer: null,
        },
        {
          type: 'five-point-like-question',
          question: 'Welche Note (1-5) würden Sie der Veranstaltung geben?',
          answer: null,
        },
        {
          type: 'open-question',
          question:
            'Was hat Ihnen an dieser Veranstaltung bisher besonders gut gefallen?',
          answer: '',
        },
        {
          type: 'open-question',
          question: 'Was könnte künftig besser gemacht werden?',
          answer: '',
        },
        {
          type: 'open-question',
          question:
            'Was möchten Sie noch mitteilen? Bitte nutzen Sie den Platz für weitere Verbesserungsvorschläge, Anregungen und Anmerkungen!',
          answer: '',
        },
      ],
      completed: false,
    },
    {
      title: 'Weitere Angaben',
      questions: [
        {
          type: 'five-point-like-question',
          question:
            'An dieser Lehrveranstaltung habe ich in folgendem Umfang teilgenommen.',
          answer: null,
        },
        {
          type: 'degree-question',
          question: 'In welchem Studiengang sind Sie aktuell eingeschrieben?',
          answer: null,
        },
      ],
      completed: false,
    },
  ];

  return {
    questionnaire,
  };
});
