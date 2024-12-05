import { createEnv } from '@t3-oss/env-core';
import { isAddress } from 'ethers';
import { z } from 'zod';

export const AddressSchema = z.custom<string>(isAddress, 'Invalid eth Address');

export const env = createEnv({
  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: '',

  client: {
    VITE_ETH_NETWORK_PORT: z.coerce.number().min(1).max(65535),
    VITE_ETH_NETWORK_URL: z.string().url(),
    VITE_ETH_CHAIN_ID: z.coerce.number().min(1),

    VITE_ETH_RELAYER_PK: z.string().min(1),
    VITE_RELAYER_PORT: z.coerce.number().min(1).max(65535),
    VITE_RELAYER_URL: z.string().url(),

    VITE_ETH_DAPP_PORT: z.coerce.number().min(1).max(65535),
    VITE_WEB_DAPP_URL: z.string().url(),

    VITE_EVALUATION_CONTRACT_ADDRESS: AddressSchema,
    VITE_SEMAPHORE_CONTRACT_ADDRESS: AddressSchema,
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: process.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});
