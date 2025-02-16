<script setup lang="ts">
import { useQuasar } from 'quasar';

import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';

const client = getEvaluationContractClient();
const $q = useQuasar();

const props = defineProps<{
  groupId: string;
}>();

const finalizeEvaluation = () => {
  client.finalizeEvaluation
    .mutateAsync({ groupId: props.groupId })
    .then(() => {
      $q.notify({
        type: 'positive',
        message: 'Evaluation finalized successfully',
      });
    })
    .catch((error) => {
      $q.notify({
        type: 'negative',
        message: error.message,
      });
    });
};
</script>

<template>
  <q-btn
    color="primary"
    @click="finalizeEvaluation"
    :loading="client.finalizeEvaluation.isPending.value"
  >
    Evaluation Abschließen
  </q-btn>
</template>
