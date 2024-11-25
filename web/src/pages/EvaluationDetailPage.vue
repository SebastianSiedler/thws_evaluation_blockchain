<script setup lang="ts">
import AddParticipant from 'src/components/Evaluation/AddParticipant.vue';
import FinalizeEvaluation from 'src/components/Evaluation/FinalizeEvaluation.vue';
import MembersList from 'src/components/Evaluation/MembersList.vue';
import MessageList from 'src/components/Evaluation/MessageList.vue';
import SendVote from 'src/components/Evaluation/SendVote.vue';

import { useRoute } from 'vue-router';
import { z } from 'zod';

import { getClient } from 'src/client/contracts';

const route = useRoute();

const groupId = z.string().parse(route.params.id);

const { evaluation: client } = getClient();

type Role = 'creator' | 'voter';
const role: Role = 'creator'; // TODO: get role dynamic

const evaluation = client.getEvaluation({ groupId });
</script>

<template>
  <div class="q-pa-lg">
    <div>Evaluation Detail page {{ groupId }}</div>
    <FinalizeEvaluation
      v-if="!evaluation.data.value?.finalized"
      :groupId="groupId"
    />

    <div v-if="evaluation.data.value">
      <div>
        <span>Finalized: </span>
        <span> {{ evaluation.data.value.finalized }} </span>
      </div>
    </div>

    <!-- Members -->
    <MembersList :groupId="groupId" />

    <!-- Messages -->
    <MessageList :groupId="groupId" />

    <!-- Add Participant -->
    <AddParticipant :evaluationId="BigInt(groupId)" />

    <SendVote :groupId="groupId" />
  </div>
</template>
