import React from 'react'
import { formatRupiah } from "../../utils";

const MiniCard = ({ title, icon, number, isLoading}) => {
  return (
    <div className='bg-[#1a1a1a] py-5 px-5 rounded-lg w-[50%]'>
      <div className='flex items-start justify-between'>
        <h1 className='text-[#f5f5f5] text-lg font-semibold tracking-wide'>
          {title}</h1>
        <button className={`${title === "Total Earnings" ? "bg-[#02ca3a]" : "bg-[#f6b100]"} p-3 rounded-lg text-[#f5f5f5] text-2xl`}>
          {icon}
        </button>
      </div>
      <div>
        {isLoading ? <h1 className='text-[#f5f5f5] text-2xl font-bold mt-5'>Loading</h1> : <h1 className='text-[#f5f5f5] text-3xl font-bold mt-5'>{title === "Total Earnings"
          ? `${formatRupiah(number)}`  // Pake ini biar ada titiknya (Rp 512.000)
          : number}</h1>}
      </div>
    </div>
  );
};




export default MiniCard 
