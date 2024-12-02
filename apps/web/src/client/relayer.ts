import { contract } from '@acme/relayer/contract';
import { initClient } from '@ts-rest/core';

export const relayerClient = initClient(contract, {
  baseUrl: 'http://localhost:3000', //TODO: .env
  baseHeaders: {
    'x-app-source': 'ts-rest',
    // 'x-access-token': () => getAccessToken(),
  },
});
