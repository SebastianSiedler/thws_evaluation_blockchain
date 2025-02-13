<script setup lang="ts">
import CreatorEvaluationList from 'src/components/Evaluation/CreatorEvaluationList.vue';
import ParticipantEvaluationList from 'src/components/Evaluation/ParticipantEvaluationList.vue';

import { useQuasar } from 'quasar';
import { ref } from 'vue';

import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';
import { useEvaluationStore } from 'src/stores/evaluationStore';

const client = getEvaluationContractClient();
const newEvaluationName = ref('');
const newStartDateTime = ref<string | null>(null); // Als String speichern (Datum + Uhrzeit)
const newEndDateTime = ref<string | null>(null); // Als String speichern (Datum + Uhrzeit)

const $q = useQuasar();

const createNewEvaluation = () => {
  if (!newStartDateTime.value || !newEndDateTime.value) {
    $q.notify({
      message: 'Start and end date/time are required.',
      color: 'negative',
    });
    return;
  }

  // Konvertiere die String-Daten in Date-Objekte für die Validierung
  const startDateTimeObj = new Date(newStartDateTime.value);
  const endDateTimeObj = new Date(newEndDateTime.value);

  // Aktuelles Datum und Uhrzeit
  const now = new Date();

  // Überprüfe, ob das Startdatum in der Vergangenheit liegt
  if (startDateTimeObj < now) {
    $q.notify({
      message: 'Start date/time cannot be in the past.',
      color: 'negative',
    });
    return;
  }

  // Überprüfe, ob das Startdatum vor dem Enddatum liegt
  if (startDateTimeObj >= endDateTimeObj) {
    $q.notify({
      message: 'Start date/time must be before end date/time.',
      color: 'negative',
    });
    return;
  }

  client.createEvaluation
    .mutateAsync({
      name: newEvaluationName.value,
      startDate: Math.floor(startDateTimeObj.getTime() / 1000), // Konvertiere in Unix-Timestamp
      endDate: Math.floor(endDateTimeObj.getTime() / 1000), // Konvertiere in Unix-Timestamp
    })
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

      <q-input
        v-model="newEvaluationName"
        label="Evaluation Name"
        class="q-mb-md"
      />

      <!-- Start Date/Time Input -->
      <q-input
        v-model="newStartDateTime"
        label="Start Date/Time"
        type="datetime-local"
        class="q-mb-md"
      />

      <!-- End Date/Time Input -->
      <q-input
        v-model="newEndDateTime"
        label="End Date/Time"
        type="datetime-local"
        class="q-mb-md"
      />

      <q-btn
        :disable="
          newEvaluationName.length <= 0 || !newStartDateTime || !newEndDateTime
        "
        @click="createNewEvaluation"
        :loading="client.createEvaluation.isPending.value"
      >
        Create
      </q-btn>
      <q-btn to="/evaluation/create" color="primary" class="q-mb-md">
        + Neue Evaluation erstellen
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
