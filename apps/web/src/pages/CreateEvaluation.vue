<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';

import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';

const $q = useQuasar();
const client = getEvaluationContractClient();

const evaluationName = ref('');
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

  try {
    const response = await client.createEvaluation.mutateAsync({
      name: evaluationName.value,
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
</script>

<template>
  <div class="q-pa-md">
    <q-input v-model="evaluationName" label="Evaluation Name" class="q-mb-md" />

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
