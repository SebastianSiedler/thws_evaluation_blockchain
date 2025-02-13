<script setup lang="ts">
import CreatorEvaluationList from 'src/components/Evaluation/CreatorEvaluationList.vue';
import ParticipantEvaluationList from 'src/components/Evaluation/ParticipantEvaluationList.vue';

import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';

import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';
import { useEvaluationStore } from 'src/stores/evaluationStore';

const client = getEvaluationContractClient();
const store = useEvaluationStore();
const $q = useQuasar();

const newEvaluationName = ref('');
const newStartDateTime = ref<string | null>(null);
const newEndDateTime = ref<string | null>(null);

const activeTab = ref('global'); // Steuerung der Tabs

const createNewEvaluation = () => {
  if (!newStartDateTime.value || !newEndDateTime.value) {
    $q.notify({
      message: 'Start and end date/time are required.',
      color: 'negative',
    });
    return;
  }

  const startDateTimeObj = new Date(newStartDateTime.value);
  const endDateTimeObj = new Date(newEndDateTime.value);
  const now = new Date();

  if (startDateTimeObj < now || startDateTimeObj >= endDateTimeObj) {
    $q.notify({ message: 'Invalid date range.', color: 'negative' });
    return;
  }

  client.createEvaluation
    .mutateAsync({
      name: newEvaluationName.value,
      startDate: Math.floor(startDateTimeObj.getTime() / 1000),
      endDate: Math.floor(endDateTimeObj.getTime() / 1000),
    })
    .then(() => {
      $q.notify({ message: 'Evaluation created', color: 'positive' });
    })
    .catch((err) => {
      $q.notify({ message: err.message, color: 'negative' });
    });
};

const globalEvaluations = computed(
  () => client.getEvaluationList.data.value || [],
);
</script>

<template>
  <div class="q-pa-md">
    <div class="text-h5 q-mb-md">Evaluation Overview</div>

    <q-tabs v-model="activeTab" class="bg-primary text-white">
      <q-tab name="global" label="Global Evaluations" />
      <q-tab
        name="participated"
        label="Participated Evaluations"
        v-if="store._identity"
      />
      <q-tab name="own" label="My Evaluations" v-if="store.wallet.state" />
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated>
      <q-tab-panel name="global">
        <div v-if="client.getEvaluationList.isLoading.value">Loading...</div>
        <div v-else-if="client.getEvaluationList.isError.value">
          Error: {{ client.getEvaluationList.error.value }}
        </div>
        <q-list v-if="globalEvaluations.length > 0" separator bordered>
          <q-item
            v-for="{ groupId } in globalEvaluations"
            :key="groupId"
            :to="'/evaluation/' + groupId"
          >
            <q-item-section>{{ groupId }}</q-item-section>
          </q-item>
        </q-list>
        <div v-else>No evaluations found.</div>
      </q-tab-panel>

      <q-tab-panel name="participated">
        <ParticipantEvaluationList
          v-if="store._identity"
          :identity="store._identity"
        />
        <div v-else>Sign in to view participated evaluations.</div>
      </q-tab-panel>

      <q-tab-panel name="own">
        <CreatorEvaluationList
          v-if="store.wallet.state"
          :walletAddress="store.wallet.state[0]"
        />
        <div v-else>Sign in to view your evaluations.</div>
      </q-tab-panel>
    </q-tab-panels>

    <q-card class="q-mt-md q-pa-md">
      <div class="text-h6 q-mb-md">Create New Evaluation</div>
      <q-input
        v-model="newEvaluationName"
        label="Evaluation Name"
        class="q-mb-md"
      />
      <q-input
        v-model="newStartDateTime"
        label="Start Date/Time"
        type="datetime-local"
        class="q-mb-md"
      />
      <q-input
        v-model="newEndDateTime"
        label="End Date/Time"
        type="datetime-local"
        class="q-mb-md"
      />
      <q-btn
        :disable="!newEvaluationName || !newStartDateTime || !newEndDateTime"
        @click="createNewEvaluation"
        color="primary"
        >Create</q-btn
      >
    </q-card>
  </div>
</template>
