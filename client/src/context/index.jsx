import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0xc50Fb0377e4F17AeEeD53C51ad992109B4b256A9');
  const { mutateAsync: createNft, isLoading } = useContractWrite(contract, "createNft")

  const address = useAddress();
  const connect = useMetamask();

  const publishNft = async (form) => {
    try {
      const data = await createNft([
        address, 
        form.title, 
        form.description, 
        form.target,
        new Date(form.deadline).getTime(), 
        form.image
      ])

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const getNfts = async () => {
    const nfts = await contract.call('getNfts');

    const parsedNfts = nfts.map((nft, i) => ({
      owner: nft.owner,
      title: nft.title,
      description: nft.description,
      target: ethers.utils.formatEther(nft.target.toString()),
      deadline: nft.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(nft.amountCollected.toString()),
      image: nft.image,
      pId: i
    }));

    return parsedNfts;
  }

  const getUserNfts = async () => {
    const allNfts = await getNfts();

    const filteredNfts = allNfts.filter((nft) => nft.owner === address);

    return filteredNfts;
  }

  const donate = async (pId, amount) => {
    const data = await contract.call('donateToNft', pId, { value: ethers.utils.parseEther(amount)});

    return data;
  }

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }


  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connect,
        createNft: publishNft,
        getNfts,
        getUserNfts,
        donate,
        getDonations
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);