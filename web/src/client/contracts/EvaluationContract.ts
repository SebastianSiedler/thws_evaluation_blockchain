export const EVALUATION_CONTRACT_ABI = [
  {
    type: 'constructor',
    inputs: [{ name: '_semaphore', type: 'address', internalType: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'addParticipant',
    inputs: [
      { name: 'groupId', type: 'uint256', internalType: 'uint256' },
      {
        name: 'identityCommitment',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createEvaluation',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'evaluations',
    inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      { name: 'creator', type: 'address', internalType: 'address' },
      { name: 'voteCount', type: 'uint256', internalType: 'uint256' },
      { name: 'finalized', type: 'bool', internalType: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'finalizeEvaluation',
    inputs: [
      { name: 'evaluationId', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getEvaluation',
    inputs: [
      { name: 'evaluationId', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct EvaluationPlatform.EvaluationData',
        components: [
          { name: 'creator', type: 'address', internalType: 'address' },
          {
            name: 'voteCount',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'participantList',
            type: 'uint256[]',
            internalType: 'uint256[]',
          },
          { name: 'finalized', type: 'bool', internalType: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getEvaluationList',
    inputs: [{ name: 'user', type: 'address', internalType: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct EvaluationPlatform.EvaluationListItemData[]',
        components: [
          {
            name: 'evaluationId',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'creator', type: 'address', internalType: 'address' },
          { name: 'finalized', type: 'bool', internalType: 'bool' },
          {
            name: 'participantSize',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getParticipantList',
    inputs: [
      { name: 'evaluationId', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256[]', internalType: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getUserEvaluations',
    inputs: [{ name: 'user', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256[]', internalType: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getVoteCount',
    inputs: [
      { name: 'evaluationId', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'semaphore',
    inputs: [],
    outputs: [
      { name: '', type: 'address', internalType: 'contract ISemaphore' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'userEvaluations',
    inputs: [
      { name: '', type: 'address', internalType: 'address' },
      { name: '', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'vote',
    inputs: [
      { name: 'groupId', type: 'uint256', internalType: 'uint256' },
      {
        name: 'merkleTreeDepth',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'merkleTreeRoot',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'nullifierHash',
        type: 'uint256',
        internalType: 'uint256',
      },
      { name: 'feedback', type: 'uint256', internalType: 'uint256' },
      { name: 'points', type: 'uint256[8]', internalType: 'uint256[8]' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

import { transactions } from '../../../../broadcast/DeployEvaluation.s.sol/31337/run-latest.json';

import { Address } from 'viem';

const address = transactions.find(
  (transaction) =>
    transaction.contractName === 'EvaluationPlatform' &&
    transaction.transactionType === 'CREATE',
)?.contractAddress;

if (!address) {
  throw new Error('Feedback contract address not found');
}

// @ts-expect-error Type 'string' is not assignable to type '`0x${string}`'.
export const EVALUATION_CONTRACT_ADDRESS: Address = address;
