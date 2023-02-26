import React from 'react';
import { useNavigate } from 'react-router-dom';

import FundCard from './FundCard';
import { loader } from '../assets';

const DisplayCampaigns = ({ title, isLoading, nfts }) => {
  const navigate = useNavigate();

  const handleNavigate = (nft) => {
    navigate(`/campaign-details/${nft.title}`, { state: nft })
  }
  
  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">{title} ({nfts.length})</h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && nfts.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any nfts yet
          </p>
        )}

        {!isLoading && nfts.length > 0 && nfts.map((nft) => <FundCard 
          key={nft.id}
          {...nft}
          handleClick={() => handleNavigate(nft)}
        />)}
      </div>
    </div>
  )
}

export default DisplayCampaigns