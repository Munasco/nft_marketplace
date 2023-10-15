// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SafeNumbers is ERC721URIStorage {
    uint256 private _nextTokenId;
    address public admin;

    constructor() ERC721("SafeNumbers", "SFN") {
        admin = msg.sender;
    }

    function mint(string memory tokenURI) public returns (uint256) {
        require(msg.sender == admin, "only admin can mint");
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }
}
