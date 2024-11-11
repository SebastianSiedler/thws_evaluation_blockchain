<script setup lang="ts">
import { transactions } from '../../../broadcast/Counter.s.sol/31337/run-latest.json';
import { ref } from 'vue';
import { createPublicClient, createWalletClient, custom } from 'viem';
import { localhost, anvil } from 'viem/chains';
import { useAsyncState } from '@vueuse/core';
import { useQuasar } from 'quasar';

const $q = useQuasar();

// ABI for the smart contract
const ABI = [
  {
    type: 'function',
    name: 'increment',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'number',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'setNumber',
    inputs: [{ name: 'newNumber', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

// Replace with your smart contract address
const CONTRACT_ADDRESS = transactions[0].contractAddress;

// State variables
const newNumber = ref<bigint | null>(null);

// viem client setup
const publicClient = createPublicClient({
  chain: anvil, // or mainnet if on mainnet
  transport: custom(window.ethereum!),
});

const walletClient = createWalletClient({
  chain: anvil, // or mainnet if on mainnet
  transport: custom(window.ethereum!),
});

// Connect to the user's account via Ethereum provider
const accounts = await walletClient.getAddresses();
console.log(accounts);

const currentNumber = useAsyncState(
  async () => {
    console.log('getting current number...');
    const result = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'number',
    });
    console.log('current number:', result);
    return result;
  },
  null,
  {
    onSuccess: () => {
      $q.notify({
        type: 'positive',
        message: 'Zahl erfolgreich abgerufen',
      });
    },
    onError: (error) => {
      $q.notify({
        type: 'negative',
        message: 'Fehler beim Abrufen der Zahl',
      });
      console.error('Error fetching current number:', error);
    },
    throwError: true,
  },
);

// Function to set a new number in the contract
const setNumber = async () => {
  if (newNumber.value === null) return;
  try {
    await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'setNumber',
      args: [newNumber.value],
      account: accounts[0], // Include the account for signing the transaction
    });
    $q.notify({
      type: 'positive',
      message: 'Zahl erfolgreich gesetzt',
    });
    console.log('success');
    currentNumber.execute(); // Update the displayed number after setting
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Fehler beim Setzen der Zahl',
    });
    console.error('Error setting new number:', error);
  }
};

// Function to increment the number in the contract
const increment = async () => {
  try {
    await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'increment',
      account: accounts[0], // Include the account for signing the transaction
    });
    $q.notify({
      type: 'positive',
      message: 'Zahl erfolgreich inkrementiert',
    });
    console.log('incremented');
    currentNumber.execute(); // Update the displayed number after incrementing
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Fehler beim Inkrementieren der Zahl',
    });
    console.error('Error incrementing number:', error);
  }
};

const incrementMutation = useAsyncState(increment, null, { immediate: false });
</script>

<template>
  <q-page class="q-pa-sm">
    <h1 class="text-h6">Counter View</h1>
    <div v-if="currentNumber.isLoading.value">Loading...</div>
    <div>Aktuelle Zahl: {{ currentNumber.state.value }}</div>
    <pre>{{ currentNumber.error.value }}</pre>
    <div>
      <q-input
        v-model.number="newNumber"
        type="number"
        placeholder="Neue Zahl"
        style="width: 200px"
      />
    </div>
    <q-btn @click="setNumber">Set Number</q-btn>
    <q-btn
      @click="incrementMutation.execute()"
      :loading="incrementMutation.isLoading.value"
    >
      Increment
    </q-btn>

    <pre>{{ incrementMutation.error.value }}</pre>
  </q-page>
</template>
