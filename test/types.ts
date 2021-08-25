import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Fixture } from "ethereum-waffle";

import { Mock } from "../typechain/Mock";
import { Timelock } from "../typechain/Timelock";

declare module "mocha" {
  export interface Context {
    mock: Mock;
    timelock: Timelock;
    delay: number;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
}
