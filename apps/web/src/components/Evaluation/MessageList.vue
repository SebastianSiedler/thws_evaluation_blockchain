<script setup lang="ts">
import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';

const props = defineProps<{
  groupId: string;
}>();

const client = getEvaluationContractClient();

const evaluationMessages = client.getEvaluationMessages({
  groupId: props.groupId,
});
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="evaluationMessages.isLoading.value">Loading...</div>

    <!-- Error -->
    <div v-if="evaluationMessages.isError.value">
      Error: {{ evaluationMessages.error.value }}
    </div>

    <!-- Data -->
    <div v-if="evaluationMessages.data.value">
      <div class="text-h6">
        Messages ({{ evaluationMessages.data.value.length }})
      </div>
      <div v-if="evaluationMessages.data.value.length <= 0">
        No messages found
      </div>
      <q-list bordered separator v-else>
        <q-item
          v-for="message in evaluationMessages.data.value"
          :key="message.nullifier"
        >
          <q-item-section>{{ message.decodedMessage }}</q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
