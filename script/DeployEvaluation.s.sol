// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {EvaluationPlatform} from "../src/Evaluation.sol";
import {Semaphore} from "@semaphore/contracts/contracts/Semaphore.sol";
import {SemaphoreVerifier} from "@semaphore/contracts/contracts/base/SemaphoreVerifier.sol";
import {ISemaphoreVerifier} from "@semaphore/contracts/contracts/interfaces/ISemaphoreVerifier.sol";
import "forge-std/Script.sol";

contract DeployEvaluation is Script {
    function run() external returns (address, address) {
        address semaphoreVerifierAddress;
        address semaphoreAddress;

        if (block.chainid == 11155111) {
            semaphoreVerifierAddress = 0xe538f9DeeE04A397decb1E7dc5D16fD6f123c043;
            semaphoreAddress = 0x1e0d7FF1610e480fC93BdEC510811ea2Ba6d7c2f;
        }

        vm.startBroadcast();

        if (semaphoreAddress == address(0)) {
            // Deploy SemaphoreVerifier for Semaphore
            SemaphoreVerifier semaphoreVerifier = new SemaphoreVerifier();
            semaphoreVerifierAddress = address(semaphoreVerifier);
            ISemaphoreVerifier IsemaphoreVerifier = ISemaphoreVerifier(
                address(semaphoreVerifier)
            );
            // Deploy Semaphore for Feedback
            Semaphore semaphore = new Semaphore(IsemaphoreVerifier);
            semaphoreAddress = address(semaphore);
        }

        // Deploy Feedback
        EvaluationPlatform feedback = new EvaluationPlatform(semaphoreAddress);

        vm.stopBroadcast();

        console.log(
            "Feedback contract has been deployed to:",
            address(feedback)
        );

        return (address(feedback), semaphoreAddress);
    }
}
