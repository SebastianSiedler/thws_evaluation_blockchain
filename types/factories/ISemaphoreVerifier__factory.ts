/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  ISemaphoreVerifier,
  ISemaphoreVerifierInterface,
} from "../ISemaphoreVerifier";

const _abi = [
  {
    type: "function",
    name: "verifyProof",
    inputs: [
      {
        name: "_pA",
        type: "uint256[2]",
        internalType: "uint256[2]",
      },
      {
        name: "_pB",
        type: "uint256[2][2]",
        internalType: "uint256[2][2]",
      },
      {
        name: "_pC",
        type: "uint256[2]",
        internalType: "uint256[2]",
      },
      {
        name: "_pubSignals",
        type: "uint256[4]",
        internalType: "uint256[4]",
      },
      {
        name: "merkleTreeDepth",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
] as const;

export class ISemaphoreVerifier__factory {
  static readonly abi = _abi;
  static createInterface(): ISemaphoreVerifierInterface {
    return new Interface(_abi) as ISemaphoreVerifierInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ISemaphoreVerifier {
    return new Contract(address, _abi, runner) as unknown as ISemaphoreVerifier;
  }
}