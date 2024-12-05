import { SemaphoreEthers } from '@semaphore-protocol/data';

import { SEMAPHORE_CONTRACT_ADDRESS } from '../../deployed_addresses.json';

export const getSemaphore = (args: { VITE_ETH_NETWORK_URL: string }) => {
  return new SemaphoreEthers(args.VITE_ETH_NETWORK_URL, {
    address: SEMAPHORE_CONTRACT_ADDRESS,
  });
};
