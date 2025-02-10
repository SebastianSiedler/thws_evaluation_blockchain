import { defineStore } from 'pinia';

export type FivePointLikeScale =
  | { label: 'trifft gar nicht zu'; value: 1 }
  | { label: 'trifft eher nicht zu'; value: 2 }
  | { label: 'trifft teilweise zu'; value: 3 }
  | { label: 'trifft eher zu'; value: 4 }
  | { label: 'trifft voll zu'; value: 5 }
  | { label: null; value: null };

export type FivePointHighToLow =
  | { label: 'viel zu niedrig'; value: 5 }
  | { label: 'etwas zu niedrig'; value: 4 }
  | { label: 'genau richtig'; value: 3 }
  | { label: 'etwas zu hoch'; value: 2 }
  | { label: 'viel zu hoch'; value: 1 }
  | { label: null; value: null };

export type FivePointTimeEstimate =
  | { label: '0 Stunden'; value: 0 }
  | { label: 'bis zu einer Stunde'; value: 1 }
  | { label: '1-2 Stunden'; value: 2 }
  | { label: '3-4 Stunden'; value: 3 }
  | { label: '5-6 Stunden'; value: 5 }
  | { label: 'mehr als 6 Stunden'; value: 6 }
  | { label: null; value: null };

type FivePointLikeScaleQuestion = {
  type: 'five-point-like-question';
  question: string;
  answer: FivePointLikeScale | null;
};
type FivePointHighToLowQuestion = {
  type: 'five-point-high-to-low-question';
  question: string;
  answer: FivePointHighToLow | null;
};
type FivePointTimeEstimateQuestion = {
  type: 'five-point-time-estimate-question';
  question: string;
  answer: FivePointTimeEstimate | null;
};

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
  answer: string | null;
};

type Question =
  | FivePointLikeScaleQuestion
  | YesNoQuestion
  | OpenQuestion
  | FivePointTimeEstimateQuestion
  | FivePointHighToLowQuestion
  | FivePointHighToLowQuestion;

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
          answer: null,
        },
        {
          type: 'open-question',
          question: 'Was könnte künftig besser gemacht werden?',
          answer: null,
        },
        {
          type: 'open-question',
          question:
            'Was möchten Sie noch mitteilen? Bitte nutzen Sie den Platz für weitere Verbesserungsvorschläge, Anregungen und Anmerkungen!',
          answer: null,
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
          type: 'open-question',
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
