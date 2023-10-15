const fs = require("fs");
const contractJSON = require("./build/contracts/NFTMarket.json");

const abi = contractJSON.abi;
const address = "0x..."; // replace with your contract's deployed address

const configContent = `
export const NFTMarket_ABI = ${JSON.stringify(abi, null, 2)};
export const NFTMarket_ADDRESS = "${address}";
`;

fs.writeFileSync("./src/config.js", configContent);
