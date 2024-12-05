import { contract } from '@acme/relayer/contract';
import { initClient } from '@ts-rest/core';

import { env } from 'src/boot/env';

export const relayerClient = initClient(contract, {
  baseUrl: env.VITE_RELAYER_URL,
  baseHeaders: {
    'x-app-source': 'ts-rest',
    // 'x-access-token': () => getAccessToken(),
  },
});
