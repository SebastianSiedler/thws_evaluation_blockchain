<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';

import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';

const $q = useQuasar();
const client = getEvaluationContractClient();

const evaluationName = ref('');
const startDateTime = ref<string | null>(null); // Als String speichern (Datum + Uhrzeit)
const endDateTime = ref<string | null>(null); // Als String speichern (Datum + Uhrzeit)
const questions = ref<
  { type: 'text' | 'multiple-choice'; question: string; options?: string[] }[]
>([]);

const newQuestion = ref('');
const newQuestionType = ref<'text' | 'multiple-choice'>('text');
const newOptions = ref<string[]>([]);
const optionInput = ref('');
const createdGroupId = ref<string | null>(null);

const addQuestion = () => {
  if (newQuestion.value.trim() === '') return;
  if (
    newQuestionType.value === 'multiple-choice' &&
    newOptions.value.length === 0
  ) {
    $q.notify({
      message: 'Multiple-choice questions require at least one option.',
      color: 'negative',
    });
    return;
  }

  questions.value.push({
    type: newQuestionType.value,
    question: newQuestion.value,
    options:
      newQuestionType.value === 'multiple-choice'
        ? [...newOptions.value]
        : undefined,
  });
  newQuestion.value = '';
  newOptions.value = [];
};

const addOption = () => {
  if (optionInput.value.trim() !== '') {
    newOptions.value.push(optionInput.value);
    optionInput.value = '';
  }
};

const createEvaluation = async () => {
  if (evaluationName.value.trim() === '') {
    $q.notify({ message: 'Evaluation name is required.', color: 'negative' });
    return;
  }

  if (!startDateTime.value || !endDateTime.value) {
    $q.notify({
      message: 'Start and end date/time are required.',
      color: 'negative',
    });
    return;
  }

  // Konvertiere die String-Daten in Date-Objekte für die Validierung
  const startDateTimeObj = new Date(startDateTime.value);
  const endDateTimeObj = new Date(endDateTime.value);

  // Aktuelles Datum und Uhrzeit
  const now = new Date();

  // Überprüfe, ob das Startdatum in der Vergangenheit liegt
  if (startDateTimeObj < now) {
    $q.notify({
      message: 'Start date/time cannot be in the past.',
      color: 'negative',
    });
    return;
  }

  // Überprüfe, ob das Startdatum vor dem Enddatum liegt
  if (startDateTimeObj >= endDateTimeObj) {
    $q.notify({
      message: 'Start date/time must be before end date/time.',
      color: 'negative',
    });
    return;
  }

  try {
    const response = await client.createEvaluation.mutateAsync({
      name: evaluationName.value,
      startDate: Math.floor(startDateTimeObj.getTime() / 1000), // Konvertiere in Unix-Timestamp
      endDate: Math.floor(endDateTimeObj.getTime() / 1000), // Konvertiere in Unix-Timestamp
    });
    createdGroupId.value = response.receipt?.contractAddress || 'Unknown';
    $q.notify({
      message: `Evaluation created successfully! Group ID: ${createdGroupId.value}`,
      color: 'positive',
    });
  } catch (err: unknown) {
    $q.notify({ message: (err as Error).message, color: 'negative' });
  }
};

const date = ref<string>(new Date().toISOString());
</script>

<template>
  <div class="q-pa-md">
    <q-input v-model="evaluationName" label="Evaluation Name" class="q-mb-md" />

    <!-- Start Date/Time Input -->
    <q-input
      v-model="startDateTime"
      label="Start Date/Time"
      type="datetime-local"
      class="q-mb-md"
    />

    <!-- End Date/Time Input -->
    <q-input
      v-model="endDateTime"
      label="End Date/Time"
      type="datetime-local"
      class="q-mb-md"
    />

    <div class="q-pa-md" style="max-width: 300px">
      <q-input filled v-model="startDateTime">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="date" mask="YYYY-MM-DD HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-time v-model="startDateTime" mask="YYYY-MM-DD HH:mm" format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>

    <q-card class="q-pa-md">
      <q-input v-model="newQuestion" label="New Question" class="q-mb-sm" />
      <q-select
        v-model="newQuestionType"
        :options="['text', 'multiple-choice']"
        label="Question Type"
      />

      <div v-if="newQuestionType === 'multiple-choice'">
        <q-input
          v-model="optionInput"
          label="New Option"
          class="q-mb-sm"
          @keyup.enter="addOption"
        />
        <q-btn @click="addOption" class="q-mb-sm">Add Option</q-btn>
        <q-list bordered separator>
          <q-item v-for="(opt, index) in newOptions" :key="index">
            <q-item-section>{{ opt }}</q-item-section>
          </q-item>
        </q-list>
      </div>

      <q-btn @click="addQuestion" class="q-mt-md">Add Question</q-btn>
    </q-card>

    <q-list bordered separator class="q-mt-md">
      <q-item v-for="(q, index) in questions" :key="index">
        <q-item-section>
          <strong>{{ q.question }}</strong> ({{ q.type }})
          <ul v-if="q.options">
            <li v-for="(opt, i) in q.options" :key="i">{{ opt }}</li>
          </ul>
        </q-item-section>
      </q-item>
    </q-list>

    <q-btn @click="createEvaluation" class="q-mt-md" color="primary"
      >Create Evaluation</q-btn
    >
    <div v-if="createdGroupId" class="q-mt-md">
      <q-banner class="bg-green-3 text-white"
        >Evaluation created with Group ID: {{ createdGroupId }}</q-banner
      >
    </div>
  </div>
</template>
