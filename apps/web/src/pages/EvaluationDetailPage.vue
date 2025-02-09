<script setup lang="ts">
import AddParticipant from 'src/components/Evaluation/AddParticipant.vue';
import FinalizeEvaluation from 'src/components/Evaluation/FinalizeEvaluation.vue';
import MembersList from 'src/components/Evaluation/MembersList.vue';
import MessageList from 'src/components/Evaluation/MessageList.vue';
import SendVote from 'src/components/Evaluation/SendVote.vue';
import EvaluationStepper from 'src/pages/questionnaire/EvaluationStepper.vue';

import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { z } from 'zod';

import { getEvaluationContractClient } from 'src/client/EvaluationContractClient';
import { useEvaluationStore } from 'src/stores/evaluationStore';

const route = useRoute();

const groupId = z.string().parse(route.params.id);

const client = getEvaluationContractClient();

const store = useEvaluationStore();

const members = client.getEvaluationMembers({ groupId });
const isGroupMember = computed(() => {
  return members.data.value?.includes(
    store._identity?.commitment ?? BigInt(-1),
  );
});

const evaluation = client.getEvaluation({ groupId });

const isEvaluationAdmin = computed(() => {
  const creatorAddress = evaluation.data.value?.creator.toLowerCase() ?? '';
  return store.wallet.state?.includes(creatorAddress);
});
</script>

<template>
  <div class="q-pa-lg" v-if="evaluation.data.value">
    <div class="text-h4">{{ evaluation.data.value?.name }}</div>
    <FinalizeEvaluation
      v-if="!evaluation.data.value?.finalized && isEvaluationAdmin"
      :groupId="groupId"
    />

    <div>
      <span>Finalized: </span>
      <span> {{ evaluation.data.value.finalized }} </span>
    </div>

    <!-- Members -->
    <MembersList :groupId="groupId" />

    <!-- Messages -->
    <MessageList :groupId="groupId" />

    <!-- Add Participant -->
    <AddParticipant :evaluationId="BigInt(groupId)" v-if="isEvaluationAdmin" />
    <p v-else>Only an admin is allowed to add participants to this group</p>

    <!-- Evaluation Stepper -->
    <!-- TODO: Move this to an separate subroute -->
    <div v-if="isGroupMember">
      <EvaluationStepper :groupId="groupId" />
    </div>

    <!-- Send Vote -->
    <SendVote
      :groupId="groupId"
      v-if="isGroupMember"
      :identity="store._identity!"
    />
    <p v-else>
      Unable to vote because you are not part of this group. Ask the group admin
      to add you identity to the group
    </p>
  </div>
  <div v-else-if="evaluation.isLoading.value">Loading...</div>

  <div v-else-if="evaluation.error.value">
    <q-banner>
      <div class="text-h6">Error</div>
      <div>{{ evaluation.error.value }}</div>
    </q-banner>
  </div>

  <div v-else>Unknown Error</div>
</template>
