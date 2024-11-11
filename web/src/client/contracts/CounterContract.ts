// import CounterContract from '../../../out/Counter.sol/Counter.json';
export const CounterContract = {
  abi: [
    {
      type: 'function',
      name: 'increment',
      inputs: [],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'number',
      inputs: [],
      outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'setNumber',
      inputs: [{ name: 'newNumber', type: 'uint256', internalType: 'uint256' }],
      outputs: [],
      stateMutability: 'nonpayable',
    },
  ],
  bytecode: {
    object:
      '0x6080604052348015600f57600080fd5b5060f78061001e6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80633fb5c1cb1460415780638381f58a146053578063d09de08a14606d575b600080fd5b6051604c3660046083565b600055565b005b605b60005481565b60405190815260200160405180910390f35b6051600080549080607c83609b565b9190505550565b600060208284031215609457600080fd5b5035919050565b60006001820160ba57634e487b7160e01b600052601160045260246000fd5b506001019056fea26469706673582212201c88540d2739bb0e4f6179275ef6ff63cf1c34ed53189691f9dd0033f4382a0264736f6c634300081c0033',
    sourceMap: '65:192:20:-:0;;;;;;;;;;;;;;;;;;;',
    linkReferences: {},
  },
  deployedBytecode: {
    object:
      '0x6080604052348015600f57600080fd5b5060043610603c5760003560e01c80633fb5c1cb1460415780638381f58a146053578063d09de08a14606d575b600080fd5b6051604c3660046083565b600055565b005b605b60005481565b60405190815260200160405180910390f35b6051600080549080607c83609b565b9190505550565b600060208284031215609457600080fd5b5035919050565b60006001820160ba57634e487b7160e01b600052601160045260246000fd5b506001019056fea26469706673582212201c88540d2739bb0e4f6179275ef6ff63cf1c34ed53189691f9dd0033f4382a0264736f6c634300081c0033',
    sourceMap:
      '65:192:20:-:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;116:80;;;;;;:::i;:::-;171:6;:18;116:80;;;88:21;;;;;;;;;345:25:21;;;333:2;318:18;88:21:20;;;;;;;202:53;;240:6;:8;;;:6;:8;;;:::i;:::-;;;;;;202:53::o;14:180:21:-;73:6;126:2;114:9;105:7;101:23;97:32;94:52;;;142:1;139;132:12;94:52;-1:-1:-1;165:23:21;;14:180;-1:-1:-1;14:180:21:o;381:232::-;420:3;441:17;;;438:140;;500:10;495:3;491:20;488:1;481:31;535:4;532:1;525:15;563:4;560:1;553:15;438:140;-1:-1:-1;605:1:21;594:13;;381:232::o',
    linkReferences: {},
  },
  methodIdentifiers: {
    'increment()': 'd09de08a',
    'number()': '8381f58a',
    'setNumber(uint256)': '3fb5c1cb',
  },
  rawMetadata:
    '{"compiler":{"version":"0.8.28+commit.7893614a"},"language":"Solidity","output":{"abi":[{"inputs":[],"name":"increment","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"number","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"newNumber","type":"uint256"}],"name":"setNumber","outputs":[],"stateMutability":"nonpayable","type":"function"}],"devdoc":{"kind":"dev","methods":{},"version":1},"userdoc":{"kind":"user","methods":{},"version":1}},"settings":{"compilationTarget":{"src/Counter.sol":"Counter"},"evmVersion":"paris","libraries":{},"metadata":{"bytecodeHash":"ipfs"},"optimizer":{"enabled":true,"runs":200},"remappings":[":forge-std/=lib/forge-std/src/"]},"sources":{"src/Counter.sol":{"keccak256":"0x09277f949d59a9521708c870dc39c2c434ad8f86a5472efda6a732ef728c0053","license":"UNLICENSED","urls":["bzz-raw://94cd5258357da018bf911aeda60ed9f5b130dce27445669ee200313cd3389200","dweb:/ipfs/QmNbEfWAqXCtfQpk6u7TpGa8sTHXFLpUz7uebz2FVbchSC"]}},"version":1}',
  metadata: {
    compiler: { version: '0.8.28+commit.7893614a' },
    language: 'Solidity',
    output: {
      abi: [
        {
          inputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'increment',
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'number',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'newNumber',
              type: 'uint256',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'setNumber',
        },
      ],
      devdoc: { kind: 'dev', methods: {}, version: 1 },
      userdoc: { kind: 'user', methods: {}, version: 1 },
    },
    settings: {
      remappings: ['forge-std/=lib/forge-std/src/'],
      optimizer: { enabled: true, runs: 200 },
      metadata: { bytecodeHash: 'ipfs' },
      compilationTarget: { 'src/Counter.sol': 'Counter' },
      evmVersion: 'paris',
      libraries: {},
    },
    sources: {
      'src/Counter.sol': {
        keccak256:
          '0x09277f949d59a9521708c870dc39c2c434ad8f86a5472efda6a732ef728c0053',
        urls: [
          'bzz-raw://94cd5258357da018bf911aeda60ed9f5b130dce27445669ee200313cd3389200',
          'dweb:/ipfs/QmNbEfWAqXCtfQpk6u7TpGa8sTHXFLpUz7uebz2FVbchSC',
        ],
        license: 'UNLICENSED',
      },
    },
    version: 1,
  },
  id: 20,
} as const;

import { Address } from 'viem';
import { transactions } from '../../../../broadcast/Counter.s.sol/31337/run-latest.json';

// TODO: replace with json import
// @ts-expect-error Type 'string' is not assignable to type '`0x${string}`'.ts(2322)
export const COUNTER_CONTRACT_ADDRESS: Address =
  transactions[0].contractAddress;
