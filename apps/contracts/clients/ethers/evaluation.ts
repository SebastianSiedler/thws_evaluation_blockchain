import {
  EvaluationPlatform,
  EvaluationPlatform__factory,
} from "../../typechain-types";
import { ethers } from "ethers";
import { EVALUATION_CONTRACT_ADDRESS } from "../../deployed_addresses.json";

export const evaluationContractPlatform = {
  getRpcContract: () => {
    const rpcProvider = new ethers.JsonRpcProvider("http://localhost:8545"); //TODO: Replace with your network URL

    // Configure the signer //TODO: .env
    const ethereumPrivateKey =
      "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";

    const wallet = new ethers.Wallet(ethereumPrivateKey, rpcProvider);
    const rpcContract: EvaluationPlatform = EvaluationPlatform__factory.connect(
      EVALUATION_CONTRACT_ADDRESS,
      wallet
    );
    return {
      rpcContract,
      rpcProvider,
    };
  },
  getBrowserContract: () => {
    // @ts-ignore TODO: find out, why window.ethereum is not defined
    if (!window?.ethereum) {
      throw new Error("No ethereum provider found");
    }

    // @ts-ignore
    const browserProvider = new ethers.BrowserProvider(window?.ethereum);

    const browserContract: EvaluationPlatform =
      EvaluationPlatform__factory.connect(
        EVALUATION_CONTRACT_ADDRESS,
        browserProvider
      );

    return {
      browserContract,
      browserProvider,
    };
  },
};
