// src/MintNFT.js
import React, { useState, useContext } from "react";
import Web3 from "web3";
import SimpleNFT from "./SafeNumbers.json";
import { UserContext } from "./UserContext";

function MintNFT({ contractAddress }) {
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [ipfsUrl, setIpfsUrl] = useState("");
  const { setTokenId } = useContext(UserContext);

  async function handleMint() {
    setIsLoading(true);
    try {
      const web3 = new Web3(Web3.givenProvider);
      const accounts = await web3.eth.getAccounts();
      const simpleNFT = new web3.eth.Contract(SimpleNFT.abi, contractAddress);

      const txReceipt = await simpleNFT.methods
        .mint(ipfsUrl)
        .send({ from: accounts[0] });
      setTransactionHash(txReceipt.transactionHash);
      setTokenId(txReceipt.events?.Transfer?.returnValues?.tokenId);
      console.log(txReceipt);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }

  return (
    <div>
      <input
        type="text"
        value={ipfsUrl}
        onChange={(e) => setIpfsUrl(e.target.value)}
        placeholder="Enter IPFS URL"
      />
      <button onClick={handleMint} disabled={isLoading}>
        Mint NFT
      </button>
      {isLoading && <div>Minting NFT...</div>}
      {transactionHash && (
        <div>
          Transaction sent! Hash: <a>{transactionHash}</a>
        </div>
      )}
    </div>
  );
}

export default MintNFT;
