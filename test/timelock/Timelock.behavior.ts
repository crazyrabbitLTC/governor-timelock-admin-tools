import { expect } from "chai";
import { ethers } from "ethers";
import hre from "hardhat";

export function shouldBehaveLikeTimelock(): void {
  it("should queue and execute transaction", async function () {
    const message = "Hello World";
    const signature = "receiveETH(string)";
    const target = this.mock.address;
    const value = hre.ethers.utils.parseEther("1");
    const data = new ethers.utils.AbiCoder().encode(["string"], [message]);
    const eta = Date.now() + 1000; //in milliseconds

    // send eth to timelock
    await expect(this.signers.admin.sendTransaction({ to: this.timelock.address, value })).to.not.be.reverted;

    // exepct timelock to have 1 eth
    expect(await hre.waffle.provider.getBalance(this.timelock.address)).to.be.eq(value);

    // queue tx
    await expect(
      (await this.timelock.connect(this.signers.admin)).queueTransaction(target, value, signature, data, eta),
    ).to.be.not.reverted;

    // it's too early to execute
    await expect(
      (await this.timelock.connect(this.signers.admin)).executeTransaction(target, value, signature, data, eta),
    ).to.be.revertedWith("Timelock::executeTransaction: Transaction hasn't surpassed time lock.");

    // set timestamp to the future
    await hre.network.provider.request({
      method: "evm_setNextBlockTimestamp",
      params: [Date.now() + 3000],
    });

    // execute transaction
    await expect(
      (await this.timelock.connect(this.signers.admin)).executeTransaction(target, value, signature, data, eta),
    ).to.be.not.reverted;

    // check mock got the eth
    expect(await hre.waffle.provider.getBalance(this.mock.address)).to.be.eq(value);

    // check mock has new message
    expect(await this.mock.message()).to.eq(message);
  });
}
