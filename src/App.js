// src/App.js
import React, { useState, useEffect } from "react";
import { deployContract } from "./DeployContract";
import MintNFT from "./MintNFT";
import DisplayNFTs from "./DisplayNFT";
import "./App.css";
import detectEthereumProvider from "@metamask/detect-provider";

let injectedProvider = false;

if (typeof window.ethereum !== "undefined") {
  injectedProvider = true;
  console.log(window.ethereum);
}

const isMetaMask = injectedProvider ? window.ethereum.isMetaMask : false;

function App() {
  const [contractAddress, setContractAddress] = useState(null);
  const [hasProvider, setHasProvider] = useState(null);
  const initialState = { accounts: [], balance: "", chainId: "" };
  const [wallet, setWallet] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);

  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const refreshAccounts = (accounts) => {
      if (accounts.length > 0) {
        updateWallet(accounts);
      } else {
        // if length 0, user is disconnected
        setWallet(initialState);
      }
    };

    const refreshChain = (chainId) => {
      setWallet((wallet) => ({ ...wallet, chainId }));
    };

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      setHasProvider(Boolean(provider));

      if (provider) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        refreshAccounts(accounts);
        window.ethereum.on("accountsChanged", refreshAccounts);
        window.ethereum.on("chainChanged", refreshChain);
      }
    };

    getProvider();

    return () => {
      window.ethereum?.removeListener("accountsChanged", refreshAccounts);
      window.ethereum?.removeListener("chainChanged", refreshChain);
    };
  }, []);

  const updateWallet = async (accounts) => {
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    setWallet({ accounts, chainId });
  };

  async function handleDeploy() {
    setIsLoading(true);
    try {
      const { transactionHash, contractAddress } = await deployContract(
        wallet.accounts[0]
      );
      setTransactionHash(transactionHash);
      setContractAddress(contractAddress);
      console.log(contractAddress);
    } catch (error) {
      console.error(error);
      setError(true);
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  }
  const handleConnect = async () => {
    setIsConnecting(true);
    await window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts) => {
        setError(false);
        updateWallet(accounts);
      })
      .catch((err) => {
        setError(true);
        setErrorMessage(err.message);
      });
    setIsConnecting(false);
  };

  const disableConnect = Boolean(wallet) && isConnecting;
  return (
    <div className="App" style={{ textAlign: "center", margin: "30px" }}>
      <h2>Connected Account: {wallet.accounts[0]}</h2>
      <h2>Chain ID: {wallet.chainId}</h2>
      <h2>Contract Address: {contractAddress}</h2>
      {window.ethereum?.isMetaMask && wallet.accounts.length < 1 && (
        <button disabled={disableConnect} onClick={handleConnect}>
          Connect MetaMask
        </button>
      )}
      <br />
      <button onClick={handleDeploy}>Deploy Contract</button>
      {isLoading && <div>Deploying contract...</div>}
      {transactionHash && !contractAddress && (
        <div>
          Transaction sent! Hash:{" "}
          <a
            href={`https://etherscan.io/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {transactionHash}
          </a>
        </div>
      )}
      {contractAddress && (
        <>
          <div>Contract deployed at: {contractAddress}</div>
          <MintNFT contractAddress={contractAddress} />
          <DisplayNFTs contractAddress={contractAddress} />
        </>
      )}
    </div>
  );
}

export default App;
