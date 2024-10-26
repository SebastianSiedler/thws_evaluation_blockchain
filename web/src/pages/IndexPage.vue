<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ethers } from 'ethers';
import CounterContract from '../../../out/Counter.sol/Counter.json';
import { transactions } from '../../../broadcast/Counter.s.sol/31337/run-latest.json';
const contractAddress = transactions[0].contractAddress;

const currentNumber = ref(0);
const newNumber = ref(0);
let contract: ethers.Contract;

onMounted(async () => {
  // MetaMask-Verbindung herstellen
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum); // Mit MetaMask - muss ich noch die anvil ip in network eintragen
    // const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    const signer = await provider.getSigner();

    // Vertrag initialisieren
    contract = new ethers.Contract(
      contractAddress,
      CounterContract.abi,
      signer,
    );

    // Aktuelle Zahl abrufen
    await getCurrentNumber();
  } else {
    alert('Bitte installiere MetaMask!');
  }
});

const getCurrentNumber = async () => {
  try {
    currentNumber.value = await contract.number();
  } catch (error) {
    console.error('Error fetching number:', error);
  }
};

const setNumber = async () => {
  const tx = await contract.setNumber(newNumber.value);
  await tx.wait();
  await getCurrentNumber();
};

const increment = async () => {
  const tx = await contract.increment();
  await tx.wait();
  await getCurrentNumber();
};
</script>
<template>
  <q-page class="q-pa-sm">
    <h1 class="text-h6">Counter</h1>
    <div>Aktuelle Zahl: {{ currentNumber }}</div>
    <div>
      <q-input
        v-model.number="newNumber"
        type="number"
        placeholder="Neue Zahl"
        style="width: 200px"
      />
    </div>
    <q-btn @click="setNumber">Set Number</q-btn>
    <q-btn @click="increment">Increment</q-btn>
  </q-page>
</template>
