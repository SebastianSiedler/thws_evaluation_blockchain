import '@nomicfoundation/hardhat-toolbox';
import '@semaphore-protocol/hardhat';

import { resolve } from 'path';
import { getHardhatNetworks } from '@semaphore-protocol/utils';
import { config as dotenvConfig } from 'dotenv';
import { expand } from 'dotenv-expand';
import { HardhatUserConfig } from 'hardhat/config';
import { z } from 'zod';

import './tasks/deploy';

const envRaw = expand(dotenvConfig({ path: resolve(__dirname, '../../.env') }));

export const env = z
  .object({
    VITE_ETH_CHAIN_ID: z.coerce.number().min(1),
    VITE_ETH_RELAYER_PK: z.string().min(1),
    VITE_ETH_NETWORK_URL: z.string().url(),
  })
  .parse(envRaw.parsed);

const config: HardhatUserConfig = {
  solidity: '0.8.23',
  defaultNetwork: process.env.DEFAULT_NETWORK || 'hardhat',
  networks: {
    hardhat: {
      chainId: env.VITE_ETH_CHAIN_ID,
      allowUnlimitedContractSize: true,
      initialBaseFeePerGas: 0, // Disable EIP-1559 base fee
    },
    ...getHardhatNetworks(process.env.ETHEREUM_PRIVATE_KEY),
  },
  gasReporter: {
    currency: 'USD',
    enabled: process.env.REPORT_GAS === 'true',
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  typechain: {
    target: 'ethers-v6',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
