<script setup lang="ts">
import { ref } from 'vue';
import { getClient } from 'src/client/contracts';
import { encodeBytes32String } from 'ethers';
import { generateProof, Group, Identity } from '@semaphore-protocol/core';
import { FeedbackContractABI } from 'src/client/contracts/FeedbackContract';
import { SemaphoreEthers } from '@semaphore-protocol/data';

// Reaktive Variablen für UI

const userFeedback = ref<string>('');
const client = getClient().feedback;
const identity = ref<Identity>(new Identity());

const createIdentity = () => {
  identity.value = new Identity();
  console.log(identity.value.export());
};
</script>

<template>
  <div>
    <div>
      <div>Private Key (base64): {{ identity.export() }}</div>
      <div>Public Key: {{ identity.publicKey[1].toString() }}</div>
      <div>Commitment: {{ identity.commitment.toString() }}</div>
      <q-btn @click="createIdentity">Create identity</q-btn>
    </div>

    <h1>Feedback DApp</h1>

    <div>
      <div>Groups:</div>
      <div v-for="group in client.getUsers.data.value" :key="group.groupId">
        <div>
          Users in group {{ group.groupId }} ({{ group.members.length }})
        </div>
        <q-list bordered separator>
          <q-item v-for="user in group.members" :key="user">
            <q-item-section>{{ user }}</q-item-section>
          </q-item>
        </q-list>
      </div>
      <pre>{{ JSON.stringify(client.getUsers.error.value, null, 2) }}</pre>
      <div>Loading: {{ client.getUsers.isLoading.value }}</div>
    </div>

    <div>
      <h2>Gruppe beitreten</h2>
      <q-btn
        @click="
          () => {
            client.joinGroup.mutate({ groupId: 0, identity: identity });
          }
        "
        :loading="client.joinGroup.isPending.value"
      >
        Gruppe beitreten
      </q-btn>
    </div>

    <div>
      <div>Feedback</div>
      <q-list bordered separator>
        <q-item v-for="(feedback, i) in client.getFeedback.data.value" :key="i">
          <!-- <q-item-section>{{ feedback.feedback }}</q-item-section> -->
          <q-item-section>{{ feedback }}</q-item-section>
        </q-item>
      </q-list>
    </div>

    <div>
      <h2>Feedback senden</h2>
      <q-input
        v-model="userFeedback"
        placeholder="Feedback eingeben"
        type="text"
      />
      <q-btn
        @click="
          client.sendFeedback.mutate({
            feedback: userFeedback,
            _identity: identity,
          })
        "
        :loading="client.sendFeedback.isPending.value"
      >
        Feedback senden
      </q-btn>

      <div v-if="client.sendFeedback.isPending.value">Loading...</div>

      <!-- Error -->
      <div v-if="client.sendFeedback.error.value">
        <div>Send feedback error:</div>
        <div>{{ client.sendFeedback.error.value }}</div>
      </div>
    </div>

    <pre>
        Join Group Error:
        <code>{{ client.joinGroup.error.value }}</code>

        Send Feedback Error:
        <code>{{ client.sendFeedback.error.value }}</code>
    </pre>
  </div>
</template>
