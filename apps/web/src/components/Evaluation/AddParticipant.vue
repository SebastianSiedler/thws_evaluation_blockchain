<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';

import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';

const client = getEvaluationContractClient();
const $q = useQuasar();

const props = defineProps<{
  evaluationId: bigint;
}>();

// Store multiple identity commitments
const identityCommitments = ref<string[]>(['']);

const addParticipant = async () => {
  for (const commitment of identityCommitments.value) {
    if (!commitment.trim()) continue; // Skip empty entries

    try {
      await client.addParticipant.mutateAsync({
        evaluationId: props.evaluationId,
        identityCommitment: BigInt(commitment),
      });

      $q.notify({
        message: 'Teilnehmer hinzugefügt',
        color: 'positive',
      });
    } catch (err) {
      $q.notify({ message: `Error adding "${commitment}"`, color: 'negative' });
    }
  }

  // Reset input fields after successful addition
  identityCommitments.value = [''];
};

const addNewInputField = () => {
  identityCommitments.value.push('');
};

const removeInputField = (index: number) => {
  identityCommitments.value.splice(index, 1);
};
</script>

<template>
  <div>
    <div
      v-for="(commitment, index) in identityCommitments"
      :key="index"
      class="row q-mb-sm"
    >
      <div class="col-10">
        <q-input
          v-model="identityCommitments[index]"
          placeholder="Identity Commitment"
          type="text"
        />
      </div>
      <div class="col-2">
        <q-btn
          icon="remove"
          flat
          color="negative"
          @click="removeInputField(index)"
          v-if="identityCommitments.length > 1"
        />
      </div>
    </div>

    <div class="q-mt-sm q-mb-lg">
      <q-btn
        label="Weitere hinzufügen"
        color="primary"
        flat
        style="margin-right: 10px"
        @click="addNewInputField"
      />
      <q-btn
        @click="addParticipant"
        :loading="client.addParticipant.isPending.value"
        color="primary"
      >
        Teilnehmer hinzufügen
      </q-btn>
    </div>
  </div>
</template>
