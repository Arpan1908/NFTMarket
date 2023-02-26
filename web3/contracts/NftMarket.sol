// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract NftMarket {
    struct Nft {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Nft) public Nfts;

    uint256 public numberOfNfts = 0;

    function createNft(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        Nft storage nft = Nfts[numberOfNfts];

        require(nft.deadline < block.timestamp, "The deadline should be a date in the future.");

        nft.owner = _owner;
        nft.title = _title;
        nft.description = _description;
        nft.target = _target;
        nft.deadline = _deadline;
        nft.amountCollected = 0;
        nft.image = _image;

        numberOfNfts++;

        return numberOfNfts - 1;
    }

    function donateToNft(uint256 _id) public payable {
        uint256 amount = msg.value;

        Nft storage nft = Nfts[_id];

        nft.donators.push(msg.sender);
        nft.donations.push(amount);

        (bool sent,) = payable(nft.owner).call{value: amount}("");

        if(sent) {
            nft.amountCollected = nft.amountCollected + amount;
        }
    }

    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        return (Nfts[_id].donators, Nfts[_id].donations);
    }

    function getNfts() public view returns (Nft[] memory) {
        Nft[] memory allNfts = new Nft[](numberOfNfts);

        for(uint i = 0; i < numberOfNfts; i++) {
            Nft storage item = Nfts[i];

            allNfts[i] = item;
        }

        return allNfts;
    }
}