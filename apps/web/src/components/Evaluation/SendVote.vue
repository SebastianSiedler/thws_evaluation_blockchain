<script setup lang="ts">
import { Identity } from '@semaphore-protocol/core';
import { useQuasar } from 'quasar';
import { ref } from 'vue';

import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';

const client = getEvaluationContractClient();
const $q = useQuasar();

const message = ref('');

const props = defineProps<{
  groupId: string;
  identity: Identity;
}>();

const sendVote = () => {
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
