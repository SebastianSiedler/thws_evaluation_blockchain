import fs from 'fs';
import { task, types } from 'hardhat/config';

task('deploy', 'Deploy a Evaluation contract')
  .addOptionalParam(
    'semaphore',
    'Semaphore contract address',
    undefined,
    types.string,
  )
  .addOptionalParam('logs', 'Print the logs', true, types.boolean)
  .setAction(async ({ logs, semaphore: semaphoreAddress }, { ethers, run }) => {
    if (!semaphoreAddress) {
      const { semaphore } = await run('deploy:semaphore', {
        logs,
      });

      semaphoreAddress = await semaphore.getAddress();
    }

    const EvaluationFactory =
      await ethers.getContractFactory('EvaluationPlatform');

    const EvaluationContract = await EvaluationFactory.deploy(semaphoreAddress);

    // write addresses to a json file
    fs.writeFileSync(
      './deployed_addresses.json',
      JSON.stringify(
        {
          EVALUATION_CONTRACT_ADDRESS: await EvaluationContract.getAddress(),
          SEMAPHORE_CONTRACT_ADDRESS: semaphoreAddress,
        },
        null,
        2,
      ),
    );
    console.log('Deployed contracts addresses saved to deployed.json');

    if (logs) {
      console.info(
        `Evaluation contract has been deployed to: ${await EvaluationContract.getAddress()}`,
      );
    }

    return EvaluationContract;
  });
