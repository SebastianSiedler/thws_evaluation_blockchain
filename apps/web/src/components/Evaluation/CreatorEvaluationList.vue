<script setup lang="ts">
import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';

const props = defineProps<{
  walletAddress: string;
}>();
const client = getEvaluationContractClient();

const evaluationList = client.getCreatorEvaluationList(props.walletAddress);
</script>

<template>
  <div>
    <div class="text-h4 q-mb-md">
      Meine Evaluationen
      <span class="text-subtitle1">(Wallet-Adresse: {{ walletAddress }})</span>
    </div>

    <!-- Loading -->
    <div v-if="evaluationList.isLoading.value">Loading...</div>

    <!-- Error -->
    <div v-if="evaluationList.isError.value">
      Error: {{ evaluationList.error.value }}
    </div>

    <!-- Data -->
    <div v-if="evaluationList.data.value">
      <div v-if="evaluationList.data.value.length <= 0">
        No evaluations found
      </div>
      <q-list v-else separator bordered>
        <q-item
          v-for="{ groupId, name } in evaluationList.data.value"
          :key="groupId.toString()"
          :to="'/evaluation/' + groupId"
        >
          <q-item-section>{{ groupId }} - {{ name }}</q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
