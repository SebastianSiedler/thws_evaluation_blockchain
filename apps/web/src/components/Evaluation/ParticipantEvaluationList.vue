<script setup lang="ts">
import { Identity } from '@semaphore-protocol/core';

import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';

const props = defineProps<{
  identity: Identity;
}>();

const client = getEvaluationContractClient();

const participantEvaluationList = client.getParticipantEvaluationList({
  identityCommitment: props.identity.commitment.toString(),
});
</script>

<template>
  <div>
    <div class="text-h4 q-mb-md">Verfügbare Evualationen</div>

    <!-- Loading -->
    <div v-if="participantEvaluationList.isLoading.value">Loading...</div>

    <!-- Error -->
    <div v-if="participantEvaluationList.isError.value">
      Error: {{ participantEvaluationList.error.value }}
    </div>

    <!-- Data -->
    <div v-if="participantEvaluationList.data.value">
      <div v-if="participantEvaluationList.data.value.length <= 0">
        <p>No evaluations found</p>
      </div>
      <q-list v-else separator bordered>
        <q-item
          v-for="{ groupId, name } in participantEvaluationList.data.value"
          :key="groupId.toString()"
          :to="'/evaluation/' + groupId"
        >
          <q-item-section>{{ groupId }} - {{ name }}</q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
