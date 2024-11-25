## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
$ forge script script/Counter.s.sol:CounterScript --broadcast --rpc-url <your_rpc_url> --private-key <your_private_key> # ohne --broadcast wird nur der tx hash ausgegeben
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

### For Beginners

1. `forge build` - Compiles the contracts in the `src/` directory.
2. `forge test` - Runs the tests in the `tests/` directory.
3. `forge fmt` - Formats the code in the `src/` and `tests/` directories.
4. `forge snapshot` - Generates gas usage snapshots for the contracts in the `src/` directory.
5. `anvil` - Starts a local Ethereum node.
6. `forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>` - Deploys the `Counter` contract to the specified RPC URL using the specified private key.

RPC Url und private key werden beim starten von Anvil angezeigt.

## todo

- `cd lib/semaphore` und `pnpm dlx yarn install`
