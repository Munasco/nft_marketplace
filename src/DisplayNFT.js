// src/DisplayNFTs.js
import React, { useEffect, useState, useContext } from "react";
import Web3 from "web3";
import SimpleNFT from "./SafeNumbers.json"; // Import ABI
import axios from "axios";
import { UserContext } from "./UserContext";

function DisplayNFTs({ contractAddress }) {
  const { tokenId } = useContext(UserContext);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    async function fetchNFTs() {
      const web3 = new Web3(Web3.givenProvider);
      const accounts = await web3.eth.getAccounts();
      const simpleNFT = new web3.eth.Contract(
        SimpleNFT.abi,
        contractAddress // Use the provided contract address
      );

      const balance = await simpleNFT.methods.balanceOf(accounts[0]).call();
      const nfts = [];
      for (let i = 0; i < balance; i++) {
        const tokenURI = await simpleNFT.methods.tokenURI(tokenId).call();
        axios
          .get(`http://localhost:3000/getNFT/${tokenURI}`)
          .then((response) => {
            const imageBase64 = response.data.image;
            setNfts((prevNfts) => [
              {
                tokenId: tokenId,
                imageSrc: imageBase64,
              },
              ...prevNfts,
            ]);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }

    fetchNFTs();
  }, [tokenId, contractAddress]);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    margin: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const nftStyle = {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    margin: "10px 0",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    width: "80%",
    textAlign: "center",
  };

  const imageStyle = {
    width: "300px",
    borderRadius: "8px",
    margin: "10px 0",
  };

  return (
    <div style={containerStyle}>
      <h1>Your NFTs</h1>
      {nfts.map((nft) => (
        <div key={nft.tokenId} style={nftStyle}>
          <h2>NFT {nft.tokenId}</h2>
          <p>Contract Address: {contractAddress}</p>
          <p>Token ID: {nft.tokenId}</p>
          <img
            src={nft.imageSrc}
            style={imageStyle}
            alt={`NFT ${nft.tokenId}`}
          />
        </div>
      ))}
    </div>
  );
}

export default DisplayNFTs;
