import {
  EvaluationPlatform,
  EvaluationPlatform__factory,
} from "@acme/contracts/typechain-types";
import { ethers } from "ethers";
import { EVALUATION_CONTRACT_ADDRESS } from "@acme/contracts/addresses/EvaluationContract";

export const getEvaluationContract = async () => {
  const provider = new ethers.JsonRpcProvider("http://localhost:8545"); //TODO: Replace with your network URL

  const signer = await provider.getSigner();

  const contract: EvaluationPlatform = EvaluationPlatform__factory.connect(
    EVALUATION_CONTRACT_ADDRESS,
    signer
  );

  return contract;
};
