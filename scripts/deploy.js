const hre = require("hardhat");

async function main() {
  const Asset = await hre.ethers.getContractFactory("AssetNFT");
  const asset = await Asset.deploy();
  await asset.deployed();

  console.log("AssetNFT contract deployed to:", asset.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });