import { task } from "hardhat/config";
import { TaskArguments, Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { Timelock, Timelock__factory } from "../../typechain";

task("deploy:Timelock")
  .addParam("delay", "timelock delay")
  .addParam("admin", "admin address")
  .setAction(async function (taskArgs: TaskArguments, { ethers }) {
    // If you want to hardcode
    // const delay = 259200;
    // const signers: SignerWithAddress[] = await ethers.getSigners();
    // const admin = await signers[0].getAddress();

    const timelockFactory: Timelock__factory = await ethers.getContractFactory("Timelock");
    const timelock: Timelock = <Timelock>await timelockFactory.deploy(taskArgs.admin, taskArgs.delay);

    await timelock.deployed();
    console.log("Timelock deployed to: ", timelock.address);
  });

task("queue:tx")
  .addParam("timelock", "timelock address")
  .addParam("target", "target address")
  .addParam("value", "eth to send")
  .addParam("signature", "function signature")
  .addParam("argTypes", "array of argument types")
  .addParam("argValues", "array of argument values")
  .addParam("eta", "eta for tx to execute")
  .setAction(async function (taskArgs: TaskArguments, hre) {
    const { ethers } = hre;
    const signer: SignerWithAddress = (await ethers.getSigners())[0];
    const timelockArtifact: Artifact = await hre.artifacts.readArtifact("Timelock");
    const timelock: Timelock = <Timelock>new ethers.Contract(taskArgs.timelock, timelockArtifact.abi, signer);

    // not in WEI!!!!
    const sendValue = ethers.utils.parseEther(taskArgs.value);

    const sendData = new ethers.utils.AbiCoder().encode(taskArgs.argTypes, taskArgs.argValues);

    await timelock.queueTransaction(taskArgs.target, sendValue, taskArgs.signature, sendData, taskArgs.eta);

    const expectedHash = ethers.utils.defaultAbiCoder.encode(
      ["address", "uint256", "string", "bytes", "uint256"],
      [taskArgs.target, sendValue, taskArgs.signature, sendData, taskArgs.eta],
    );

    console.log("Queued TX id: ", expectedHash);

    // verify
    const verified = await timelock.queuedTransactions(expectedHash);

    if (verified) {
      console.log("Succesfully Queued");
    } else {
      console.log("Failed to queue");
    }
  });
