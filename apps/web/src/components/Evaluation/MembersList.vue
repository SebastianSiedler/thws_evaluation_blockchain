<script setup lang="ts">
import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';
import { useEvaluationStore } from 'src/stores/evaluationStore';

const props = defineProps<{
  groupId: string;
}>();

const { _identity } = useEvaluationStore();

const client = getEvaluationContractClient();

const evaluationMembers = client.getEvaluationMembers({
  groupId: props.groupId,
});
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="evaluationMembers.isLoading.value">Loading...</div>

    <!-- Error -->
    <div v-if="evaluationMembers.isError.value">
      Error: {{ evaluationMembers.error.value }}
    </div>

    <!-- Data -->
    <div v-if="evaluationMembers.data.value">
      <div class="text-h6">
        Teilnehmer ({{ evaluationMembers.data.value.length }})
      </div>
      <div v-if="evaluationMembers.data.value.length <= 0">
        Keine Teilnehmer vorhanden
      </div>
      <q-list bordered separator v-else>
        <q-item
          v-for="member in evaluationMembers.data.value"
          :key="member.toString()"
        >
          <q-item-section>
            <span v-if="member.toString() == _identity?.commitment.toString()">
              (Ich)
            </span>
            <span>{{ member }}</span>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
