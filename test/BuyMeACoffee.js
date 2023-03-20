const { ethers } = require("hardhat");
const { expect } = require("chai");

const deployContract = async (name) => {
  const myContract = await ethers.getContractFactory(name);
  const contractABI = await myContract.deploy();
  await contractABI.deployed();
  return contractABI;
}

describe("BuyMeACoffee", () => {

  
  it("coffee is bought successfully", async () => {
    
    const [ owner ] = await ethers.getSigners();
    const myContract = await deployContract("BuyMeACoffee");
    

    // expect(testVar).to.equal("Hello");
    
  });

  

});
