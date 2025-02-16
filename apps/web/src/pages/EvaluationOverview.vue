<script setup lang="ts">
import CreatorEvaluationList from 'src/components/Evaluation/CreatorEvaluationList.vue';
import ParticipantEvaluationList from 'src/components/Evaluation/ParticipantEvaluationList.vue';

import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useEvaluationStore } from 'src/stores/evaluationStore';

const store = useEvaluationStore();
const router = useRouter();

// **Fehlende Definition von `tab` hinzugefügt**
const tab = ref('participated');

const isAdmin = computed(() => {
  return store.wallet.state && store.wallet.state.length > 0;
});
</script>

<template>
  <div class="q-pa-md">
    <q-tabs v-model="tab" class="text-primary">
      <q-tab name="participated" label="Verfügbare Evaluationen" />
      <q-tab name="mine" label="Meine Evaluationen" v-if="isAdmin" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <!-- Evaluationen, an denen man teilgenommen hat -->
      <q-tab-panel name="participated">
        <ParticipantEvaluationList
          v-if="store._identity"
          :identity="store._identity"
        />
        <div v-else>
          Melden Sie sich mit Ihrer Identität an, um Bewertungen anzuzeigen, für
          die Sie abstimmen können.
        </div>
      </q-tab-panel>

      <!-- Eigene erstellte Evaluationen -->
      <q-tab-panel name="mine" v-if="isAdmin">
        <CreatorEvaluationList
          v-if="store.wallet.state"
          :walletAddress="store.wallet.state[0]"
        />
        <div v-else>
          Melden Sie sich mit Ihrer Wallet an, um Ihre eigenen Bewertungen zu
          verwalten.
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Floating Action Button -->
    <q-page-sticky v-if="isAdmin" position="bottom-right" :offset="[18, 18]">
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
