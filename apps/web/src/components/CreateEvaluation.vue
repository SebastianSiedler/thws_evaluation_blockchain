<script setup lang="ts">
import DatePicker from 'src/components/Evaluation/DatePicker.vue';

import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';

const router = useRouter();
const $q = useQuasar();
const client = getEvaluationContractClient();

const newEvaluationName = ref('');
const newStartDateTime = ref<string>(
  new Date(new Date().getTime() + 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16)
    .replace('T', ' '),
);
const newEndDateTime = ref<string>(
  new Date(new Date().getTime() + 60 * 60 * 1000 + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16)
    .replace('T', ' '),
);

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
  const now = new Date(new Date().getTime() - 60 * 1000);

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
        <div class="text-h6">Neue Evaluation Erstellen</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="newEvaluationName"
          label="Evaluation Name"
          class="q-mb-md"
        />

        <DatePicker v-model="newStartDateTime" class="q-mb-md" />
        <DatePicker v-model="newEndDateTime" class="q-mb-md" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="Abbrechen"
          color="primary"
          flat
          @click="router.push('/evaluation')"
        />
        <q-btn
          :loading="client.createEvaluation.isPending.value"
          label="Erstellen"
          color="primary"
          :disable="!newEvaluationName || !newStartDateTime || !newEndDateTime"
          @click="createNewEvaluation"
        />
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
