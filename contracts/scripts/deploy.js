const hre = require("hardhat");

async function main() {
  console.log("Deploying AlbashSolution contracts...\n");

  // Deploy Access Control
  console.log("1. Deploying AlbashAccessControl...");
  const AccessControl = await hre.ethers.getContractFactory("AlbashAccessControl");
  const accessControl = await AccessControl.deploy();
  await accessControl.waitForDeployment();
  const accessControlAddress = await accessControl.getAddress();
  console.log("✓ AlbashAccessControl deployed to:", accessControlAddress);

  // Deploy Reputation
  console.log("\n2. Deploying AlbashReputation...");
  const Reputation = await hre.ethers.getContractFactory("AlbashReputation");
  const reputation = await Reputation.deploy(accessControlAddress);
  await reputation.waitForDeployment();
  const reputationAddress = await reputation.getAddress();
  console.log("✓ AlbashReputation deployed to:", reputationAddress);

  // Deploy NFT Contract
  console.log("\n3. Deploying AlbashNFT...");
  const NFT = await hre.ethers.getContractFactory("AlbashNFT");
  const nft = await NFT.deploy(accessControlAddress);
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("✓ AlbashNFT deployed to:", nftAddress);

  // Deploy Marketplace
  console.log("\n4. Deploying AlbashMarketplace...");
  const Marketplace = await hre.ethers.getContractFactory("AlbashMarketplace");
  const marketplace = await Marketplace.deploy(accessControlAddress, nftAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✓ AlbashMarketplace deployed to:", marketplaceAddress);

  // Set marketplace in NFT contract
  console.log("\n5. Configuring NFT contract...");
  await nft.setMarketplace(marketplaceAddress);
  console.log("✓ Marketplace set in NFT contract");

  // Deploy Swap Escrow
  console.log("\n6. Deploying AlbashSwapEscrow...");
  const SwapEscrow = await hre.ethers.getContractFactory("AlbashSwapEscrow");
  const swapEscrow = await SwapEscrow.deploy();
  await swapEscrow.waitForDeployment();
  const swapEscrowAddress = await swapEscrow.getAddress();
  console.log("✓ AlbashSwapEscrow deployed to:", swapEscrowAddress);

  // Deploy Token (Optional)
  console.log("\n7. Deploying AlbashToken...");
  const Token = await hre.ethers.getContractFactory("AlbashToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✓ AlbashToken deployed to:", tokenAddress);

  console.log("\n" + "=".repeat(60));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("AccessControl:", accessControlAddress);
  console.log("Reputation:", reputationAddress);
  console.log("NFT:", nftAddress);
  console.log("Marketplace:", marketplaceAddress);
  console.log("SwapEscrow:", swapEscrowAddress);
  console.log("Token:", tokenAddress);
  console.log("=".repeat(60));
  
  // Save addresses to a file for reference
  const fs = require("fs");
  const addresses = {
    accessControl: accessControlAddress,
    reputation: reputationAddress,
    nft: nftAddress,
    marketplace: marketplaceAddress,
    swapEscrow: swapEscrowAddress,
    token: tokenAddress,
    network: hre.network.name,
    timestamp: new Date().toISOString(),
  };
  
  fs.writeFileSync(
    "./deployment-addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("\n✓ Deployment addresses saved to deployment-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

