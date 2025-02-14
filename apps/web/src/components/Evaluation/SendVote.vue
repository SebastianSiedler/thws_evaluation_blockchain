<script setup lang="ts">
import { Identity } from '@semaphore-protocol/core';
import { useQuasar } from 'quasar';
import { ref } from 'vue';

import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';
import { useQuestionnaireStore } from 'src/stores/questionnaireStore';

const client = getEvaluationContractClient();
const store = useQuestionnaireStore();

const $q = useQuasar();

const message = ref('');

const props = defineProps<{
  groupId: string;
  identity: Identity;
}>();

const sendVote = () => {
  deconstructAnswers();

  client.vote
    .mutateAsync({
      vote: message.value,
      groupId: props.groupId,
      _identity: props.identity,
    })
    .then(() => {
      $q.notify({
        message: 'Vote sent',
        color: 'positive',
      });
      message.value = '';
    })
    .catch((err) => {
      $q.notify({ message: err.message, color: 'negative' });
    });
};

const deconstructAnswers = () => {

  const answers = store.questionnaire.reduce((acc, category) => {
    category.questions.forEach((question) => {
      acc[question.id] = question.answer;
    });
    return acc;
  }, {});

  console.debug('answers', answers);

  // return answers.flat();
};
</script>

<template>
  <div class="row">
    <div class="col-2">
      <q-input v-model="message" label="Vote" />
    </div>
    <div class="col-10">
      <q-btn
        :disable="!message"
        @click="sendVote"
        :loading="client.vote.isPending.value"
      >
        send vote
      </q-btn>
    </div>
  </div>
</template>
