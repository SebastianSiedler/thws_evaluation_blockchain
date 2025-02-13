<script setup lang="ts">
import AddParticipant from 'src/components/Evaluation/AddParticipant.vue';
import FinalizeEvaluation from 'src/components/Evaluation/FinalizeEvaluation.vue';
import MembersList from 'src/components/Evaluation/MembersList.vue';
import MessageList from 'src/components/Evaluation/MessageList.vue';
import SendVote from 'src/components/Evaluation/SendVote.vue';
import EvaluationStepper from 'src/pages/questionnaire/EvaluationStepper.vue';

import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';
import { useEvaluationStore } from 'src/stores/evaluationStore';

const route = useRoute();
const activeTab = ref('members');
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
</script>

<template>
  <div class="q-pa-lg" v-if="evaluation.data.value">
    <div class="text-h4 q-mb-md">{{ evaluation.data.value?.name }}</div>

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

    <q-tabs v-model="activeTab" class="bg-primary text-white">
      <q-tab name="members" label="Members" />
      <q-tab name="messages" label="Messages" />
      <q-tab name="evaluation" label="Evaluation" v-if="isGroupMember" />
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated>
      <q-tab-panel name="members">
        <MembersList :groupId="groupId" />
        <AddParticipant
          v-if="isEvaluationAdmin"
          :evaluationId="BigInt(groupId)"
        />
        <p v-else>Only an admin can add participants.</p>
      </q-tab-panel>

      <q-tab-panel name="messages">
        <MessageList :groupId="groupId" />
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
