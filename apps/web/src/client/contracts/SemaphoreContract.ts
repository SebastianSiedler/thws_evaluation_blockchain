import { transactions } from '@acme/contracts/broadcast/DeployEvaluation.s.sol/31337/run-latest.json';
import { Address } from 'viem';

const address = transactions.find(
  (transaction) =>
    transaction.contractName === 'Semaphore' &&
    transaction.transactionType === 'CREATE',
)?.contractAddress;

if (!address) {
  throw new Error('Semaphore contract address not found');
}

// @ts-expect-error - This is a valid address
export const SEMAPHORE_CONTRACT_ADDRESS: Address = address;
