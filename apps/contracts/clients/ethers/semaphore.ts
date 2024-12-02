import { SEMAPHORE_CONTRACT_ADDRESS } from "../../deployed_addresses.json";
import { SemaphoreEthers } from "@semaphore-protocol/data";

const ethNetworkProviderUrl = "http://127.0.0.1:8545"; // TODO: .env

export const semaphore = new SemaphoreEthers(ethNetworkProviderUrl, {
  address: SEMAPHORE_CONTRACT_ADDRESS,
});
