import { Address } from 'viem';

import { transactions } from 'src/../../contracts/broadcast/DeployEvaluation.s.sol/31337/run-latest.json';

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
