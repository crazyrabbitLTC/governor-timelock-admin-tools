import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { Timelock } from "../../typechain/Timelock";
import { Mock } from "../../typechain/Mock";

import { Signers } from "../types";
import { shouldBehaveLikeTimelock } from "./Timelock.behavior";

const { deployContract } = hre.waffle;

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await hre.ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("Timelock", function () {
    beforeEach(async function () {
      this.delay = 2;
      const timelockArtifact: Artifact = await hre.artifacts.readArtifact("Timelock");
      this.timelock = <Timelock>(
        await deployContract(this.signers.admin, timelockArtifact, [await this.signers.admin.getAddress(), this.delay])
      );
      // console.log("Timelock Address: ", this.timelock.address)
      const mockArtifact: Artifact = await hre.artifacts.readArtifact("Mock");
      this.mock = <Mock>await deployContract(this.signers.admin, mockArtifact, []);

      // console.log("Mock Address: ", this.mock.address)
    });

    shouldBehaveLikeTimelock();
  });
});
