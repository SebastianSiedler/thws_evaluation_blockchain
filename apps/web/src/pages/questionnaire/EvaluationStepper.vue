<script setup lang="ts">
import DegreePicker from 'src/components/Questionnaire/DegreePicker.vue';
import FivePointHighToLow from 'src/components/Questionnaire/FivePointHighToLow.vue';
import FivePointScale from 'src/components/Questionnaire/FivePointScale.vue';
import FivePointTime from 'src/components/Questionnaire/FivePointTime.vue';
import YesNoTicks from 'src/components/Questionnaire/YesNoTicks.vue';

import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';

import { useQuestionnaireStore } from 'src/stores/questionnaireStore';

const $q = useQuasar();
const store = useQuestionnaireStore();
const step = ref(1);

const save = () => {
  $q.dialog({
    title: 'Thank you!',
    message: 'Your answers have been saved.',
    ok: 'OK',
  });
};

const next = () => {
  if (step.value < store.questionnaire.length) {
    step.value++;
  } else {
    save();
  }
};
</script>

<template>
  <div class="">
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
            @click="next"
            color="primary"
            label="Continue"
          />
          <q-btn v-else color="secondary" label="Finish" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<style lang="scss" scoped></style>
