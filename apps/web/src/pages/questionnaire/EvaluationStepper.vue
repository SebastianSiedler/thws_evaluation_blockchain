<script setup lang="ts">
import DegreePicker from 'src/components/Questionnaire/DegreePicker.vue';
import FivePointHighToLow from 'src/components/Questionnaire/FivePointHighToLow.vue';
import FivePointScale from 'src/components/Questionnaire/FivePointScale.vue';
import FivePointTime from 'src/components/Questionnaire/FivePointTime.vue';
import YesNoTicks from 'src/components/Questionnaire/YesNoTicks.vue';

import { Identity } from '@semaphore-protocol/core';
import { useQuasar } from 'quasar';
import { ref } from 'vue';

import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';
import { useQuestionnaireStore } from 'src/stores/questionnaireStore';

const $q = useQuasar();
const store = useQuestionnaireStore();
const client = getEvaluationContractClient();
const step = ref(1);

const props = defineProps<{
  groupId: string;
  identity: Identity;
}>();

const save = () => {
  const vote = reduceQuestionaire();
  console.debug('[vote:]', vote);
  client.vote
    .mutateAsync({
      vote: vote,
      groupId: props.groupId,
      _identity: props.identity,
    })
    .then(() => {
      $q.notify({
        message: 'Vote sent',
        color: 'positive',
      });
    })
    .catch((err) => {
      $q.notify({ message: err.message, color: 'negative' });
    });
};

function reduceQuestionaire() {
  const categorys = store.questionnaire;
  const questions = categorys.map((category) => {
    return category.questions.map((question) => {
      return question.answer;
    });
  });
  const answers = questions.flat();
  return answers.join('');
}
</script>

<template>
  <div class="q-pa-md">
    <q-stepper v-model="step" header-nav contracted color="primary" animated>
      <q-step
        v-for="(category, index) in store.questionnaire"
        :key="index"
        :name="index + 1"
        :title="category.title"
        icon="info"
        :done="step > index + 1"
      >
        <div class="q-pa-md">
          <div v-for="(question, qIndex) in category.questions" :key="qIndex">
            <q-banner class="bg-primary text-white">
              {{ question.question }}
            </q-banner>
            <div
              v-if="question.type === 'five-point-like-question'"
              class="q-pa-md"
            >
              <FivePointScale v-model="question.answer" />
            </div>
            <div
              v-if="question.type === 'five-point-high-to-low-question'"
              class="q-pa-md"
            >
              <FivePointHighToLow v-model="question.answer" />
            </div>
            <div
              v-if="question.type === 'five-point-time-estimate-question'"
              class="q-pa-md"
            >
              <FivePointTime v-model="question.answer" />
            </div>
            <div v-if="question.type === 'yes-no-question'" class="q-pa-md">
              <YesNoTicks v-model="question.answer" />
            </div>
            <div v-if="question.type === 'open-question'" class="q-pa-md">
              <q-editor v-model="question.answer" />
            </div>
            <div v-if="question.type === 'degree-question'" class="q-pa-md">
              <DegreePicker v-model="question.answer" />
            </div>
          </div>
        </div>
        <q-stepper-navigation>
          <q-btn
            v-if="step < store.questionnaire.length"
            @click="step++"
            color="primary"
            label="Continue"
          />
          <q-btn
            v-else
            @click="save"
            color="negative"
            label="Senden"
            :loading="client.vote.isPending.value"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<style lang="scss" scoped></style>
