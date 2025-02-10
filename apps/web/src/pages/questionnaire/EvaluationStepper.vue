<script setup lang="ts">
import FivePointScale from 'src/components/Questionnaire/FivePointScale.vue';

import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';

import { useQuestionnaireStore } from 'src/stores/questionnaireStore';

const $q = useQuasar();
const store = useQuestionnaireStore();
const step = ref(1);
</script>

<template>
  <div class="q-pa-md">
    <q-stepper v-model="step" header-nav vertical color="primary" animated>
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
            <p>{{ question.question }}</p>
            <div
              v-if="question.type === 'five-point-like-question'"
              class="q-pa-md"
            >
              <FivePointScale v-model="question.answer" />
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
          <q-btn v-else color="secondary" label="Finish" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<style lang="scss" scoped></style>
