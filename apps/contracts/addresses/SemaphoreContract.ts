import { transactions } from '../broadcast/DeployEvaluation.s.sol/31337/run-latest.json';

const address = transactions.find(
  (transaction) =>
    transaction.contractName === 'Semaphore' &&
    transaction.transactionType === 'CREATE',
)?.contractAddress;

if (!address) {
  throw new Error('Semaphore contract address not found');
}

export const SEMAPHORE_CONTRACT_ADDRESS = address;
