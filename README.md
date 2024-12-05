# THWS Evaluation Platform

This is an decentrailced app (DApp) based on the Ethereum Platform.
With the help of the [Semaphore Protocol](https://semaphore.pse.dev/) on Layer 2, we can create a platform for evaluating the students and teachers in a decentralized way.

## Contributing

### Prerequisites

- Node.js

### Setup

```bash
# install the dependencies
pnpm install --shamefully-hoist

# Start the development server
pnpm dev
```

### Folder Structure

```
.github
  └─ workflows
    └── CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ contracts
  |     ├─ Hardhat
  |     └─ Solidity Contracts (.sol)
  ├─ relayer
  |    └─ fastify(node.js)
  |
  └─ web
      └─ quasar (vue.js)
```
