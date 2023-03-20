
// const hre = require("hardhat");
const { ethers, waffle } = require("hardhat");
const { abi } = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");


// HELPER FUNCTIONS

async function main() {

  const contractAddress = "0xdF36EB526124cDf65710712ee7d2cCCe0A499BBb";
  const contractABI = abi;
  const provider = new ethers.providers.AlchemyProvider("goerli", process.env.GOERLI_API_KEY);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const buyMeACoffee = new ethers.Contract(
     contractAddress,
     contractABI,
     signer
  );

  // Returns the ethers balance of a given address
  const getBalance = async (_provider, _address) => {
    const balanceBigInt = await _provider.getBalance(_address)
    return ethers.utils.formatEther(balanceBigInt);
  }

  const contractBalance = await getBalance(provider, buyMeACoffee.address);

  if(contractBalance !== "0.0")
  {
    // Withdraw funds
    console.log("Conctract Balance before withdrawal: ", await getBalance(provider, buyMeACoffee.address));
    console.log("Owner Balance before withdrawal: ", await getBalance(provider, signer.address));

    const withDrawTrx = await buyMeACoffee.withdrawTips();
    await withDrawTrx.wait();
    console.log("== withdrew ==");
    console.log("Conctract Balance before withdrawal: ", await getBalance(provider, buyMeACoffee.address));
    console.log("Owner Balance before withdrawal: ", await getBalance(provider, signer.address));
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
