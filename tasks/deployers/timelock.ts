import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { Timelock, Timelock__factory } from "../../typechain";

// function encodeParameters(types, values) {
//   const abi = new ethers.utils.AbiCoder();
//   return abi.encode(types, values);
// }

task("deploy:Timelock").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const delay = 259200;

  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin = await signers[0].getAddress();

  const timelockFactory: Timelock__factory = await ethers.getContractFactory("Timelock");
  const timelock: Timelock = <Timelock>await timelockFactory.deploy(admin, delay);

  await timelock.deployed();
  console.log("Timelock deployed to: ", timelock.address);
});

// task("timelock:sendEth").addParam("ether", "ether Amount").setAction
