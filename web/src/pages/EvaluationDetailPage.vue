<script setup lang="ts">
import { getClient } from 'src/client/contracts';
import { useRoute } from 'vue-router';
import { z } from 'zod';
import AddParticipant from 'src/components/Evaluation/AddParticipant.vue';
import SendVote from 'src/components/Evaluation/SendVote.vue';
import { useEvaluationStore } from 'src/stores/evaluationStore';
import FinalizeEvaluation from 'src/components/Evaluation/FinalizeEvaluation.vue';

const route = useRoute();

const groupId = z.string().parse(route.params.id);

const { evaluation: client } = getClient();
const { _identity } = useEvaluationStore();

const evaluationMembers = client.getEvaluationMembers({ groupId });
const evaluationMessages = client.getEvaluationMessages({ groupId });

type Role = 'creator' | 'voter';
const role: Role = 'creator'; // TODO: get role dynamic
</script>

<template>
  <div class="q-pa-lg">
    <div>Evaluation Detail page {{ groupId }}</div>
    <FinalizeEvaluation :groupId="groupId" />

    <!-- Members -->
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
          Members ({{ evaluationMembers.data.value.length }})
        </div>
        <div v-if="evaluationMembers.data.value.length <= 0">
          No members found
        </div>
        <q-list bordered separator v-else>
          <q-item v-for="member in evaluationMembers.data.value" :key="member">
            <q-item-section>
              <span v-if="member.toString() == _identity.commitment.toString()">
                (You)
              </span>
              <span>{{ member }}</span>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

    <!-- Messages -->
    <div>
      <!-- Loading -->
      <div v-if="evaluationMessages.isLoading.value">Loading...</div>

      <!-- Error -->
      <div v-if="evaluationMessages.isError.value">
        Error: {{ evaluationMessages.error.value }}
      </div>

      <!-- Data -->
      <div v-if="evaluationMessages.data.value">
        <div class="text-h6">
          Messages ({{ evaluationMessages.data.value.length }})
        </div>
        <div v-if="evaluationMessages.data.value.length <= 0">
          No messages found
        </div>
        <q-list bordered separator v-else>
          <q-item
            v-for="message in evaluationMessages.data.value"
            :key="message.nullifier"
          >
            <q-item-section>{{ message.decodedMessage }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

    <!-- Add Participant -->
    <AddParticipant :evaluationId="BigInt(groupId)" />

    <SendVote :groupId="groupId" />

    <!-- TODO: check if identity is "creator" or "voter" and show condidtional components -->
  </div>
</template>
