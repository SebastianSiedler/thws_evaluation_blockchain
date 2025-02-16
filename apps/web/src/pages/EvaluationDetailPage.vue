<script setup lang="ts">
import AddParticipant from 'src/components/Evaluation/AddParticipant.vue';
import FinalizeEvaluation from 'src/components/Evaluation/FinalizeEvaluation.vue';
import MembersList from 'src/components/Evaluation/MembersList.vue';
import MessageList from 'src/components/Evaluation/MessageList.vue';
import SendVote from 'src/components/Evaluation/SendVote.vue';
import EvaluationStepper from 'src/pages/questionnaire/EvaluationStepper.vue';

import Chart from 'chart.js/auto';
import { computed, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';
import { useEvaluationStore } from 'src/stores/evaluationStore';

const route = useRoute();
const activeTab = ref('overview');
const groupId = computed(() =>
  Array.isArray(route.params.id) ? route.params.id[0] : route.params.id,
);
const client = getEvaluationContractClient();
const store = useEvaluationStore();

const evaluation = client.getEvaluation({ groupId: groupId.value });
const members = client.getEvaluationMembers({ groupId: groupId.value });

const isGroupMember = computed(() =>
  members.data.value?.includes(store._identity?.commitment ?? BigInt(-1)),
);

const isEvaluationAdmin = computed(() => {
  return store.wallet.state?.includes(
    evaluation.data.value?.creator.toLowerCase() ?? '',
  );
});

const votes = client.getEvaluationMessages({ groupId: groupId.value });

const totalVoters = computed(() => members.data.value?.length ?? 0);
const votesCast = computed(() => votes.data.value?.length ?? 0);
const votesRemaining = computed(() =>
  Math.max(totalVoters.value - votesCast.value, 0),
);

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

// **watchEffect stellt sicher, dass das Diagramm aktualisiert wird, wenn die Daten verfügbar sind**
watchEffect(() => {
  if (chartCanvas.value && totalVoters.value > 0) {
    if (chartInstance) {
      // Falls das Chart existiert, aktualisieren wir es
      chartInstance.data.datasets[0].data = [
        votesCast.value,
        votesRemaining.value,
      ];
      chartInstance.update();
    } else {
      // Erstelle das Chart nur, wenn es noch nicht existiert
      chartInstance = new Chart(chartCanvas.value, {
        type: 'pie',
        data: {
          labels: ['Abgegebene Stimmen', 'Noch nicht abgestimmt'],
          datasets: [
            {
              data: [votesCast.value, votesRemaining.value],
              backgroundColor: ['#4CAF50', '#FFC107'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }
});
</script>

<template>
  <div class="q-pa-lg" v-if="evaluation.data.value">
    <div class="text-h4 q-mb-md">{{ evaluation.data.value?.name }}</div>

    <q-tabs v-model="activeTab" class="bg-primary text-white">
      <q-tab name="overview" label="Overview" />
      <q-tab name="members" label="Members" />
      <q-tab name="evaluation" label="Evaluation" v-if="isGroupMember" />
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated>
      <q-tab-panel name="overview">
        <MessageList :groupId="groupId" />
        <div class="q-mt-md">
          <q-card class="q-pa-md">
            <q-card-section>
              <div class="text-h6">Abstimmungsbeteiligung</div>
              <div v-if="totalVoters > 0">
                <q-card-section>
                  <canvas
                    ref="chartCanvas"
                    style="max-width: 400px; margin: auto"
                  ></canvas>
                </q-card-section>
                <p class="text-center">
                  {{ votesCast }} von {{ totalVoters }} haben bereits abgestimmt
                  ({{ ((votesCast / totalVoters) * 100).toFixed(1) }}%)
                </p>
              </div>
              <div v-else>
                <q-banner class="bg-warning text-white">
                  Keine Stimmberechtigten vorhanden.
                </q-banner>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <q-card class="q-pa-md q-mb-md">
          <q-banner
            v-if="!evaluation.data.value?.finalized && isEvaluationAdmin"
            dense
          >
            <FinalizeEvaluation :groupId="groupId" />
          </q-banner>
          <q-banner class="bg-secondary text-white" v-else>
            <strong>Finalized:</strong>
            {{ evaluation.data.value.finalized ? 'Yes' : 'No' }}
          </q-banner>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="members">
        <AddParticipant
          v-if="isEvaluationAdmin"
          :evaluationId="BigInt(groupId)"
        />
        <p v-else>Only an admin can add participants.</p>
        <MembersList :groupId="groupId" />
      </q-tab-panel>

      <q-tab-panel name="evaluation" v-if="isGroupMember">
        <EvaluationStepper :groupId="groupId" />
        <SendVote
          :groupId="groupId"
          v-if="isGroupMember"
          :identity="store._identity!"
        />
      </q-tab-panel>
    </q-tab-panels>
  </div>

  <div v-else-if="evaluation.isLoading.value">Loading...</div>

  <div v-else-if="evaluation.error.value">
    <q-banner class="bg-negative text-white">
      <div class="text-h6">Error</div>
      <div>{{ evaluation.error.value }}</div>
    </q-banner>
  </div>

  <div v-else>Unknown Error</div>
</template>
