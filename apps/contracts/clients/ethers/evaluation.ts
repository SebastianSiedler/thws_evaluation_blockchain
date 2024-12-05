import { ethers } from 'ethers';

import {
  EvaluationPlatform,
  EvaluationPlatform__factory,
} from '../../typechain-types';

export const evaluationContractPlatform = {
  getRpcContract: (args: {
    VITE_ETH_NETWORK_URL: string;
    VITE_ETH_RELAYER_PK: string;
    VITE_EVALUATION_CONTRACT_ADDRESS: string;
  }) => {
    const rpcProvider = new ethers.JsonRpcProvider(args.VITE_ETH_NETWORK_URL);

    const wallet = new ethers.Wallet(args.VITE_ETH_RELAYER_PK, rpcProvider);
    const rpcContract: EvaluationPlatform = EvaluationPlatform__factory.connect(
      args.VITE_EVALUATION_CONTRACT_ADDRESS,
      wallet,
    );
    return {
      rpcContract,
      rpcProvider,
    };
  },
  getBrowserContract: async (args: {
    VITE_EVALUATION_CONTRACT_ADDRESS: string;
  }) => {
    if (!window?.ethereum) {
      throw new Error('No ethereum provider found');
    }

    const browserProvider = new ethers.BrowserProvider(window?.ethereum);

    const browserContract: EvaluationPlatform =
      EvaluationPlatform__factory.connect(
        args.VITE_EVALUATION_CONTRACT_ADDRESS,
        await browserProvider.getSigner(),
      );

    return {
      browserContract,
      browserProvider,
    };
  },
};
