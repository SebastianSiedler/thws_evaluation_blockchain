<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';

const router = useRouter();
const $q = useQuasar();
const client = getEvaluationContractClient();

const newEvaluationName = ref('');
const newStartDateTime = ref<string | null>(null);
const newEndDateTime = ref<string | null>(null);
const identityCommits = ref<string>('');

const createNewEvaluation = async () => {
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

  if (startDateTimeObj < now) {
    $q.notify({
      message: 'Start date/time cannot be in the past.',
      color: 'negative',
    });
    return;
  }

  if (startDateTimeObj >= endDateTimeObj) {
    $q.notify({
      message: 'Start date/time must be before end date/time.',
      color: 'negative',
    });
    return;
  }

  try {
    await client.createEvaluation.mutateAsync({
      name: newEvaluationName.value,
      startDate: Math.floor(startDateTimeObj.getTime() / 1000),
      endDate: Math.floor(endDateTimeObj.getTime() / 1000),
    });

    $q.notify({
      message: 'Evaluation created successfully!',
      color: 'positive',
    });
    router.push('/evaluation');
  } catch (err) {
    $q.notify({ message: 'Failed to create evaluation.', color: 'negative' });
  }
};
</script>

<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Create New Evaluation</div>
      </q-card-section>

      <q-card-section>
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
        <q-input
          v-model="identityCommits"
          label="Identity Commits (comma-separated)"
          class="q-mb-md"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="Cancel"
          color="negative"
          flat
          @click="router.push('/evaluation')"
        />
        <q-btn label="Create" color="primary" @click="createNewEvaluation" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<style scoped>
.q-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.q-card {
  width: 400px;
}
</style>
