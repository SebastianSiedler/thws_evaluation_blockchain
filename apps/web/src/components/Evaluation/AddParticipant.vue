<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';

import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';

const client = getEvaluationContractClient();
const $q = useQuasar();

const props = defineProps<{
  evaluationId: bigint;
}>();

const identityCommitment = ref<string>('');

const addParticipant = () => {
  client.addParticipant
    .mutateAsync({
      evaluationId: props.evaluationId,
      identityCommitment: BigInt(identityCommitment.value),
    })
    .then(() => {
      $q.notify({
        message: `Added participant with identity commitment "${identityCommitment.value}" to evaluation "${props.evaluationId}"`,
        color: 'positive',
      });
      identityCommitment.value = '';
    })
    .catch((err) => {
      $q.notify({ message: err.message, color: 'negative' });
    });
};
</script>

<template>
  <div class="row">
    <div class="col-10">
      <q-input
        v-model="identityCommitment"
        placeholder="Identity Commitment"
        type="text"
      />
    </div>

    <div class="col-2">
      <q-btn
        @click="addParticipant"
        :loading="client.addParticipant.isPending.value"
      >
        Add Participant
      </q-btn>
    </div>
  </div>
</template>
