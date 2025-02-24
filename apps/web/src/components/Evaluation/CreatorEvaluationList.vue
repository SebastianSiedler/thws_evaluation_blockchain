<script setup lang="ts">
import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';

const props = defineProps<{
  walletAddress: string;
}>();

const client = getEvaluationContractClient();

const evaluationList = client.getCreatorEvaluationList(props.walletAddress);
const allEvaluations = client.getEvaluationList; // Holt ALLE Evaluations

// Funktion zur Berechnung der verbleibenden Zeit
const getTimeRemaining = (groupId: string) => {
  const evaluation = allEvaluations.data.value?.find(
    (e) => e.groupId === groupId,
  );
  if (!evaluation) return 'Keine Daten';

  const now = Math.floor(Date.now() / 1000);
  const start = evaluation.startDate;
  const end = evaluation.endDate;

  if (now < start) {
    return `Startet in ${formatTime(start - now)}`;
  } else if (now >= start && now < end) {
    return `Läuft noch ${formatTime(end - now)}`;
  } else {
    return 'Abgeschlossen';
  }
};

// Zeitformatierung (Tage, Stunden, Minuten)
const formatTime = (seconds: number) => {
  const days = Math.floor(seconds / (60 * 60 * 24));
  const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);

  if (days > 0) return `${days} Tage, ${hours} Std`;
  if (hours > 0) return `${hours} Std, ${minutes} Min`;
  return `${minutes} Min`;
};
</script>

<template>
  <div>
    <div class="text-h4 q-mb-md">
      Meine Evaluationen
      <span class="text-subtitle1">(Wallet-Adresse: {{ walletAddress }})</span>
    </div>

    <!-- Loading -->
    <div
      v-if="evaluationList.isLoading.value || allEvaluations.isLoading.value"
    >
      Loading...
    </div>

    <!-- Error -->
    <div v-if="evaluationList.isError.value || allEvaluations.isError.value">
      Error: {{ evaluationList.error.value || allEvaluations.error.value }}
    </div>

    <!-- Data -->
    <div v-if="evaluationList.data.value">
      <div v-if="evaluationList.data.value.length <= 0">
        Keine Evaluationen gefunden.
      </div>
      <q-list v-else separator bordered>
        <q-item
          v-for="{ groupId, name } in evaluationList.data.value"
          :key="groupId.toString()"
          :to="'/evaluation/' + groupId.toString()"
        >
          <q-item-section>
            <q-item-label>{{ name }}</q-item-label>
            <q-item-label caption>
              {{ getTimeRemaining(groupId) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
