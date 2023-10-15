// scripts/transfer.js
const Bridge1 = artifacts.require("Bridge1");
const Token1 = artifacts.require("Token1");

module.exports = async (callback) => {
  const accounts = await web3.eth.getAccounts();
  const token = await Token1.new();
  const bridge = await Bridge1.new(token.address);
  await token.approve(bridge.address, 1000);
  await bridge.sendTokens(1000, "0xabc..."); // Replace with actual recipient address
  callback();
};
