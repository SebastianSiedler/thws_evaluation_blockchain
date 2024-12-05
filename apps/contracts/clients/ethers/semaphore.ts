import { SemaphoreEthers } from '@semaphore-protocol/data';

export const getSemaphore = (args: {
  VITE_ETH_NETWORK_URL: string;
  VITE_SEMAPHORE_CONTRACT_ADDRESS: string;
}) => {
  return new SemaphoreEthers(args.VITE_ETH_NETWORK_URL, {
    address: args.VITE_SEMAPHORE_CONTRACT_ADDRESS,
  });
};
