<script setup lang="ts">
import CreatorEvaluationList from 'src/components/Evaluation/CreatorEvaluationList.vue';
import ParticipantEvaluationList from 'src/components/Evaluation/ParticipantEvaluationList.vue';

import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';
import { useEvaluationStore } from 'src/stores/evaluationStore';

const client = getEvaluationContractClient();
const store = useEvaluationStore();
const router = useRouter();
const $q = useQuasar();

// **Fehlende Definition von `tab` hinzugefügt**
const tab = ref('global');
</script>

<template>
  <div class="q-pa-md">
    <q-tabs v-model="tab" class="text-primary">
      <q-tab name="global" label="Global Evaluations" />
      <q-tab name="participated" label="Participated Evaluations" />
      <q-tab name="mine" label="My Evaluations" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <!-- Alle Globalen Evaluationen -->
      <q-tab-panel name="global">
        <div v-if="client.getEvaluationList.isLoading.value">Loading...</div>
        <div v-if="client.getEvaluationList.isError.value">
          Error: {{ client.getEvaluationList.error.value }}
        </div>
        <q-list v-if="client.getEvaluationList.data.value" separator bordered>
          <q-item
            v-for="{ groupId } in client.getEvaluationList.data.value"
            :key="groupId"
            :to="'/evaluation/' + groupId"
          >
            <q-item-section>{{ groupId }}</q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>

      <!-- Evaluationen, an denen man teilgenommen hat -->
      <q-tab-panel name="participated">
        <ParticipantEvaluationList
          v-if="store._identity"
          :identity="store._identity"
        />
        <div v-else>
          Sign in with your identity to view evaluations you can vote on.
        </div>
      </q-tab-panel>

      <!-- Eigene erstellte Evaluationen -->
      <q-tab-panel name="mine">
        <CreatorEvaluationList
          v-if="store.wallet.state"
          :walletAddress="store.wallet.state[0]"
        />
        <div v-else>
          Sign in with your wallet to manage your own evaluations.
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Floating Action Button -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        label="Create Evaluation"
        color="primary"
        @click="router.push('/evaluation/create')"
      />
    </q-page-sticky>
  </div>
</template>

<style scoped>
.q-page-sticky {
  z-index: 10;
}
</style>
