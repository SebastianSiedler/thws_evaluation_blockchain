import { ethers } from 'ethers';

import { EVALUATION_CONTRACT_ADDRESS } from '../../deployed_addresses.json';
import {
  EvaluationPlatform,
  EvaluationPlatform__factory,
} from '../../typechain-types';

export const evaluationContractPlatform = {
  getRpcContract: () => {
    const rpcProvider = new ethers.JsonRpcProvider('http://localhost:8545'); // TODO: Replace with your network URL .env

    // Configure the signer //TODO: .env
    const ethereumPrivateKey =
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

    const wallet = new ethers.Wallet(ethereumPrivateKey, rpcProvider);
    const rpcContract: EvaluationPlatform = EvaluationPlatform__factory.connect(
      EVALUATION_CONTRACT_ADDRESS,
      wallet,
    );
    return {
      rpcContract,
      rpcProvider,
    };
  },
  getBrowserContract: async () => {
    if (!window?.ethereum) {
      throw new Error('No ethereum provider found');
    }

    const browserProvider = new ethers.BrowserProvider(window?.ethereum);

    const browserContract: EvaluationPlatform =
      EvaluationPlatform__factory.connect(
        EVALUATION_CONTRACT_ADDRESS,
        await browserProvider.getSigner(),
      );

    return {
      browserContract,
      browserProvider,
    };
  },
};
