
// const hre = require("hardhat");
const { ethers, waffle } = require("hardhat");

// HELPER FUNCTIONS

// Returns the ethers balance of a given address
const getBalance = async (_address) => {
  const balanceBigInt = await waffle.provider.getBalance(_address)
  return ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ethers balances for a list of addresses
const printBalances = async (_addresses) => {
  let idx = 0;
  for(const address of _addresses)
  {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

// Logs the memos stored on chain
const printMemos = async (_memos) => {
  for(const memo of _memos)
  {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}`);
  }
}


async function main() {

  // Get example accounts.
  const [owner, tipper, tipper2, tipper3] = await ethers.getSigners();

  // Get the contract to deploy
  const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
  
  // Creating an instance of the contract and deploy
  const buyMeACoffee = await BuyMeACoffee.deploy();

  // Waiting for the contract to be Deployed
  await buyMeACoffee.deployed();

  console.log("BuyMeACoffee deployed to ", buyMeACoffee.address);

  // Check balances before the coffee purchase
  const addresses = [owner.address, tipper.address, buyMeACoffee.address];
  console.log("== start ==");
  await printBalances(addresses);


  // Buy the owner a few coffees
  const tip = {value: ethers.utils.parseEther("1")};
  await buyMeACoffee.connect(tipper).buyCoffee("Waqas", "You are awesome", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Faisal", "You are great", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Mona", "You are amazing", tip);

  // Check balances after coffee purchase
  console.log("== bought coffee ==");
  await printBalances(addresses);

  // Withdraw funds
  await buyMeACoffee.connect(owner).withdrawTips();

  // Check balance after withdraw
  console.log("== withdrew ==");
  await printBalances(addresses);

  // Read all the memos left for the owner
  console.log("== memos ==");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
