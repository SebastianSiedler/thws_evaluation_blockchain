import { SemaphoreEthers } from '@semaphore-protocol/data';
import { decodeBytes32String, toBeHex } from 'ethers';

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
