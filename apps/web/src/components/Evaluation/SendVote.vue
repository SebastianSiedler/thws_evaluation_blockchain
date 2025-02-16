<script setup lang="ts">
import { Identity } from '@semaphore-protocol/core';
import { useQuasar } from 'quasar';
import { ref } from 'vue';

import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';

// import { useQuestionnaireStore } from 'src/stores/questionnaireStore';

const client = getEvaluationContractClient();
// const store = useQuestionnaireStore();

const $q = useQuasar();

const message = ref('');

const props = defineProps<{
  groupId: string;
  identity: Identity;
}>();

const sendVote = () => {
  const vote = reduceQuestionaire();
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
      message.value = '';
    })
    .catch((err) => {
      $q.notify({ message: err.message, color: 'negative' });
    });
};

function reduceQuestionaire() {
  // const answers = store.questionnaire.reduce((acc, category) => {
  //   return acc.concat(category.questions.map((q) => q.answer));
  // }, []);
  // console.debug('[questions:]', answers.join(''));
  // return answers.join('');
  return 'temp';
}
</script>

<template>
  <div class="row">
    <div class="col-10">
      <q-btn @click="sendVote" :loading="client.vote.isPending.value">
        vote senden
      </q-btn>
    </div>
  </div>
</template>
