import '@nomicfoundation/hardhat-toolbox';
import '@semaphore-protocol/hardhat';

import { resolve } from 'path';
import { getHardhatNetworks } from '@semaphore-protocol/utils';
import { config as dotenvConfig } from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';

import './tasks/deploy';

dotenvConfig({ path: resolve(__dirname, '../../.env') });

const config: HardhatUserConfig = {
  solidity: '0.8.23',
  defaultNetwork: process.env.DEFAULT_NETWORK || 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337, //TODO: to .env
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
