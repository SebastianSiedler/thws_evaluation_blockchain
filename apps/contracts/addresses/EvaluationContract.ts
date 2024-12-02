import { transactions } from '../broadcast/DeployEvaluation.s.sol/31337/run-latest.json';


const address = transactions.find(
  (transaction) =>
    transaction.contractName === 'EvaluationPlatform' &&
    transaction.transactionType === 'CREATE',
)?.contractAddress;

if (!address) {
  throw new Error('Feedback contract address not found');
}

export const EVALUATION_CONTRACT_ADDRESS = address;
