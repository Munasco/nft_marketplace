import Web3 from "web3";
import SimpleNFT from "./SafeNumbers.json"; // Import ABI and bytecode

export async function deployContract(account) {
  // Request account access if needed
  await window.ethereum.enable();

  // Load web3
  const web3 = new Web3(Web3.givenProvider);

  // Load account
  // Create contract instance
  const contract = new web3.eth.Contract(SimpleNFT.abi);
  const instance = await contract
    .deploy({
      data: SimpleNFT.bytecode,
    })
    .send({
      from: account,
      gas: "5000000",
    });

  console.log("Contract deployed at:", instance.options.address);
  return {
    transactionHash: instance.transactionHash,
    contractAddress: instance.options.address,
  };
}

// Call function
