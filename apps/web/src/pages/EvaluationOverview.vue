<script setup lang="ts">
import CreatorEvaluationList from 'src/components/Evaluation/CreatorEvaluationList.vue';
import ParticipantEvaluationList from 'src/components/Evaluation/ParticipantEvaluationList.vue';

import { useQuasar } from 'quasar';
import { ref } from 'vue';

import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';
import { useEvaluationStore } from 'src/stores/evaluationStore';

const client = getEvaluationContractClient();
const newEvaluationName = ref('');

const $q = useQuasar();

const createNewEvaluation = () => {
  client.createEvaluation
    .mutateAsync({ name: newEvaluationName.value })
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

const store = useEvaluationStore();
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

      <q-input v-model="newEvaluationName" />

      <q-btn
        :disable="newEvaluationName.length <= 0"
        @click="createNewEvaluation"
        :loading="client.createEvaluation.isPending.value"
      >
        Create
      </q-btn>
    </div>

    <ParticipantEvaluationList
      v-if="store._identity"
      :identity="store._identity"
    />
    <div v-else>
      Sign in with your identity to get a view of all evaluations, where you can
      vote
    </div>

    <CreatorEvaluationList
      v-if="store.wallet.state"
      :walletAddress="store.wallet.state[0]"
    />
    <div v-else>
      Sign in with your wallet (eth wallet in meta mask) to get a view of all
      evaluations, where you can alter you evaluations
    </div>
  </div>
</template>
