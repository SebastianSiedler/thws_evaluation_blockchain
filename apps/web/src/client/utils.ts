import { SemaphoreEthers } from '@semaphore-protocol/data';
import { decodeBytes32String, toBeHex } from 'ethers';
import {
  BaseError,
  ContractFunctionRevertedError,
  decodeAbiParameters,
  Hash,
  PublicClient,
} from 'viem';

export const getGroupMessages = async (args: {
  semaphore: SemaphoreEthers;
  groupId: string;
}) => {
  type GroupValidatedProof = {
    merkleTreeDepth: number;
    merkleTreeRoot: string;
    nullifier: string;
    message: string;
    scope: string;
    points: string[];
  };

  const { semaphore, groupId } = args;

  const proofs: GroupValidatedProof[] =
    await semaphore.getGroupValidatedProofs(groupId);

  const feedback = proofs.map(({ message, ...rest }) => {
    const decodedMessage = decodeBytes32String(toBeHex(message, 32));

    return {
      ...rest,
      message,
      decodedMessage,
    };
  });

  return feedback;
};

export async function getRevertReason(args: {
  transactionHash: Hash;
  publicClient: PublicClient;
}) {
  const { transactionHash, publicClient } = args;
  try {
    // Transaktion abrufen
    const tx = await publicClient.getTransaction({ hash: transactionHash });

    // Call simulieren, um die Revert-Daten zu erhalten
    const revertData = await publicClient.call({
      data: tx.input,
      to: tx.to,
      blockNumber: tx.blockNumber,
    });

    console.log({ revertData });

    // console.log({ revertData });

    // // ABI-Dekodierung des Revert-Grundes
    // const decodedReason = decodeAbiParameters(
    //   [{ type: 'string' }],
    //   `0x${revertData.data!.slice(10)}`, // Die ersten 4 Bytes entfernen (Function-Selector)
    // );

    // console.log('Revert Reason:', decodedReason[0]);
    // return decodedReason[0];
  } catch (err) {
    console.error('Fehler beim Abrufen des Revert-Grundes:', err);
    if (err instanceof BaseError) {
      console.log({ err });
      const revertError = err.walk(
        (err) => err instanceof ContractFunctionRevertedError,
      );
      return err;
      // if (revertError instanceof ContractFunctionRevertedError) {
      //   const errorName = revertError.data?.errorName ?? '';
      //   console.log(errorName);
      //   // do something with `errorName`
      // }
    }
  }
}
