<script setup lang="ts">
import { useQuasar } from 'quasar';
import { getClient } from 'src/client/contracts';

const client = getClient().evaluation;
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
    @click="finalizeEvaluation"
    :loading="client.finalizeEvaluation.isPending.value"
  >
    Finalize Evaluation
  </q-btn>
</template>
