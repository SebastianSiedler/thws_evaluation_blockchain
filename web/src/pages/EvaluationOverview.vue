<script setup lang="ts">
import { useQuasar } from 'quasar';

import { getClient } from 'src/client/contracts';

const client = getClient().evaluation;

const $q = useQuasar();

const createNewEvaluation = () => {
  client.createEvaluation
    .mutateAsync({})
    .then(() => {
      $q.notify({
        message: 'Evaluation created',
        color: 'positive',
      });
    })
    .catch((err) => {
      $q.notify({ message: err.message, color: 'negative' });
    });
};
</script>

<template>
  <div class="q-pa-md">
    <div>
      <div class="text-h6">All (global) Evaluations</div>
      <!-- Loading -->
      <div v-if="client.getEvaluationList.isLoading.value">Loading...</div>

      <!-- Error -->
      <div v-if="client.getEvaluationList.isError.value">
        Error: {{ client.getEvaluationList.error.value }}
      </div>

      <!-- Data -->
      <div v-if="client.getEvaluationList.data.value">
        <div v-if="client.getEvaluationList.data.value.length <= 0">
          No evaluations found
        </div>
        <q-list v-else separator bordered>
          <q-item
            v-for="{ groupId } in client.getEvaluationList.data.value"
            :key="groupId"
            :to="'/evaluation/' + groupId"
          >
            <q-item-section>{{ groupId }}</q-item-section>
          </q-item>
        </q-list>
      </div>

      <q-btn
        @click="createNewEvaluation"
        :loading="client.createEvaluation.isPending.value"
      >
        Create
      </q-btn>
    </div>

    <div>
      <div class="text-h6">Participant Evaluations (IdentityCommit)</div>

      <!-- Loading -->
      <div v-if="client.getParticipantEvaluationList.isLoading.value">
        Loading...
      </div>

      <!-- Error -->
      <div v-if="client.getParticipantEvaluationList.isError.value">
        Error: {{ client.getParticipantEvaluationList.error.value }}
      </div>

      <!-- Data -->
      <div v-if="client.getParticipantEvaluationList.data.value">
        <div v-if="client.getParticipantEvaluationList.data.value.length <= 0">
          No evaluations found
        </div>
        <q-list v-else separator bordered>
          <q-item
            v-for="{ groupId } in client.getParticipantEvaluationList.data
              .value"
            :key="groupId"
            :to="'/evaluation/' + groupId"
          >
            <q-item-section>{{ groupId }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

    <div>
      <div class="text-h6">Creator Evaluations (WalletAddress)</div>

      <!-- Loading -->
      <div v-if="client.getCreatorEvaluationList.isLoading.value">
        Loading...
      </div>

      <!-- Error -->
      <div v-if="client.getCreatorEvaluationList.isError.value">
        Error: {{ client.getCreatorEvaluationList.error.value }}
      </div>

      <!-- Data -->
      <div v-if="client.getCreatorEvaluationList.data.value">
        <div v-if="client.getCreatorEvaluationList.data.value.length <= 0">
          No evaluations found
        </div>
        <q-list v-else separator bordered>
          <q-item
            v-for="{ groupId } in client.getCreatorEvaluationList.data.value"
            :key="groupId"
            :to="'/evaluation/' + groupId"
          >
            <q-item-section>{{ groupId }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </div>
</template>
