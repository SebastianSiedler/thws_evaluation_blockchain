import { Address } from 'viem';

import { transactions } from '../../../../broadcast/DeployFeedback.s.sol/31337/run-latest.json';

export const FeedbackContractABI = {
  abi: [
    {
      type: 'constructor',
      inputs: [
        {
          name: 'semaphoreAddress',
          type: 'address',
          internalType: 'address',
        },
      ],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'groupId',
      inputs: [],
      outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'joinGroup',
      inputs: [
        {
          name: 'identityCommitment',
          type: 'uint256',
          internalType: 'uint256',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'semaphore',
      inputs: [],
      outputs: [
        { name: '', type: 'address', internalType: 'contract ISemaphore' },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'sendFeedback',
      inputs: [
        {
          name: 'merkleTreeDepth',
          type: 'uint256',
          internalType: 'uint256',
        },
        {
          name: 'merkleTreeRoot',
          type: 'uint256',
          internalType: 'uint256',
        },
        {
          name: 'nullifier',
          type: 'uint256',
          internalType: 'uint256',
        },
        {
          name: 'feedback',
          type: 'uint256',
          internalType: 'uint256',
        },
        {
          name: 'points',
          type: 'uint256[8]',
          internalType: 'uint256[8]',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
  ],
  bytecode: {
    object:
      '0x608060405234801561001057600080fd5b5060405161041c38038061041c83398101604081905261002f916100b8565b600080546001600160a01b0319166001600160a01b03831690811782556040805163575185ed60e01b81529051919263575185ed9260048084019360209390839003909101908290875af115801561008b573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100af91906100e8565b60015550610101565b6000602082840312156100ca57600080fd5b81516001600160a01b03811681146100e157600080fd5b9392505050565b6000602082840312156100fa57600080fd5b5051919050565b61030c806101106000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80637b5d2534146100515780637b85d27a14610081578063a0f44c9214610096578063eed02e4b146100ad575b600080fd5b600054610064906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b61009461008f3660046101f9565b6100c0565b005b61009f60015481565b604051908152602001610078565b6100946100bb36600461024c565b610188565b60006040518060c001604052808781526020018681526020018581526020018481526020016001548152602001836008806020026040519081016040528092919082600860200280828437600092018290525092909352505460015460405163d0d898dd60e01b81529394506001600160a01b039091169263d0d898dd925061014e91908590600401610265565b600060405180830381600087803b15801561016857600080fd5b505af115801561017c573d6000803e3d6000fd5b50505050505050505050565b600054600154604051631783efc360e01b81526001600160a01b0390921691631783efc3916101c4918590600401918252602082015260400190565b600060405180830381600087803b1580156101de57600080fd5b505af11580156101f2573d6000803e3d6000fd5b5050505050565b600080600080600061018080878903121561021357600080fd5b8635955060208701359450604087013593506060870135925087818801111561023b57600080fd5b506080860190509295509295909350565b60006020828403121561025e57600080fd5b5035919050565b60006101c082019050838252602083516020840152602084015160408401526040840151606084015260608401516080840152608084015160a084015260a084015160c0840160005b60088110156102cb578251825291830191908301906001016102ae565b50505050939250505056fea26469706673582212200f97488f73ebfd7f983693e9e4edfbe3e0259848937524f74f68435bd1e3653264736f6c63430008170033',
    sourceMap:
      '144:838:22:-:0;;;231:139;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;279:9;:40;;-1:-1:-1;;;;;;279:40:22;-1:-1:-1;;;;;279:40:22;;;;;;;340:23;;;-1:-1:-1;;;340:23:22;;;;279:40;;340:21;;:23;;;;;;;;;;;;;;;;;279:40;340:23;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;330:7;:33;-1:-1:-1;144:838:22;;14:290:23;84:6;137:2;125:9;116:7;112:23;108:32;105:52;;;153:1;150;143:12;105:52;179:16;;-1:-1:-1;;;;;224:31:23;;214:42;;204:70;;270:1;267;260:12;204:70;293:5;14:290;-1:-1:-1;;;14:290:23:o;309:184::-;379:6;432:2;420:9;411:7;407:23;403:32;400:52;;;448:1;445;438:12;400:52;-1:-1:-1;471:16:23;;309:184;-1:-1:-1;309:184:23:o;:::-;144:838:22;;;;;;',
    linkReferences: {},
  },
  deployedBytecode: {
    object:
      '0x608060405234801561001057600080fd5b506004361061004c5760003560e01c80637b5d2534146100515780637b85d27a14610081578063a0f44c9214610096578063eed02e4b146100ad575b600080fd5b600054610064906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b61009461008f3660046101f9565b6100c0565b005b61009f60015481565b604051908152602001610078565b6100946100bb36600461024c565b610188565b60006040518060c001604052808781526020018681526020018581526020018481526020016001548152602001836008806020026040519081016040528092919082600860200280828437600092018290525092909352505460015460405163d0d898dd60e01b81529394506001600160a01b039091169263d0d898dd925061014e91908590600401610265565b600060405180830381600087803b15801561016857600080fd5b505af115801561017c573d6000803e3d6000fd5b50505050505050505050565b600054600154604051631783efc360e01b81526001600160a01b0390921691631783efc3916101c4918590600401918252602082015260400190565b600060405180830381600087803b1580156101de57600080fd5b505af11580156101f2573d6000803e3d6000fd5b5050505050565b600080600080600061018080878903121561021357600080fd5b8635955060208701359450604087013593506060870135925087818801111561023b57600080fd5b506080860190509295509295909350565b60006020828403121561025e57600080fd5b5035919050565b60006101c082019050838252602083516020840152602084015160408401526040840151606084015260608401516080840152608084015160a084015260a084015160c0840160005b60088110156102cb578251825291830191908301906001016102ae565b50505050939250505056fea26469706673582212200f97488f73ebfd7f983693e9e4edfbe3e0259848937524f74f68435bd1e3653264736f6c63430008170033',
    sourceMap:
      '144:838:22:-:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;168:27;;;;;-1:-1:-1;;;;;168:27:22;;;;;;-1:-1:-1;;;;;198:32:23;;;180:51;;168:2;153:18;168:27:22;;;;;;;;503:477;;;;;;:::i;:::-;;:::i;:::-;;202:22;;;;;;;;;939:25:23;;;927:2;912:18;202:22:22;793:177:23;376:121:22;;;;;;:::i;:::-;;:::i;503:477::-;704:38;745:178;;;;;;;;784:15;745:178;;;;813:14;745:178;;;;841:9;745:178;;;;864:8;745:178;;;;886:7;;745:178;;;;907:6;745:178;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;745:178:22;;;;-1:-1:-1;934:9:22;;958:7;934:39;;-1:-1:-1;;;934:39:22;;704:219;;-1:-1:-1;;;;;;934:9:22;;;;:23;;-1:-1:-1;934:39:22;;958:7;704:219;;934:39;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;694:286;503:477;;;;;:::o;376:121::-;442:9;;;462:7;442:48;;-1:-1:-1;;;442:48:22;;-1:-1:-1;;;;;442:9:22;;;;:19;;:48;;471:18;;442:48;;2261:25:23;;;2317:2;2302:18;;2295:34;2249:2;2234:18;;2087:248;442:48:22;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;376:121;:::o;242:546:23:-;362:6;370;378;386;394;425:3;469:2;457:9;448:7;444:23;440:32;437:52;;;485:1;482;475:12;437:52;521:9;508:23;498:33;;578:2;567:9;563:18;550:32;540:42;;629:2;618:9;614:18;601:32;591:42;;680:2;669:9;665:18;652:32;642:42;;719:7;714:2;703:9;699:18;696:31;693:51;;;740:1;737;730:12;693:51;;778:3;767:9;763:19;753:29;;242:546;;;;;;;;:::o;975:180::-;1034:6;1087:2;1075:9;1066:7;1062:23;1058:32;1055:52;;;1103:1;1100;1093:12;1055:52;-1:-1:-1;1126:23:23;;975:180;-1:-1:-1;975:180:23:o;1160:922::-;1346:4;1388:3;1377:9;1373:19;1365:27;;1419:6;1408:9;1401:25;1445:2;1489:6;1483:13;1478:2;1467:9;1463:18;1456:41;1551:2;1543:6;1539:15;1533:22;1528:2;1517:9;1513:18;1506:50;1610:2;1602:6;1598:15;1592:22;1587:2;1576:9;1572:18;1565:50;1670:2;1662:6;1658:15;1652:22;1646:3;1635:9;1631:19;1624:51;1730:3;1722:6;1718:16;1712:23;1706:3;1695:9;1691:19;1684:52;1783:3;1775:6;1771:16;1765:23;1823:3;1812:9;1808:19;1899:1;1909:167;1923:4;1920:1;1917:11;1909:167;;;1982:13;;1970:26;;2051:15;;;;2016:12;;;;1943:1;1936:9;1909:167;;;1913:3;;;;1160:922;;;;;:::o',
    linkReferences: {},
  },
  methodIdentifiers: {
    'groupId()': 'a0f44c92',
    'joinGroup(uint256)': 'eed02e4b',
    'semaphore()': '7b5d2534',
    'sendFeedback(uint256,uint256,uint256,uint256,uint256[8])': '7b85d27a',
  },
  rawMetadata:
    '{"compiler":{"version":"0.8.23+commit.f704f362"},"language":"Solidity","output":{"abi":[{"inputs":[{"internalType":"address","name":"semaphoreAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"groupId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"identityCommitment","type":"uint256"}],"name":"joinGroup","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"semaphore","outputs":[{"internalType":"contract ISemaphore","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"merkleTreeDepth","type":"uint256"},{"internalType":"uint256","name":"merkleTreeRoot","type":"uint256"},{"internalType":"uint256","name":"nullifier","type":"uint256"},{"internalType":"uint256","name":"feedback","type":"uint256"},{"internalType":"uint256[8]","name":"points","type":"uint256[8]"}],"name":"sendFeedback","outputs":[],"stateMutability":"nonpayable","type":"function"}],"devdoc":{"kind":"dev","methods":{},"version":1},"userdoc":{"kind":"user","methods":{},"version":1}},"settings":{"compilationTarget":{"src/Feedback.sol":"Feedback"},"evmVersion":"paris","libraries":{},"metadata":{"bytecodeHash":"ipfs"},"optimizer":{"enabled":true,"runs":200},"remappings":[":@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/",":@semaphore-protocol/=lib/semaphore/node_modules/@semaphore-protocol/",":@semaphore/contracts/=lib/semaphore/packages/contracts/",":@zk-kit/lean-imt.sol/=lib/zk-kit.solidity/packages/lean-imt/contracts/",":ds-test/=lib/openzeppelin-contracts/lib/forge-std/lib/ds-test/src/",":erc4626-tests/=lib/openzeppelin-contracts/lib/erc4626-tests/",":eth-gas-reporter/=lib/semaphore/node_modules/eth-gas-reporter/",":forge-std/=lib/forge-std/src/",":halmos-cheatcodes/=lib/openzeppelin-contracts/lib/halmos-cheatcodes/src/",":hardhat/=lib/semaphore/node_modules/hardhat/",":monorepo-ethers-contracts/=lib/semaphore/node_modules/monorepo-ethers-contracts/contracts/",":monorepo-subgraph-contracts/=lib/semaphore/node_modules/monorepo-subgraph-contracts/contracts/",":openzeppelin-contracts/=lib/openzeppelin-contracts/",":poseidon-solidity/=lib/poseidon-solidity/contracts/",":semaphore-contracts/=lib/semaphore/node_modules/semaphore-contracts/contracts/",":semaphore/=lib/semaphore/",":zk-kit.solidity/=lib/zk-kit.solidity/"]},"sources":{"lib/semaphore/packages/contracts/contracts/interfaces/ISemaphore.sol":{"keccak256":"0x16a8b4f4c240197c3f01d3c548d2a21f7fb30a9e97e3ed2753bae89ba9c180c0","license":"MIT","urls":["bzz-raw://e4f0298107630f3c3ead11d9f581d699c53d35b372a840d9667b8de2ad208bc1","dweb:/ipfs/QmTqV3VgJECHFeoJy9VFcimr8gXNdeEdrkvwjRMunpZkbs"]},"src/Feedback.sol":{"keccak256":"0x32c6da6bbebab7ffce3b7ee9d3e3bb973b18a01e43192a1ebfe548eab6280160","license":"MIT","urls":["bzz-raw://86f96211004babe89ff95c95b7bcc0fb9e1713376537253349208b2d50fa52b8","dweb:/ipfs/QmUsdVvntXgbM4SR1kgwDzdSVtjoTmkjCqEY6a9TFrUGhp"]}},"version":1}',
  metadata: {
    compiler: { version: '0.8.23+commit.f704f362' },
    language: 'Solidity',
    output: {
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: 'semaphoreAddress',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'groupId',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'identityCommitment',
              type: 'uint256',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'joinGroup',
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'semaphore',
          outputs: [
            {
              internalType: 'contract ISemaphore',
              name: '',
              type: 'address',
            },
          ],
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'merkleTreeDepth',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'merkleTreeRoot',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'nullifier',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'feedback',
              type: 'uint256',
            },
            {
              internalType: 'uint256[8]',
              name: 'points',
              type: 'uint256[8]',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'sendFeedback',
        },
      ],
      devdoc: { kind: 'dev', methods: {}, version: 1 },
      userdoc: { kind: 'user', methods: {}, version: 1 },
    },
    settings: {
      remappings: [
        '@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/',
        '@semaphore-protocol/=lib/semaphore/node_modules/@semaphore-protocol/',
        '@semaphore/contracts/=lib/semaphore/packages/contracts/',
        '@zk-kit/lean-imt.sol/=lib/zk-kit.solidity/packages/lean-imt/contracts/',
        'ds-test/=lib/openzeppelin-contracts/lib/forge-std/lib/ds-test/src/',
        'erc4626-tests/=lib/openzeppelin-contracts/lib/erc4626-tests/',
        'eth-gas-reporter/=lib/semaphore/node_modules/eth-gas-reporter/',
        'forge-std/=lib/forge-std/src/',
        'halmos-cheatcodes/=lib/openzeppelin-contracts/lib/halmos-cheatcodes/src/',
        'hardhat/=lib/semaphore/node_modules/hardhat/',
        'monorepo-ethers-contracts/=lib/semaphore/node_modules/monorepo-ethers-contracts/contracts/',
        'monorepo-subgraph-contracts/=lib/semaphore/node_modules/monorepo-subgraph-contracts/contracts/',
        'openzeppelin-contracts/=lib/openzeppelin-contracts/',
        'poseidon-solidity/=lib/poseidon-solidity/contracts/',
        'semaphore-contracts/=lib/semaphore/node_modules/semaphore-contracts/contracts/',
        'semaphore/=lib/semaphore/',
        'zk-kit.solidity/=lib/zk-kit.solidity/',
      ],
      optimizer: { enabled: true, runs: 200 },
      metadata: { bytecodeHash: 'ipfs' },
      compilationTarget: { 'src/Feedback.sol': 'Feedback' },
      evmVersion: 'paris',
      libraries: {},
    },
    sources: {
      'lib/semaphore/packages/contracts/contracts/interfaces/ISemaphore.sol': {
        keccak256:
          '0x16a8b4f4c240197c3f01d3c548d2a21f7fb30a9e97e3ed2753bae89ba9c180c0',
        urls: [
          'bzz-raw://e4f0298107630f3c3ead11d9f581d699c53d35b372a840d9667b8de2ad208bc1',
          'dweb:/ipfs/QmTqV3VgJECHFeoJy9VFcimr8gXNdeEdrkvwjRMunpZkbs',
        ],
        license: 'MIT',
      },
      'src/Feedback.sol': {
        keccak256:
          '0x32c6da6bbebab7ffce3b7ee9d3e3bb973b18a01e43192a1ebfe548eab6280160',
        urls: [
          'bzz-raw://86f96211004babe89ff95c95b7bcc0fb9e1713376537253349208b2d50fa52b8',
          'dweb:/ipfs/QmUsdVvntXgbM4SR1kgwDzdSVtjoTmkjCqEY6a9TFrUGhp',
        ],
        license: 'MIT',
      },
    },
    version: 1,
  },
  id: 22,
} as const;

const address = transactions.find(
  (transaction) =>
    transaction.contractName === 'Feedback' &&
    transaction.transactionType === 'CREATE',
)?.contractAddress;

if (!address) {
  throw new Error('Feedback contract address not found');
}

// @ts-expect-error Type 'string' is not assignable to type '`0x${string}`'.
export const FEEDBACK_CONTRACT_ADDRESS: Address = address;
