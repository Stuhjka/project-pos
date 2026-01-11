import React from 'react'
import { FaClipboardList, FaCircle } from "react-icons/fa" 
import OrderList from './OrderList'
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getOrders } from '../../https';

const RecentOrders = () => {
  const { data: resData } = useQuery({
    queryKey: ["orders", "today"],
    queryFn: async () => await getOrders({ filter: "today" }),
    placeholderData: keepPreviousData,
  });

  const orders = resData?.data?.data ? [...resData.data.data] : [];

  return (
    <div className='px-8 py-6 h-full'>
      {/* Container dengan rounded lebih halus dan shadow */}
      <div className='bg-[#1a1a1a] w-full h-full rounded-2xl flex flex-col border border-white/5 shadow-2xl overflow-hidden'>
        
        {/* HEADER */}
        <div className='flex justify-between items-center px-7 py-5 border-b border-white/5'>
          <div>
            <h1 className='text-[#f5f5f5] text-xl font-bold tracking-tight '>Recent Orders</h1>
            <div className='flex items-center gap-2 mt-1'>
              <FaCircle className='text-green-500 animate-pulse text-[7px]' />
              <p className='text-[#ababab] text-[10px] font-bold uppercase tracking-[2px]'>Live Updates</p>
            </div>
          </div>
        </div>

        {/* LIST CONTAINER */}
        <div className='mt-2 px-4 overflow-y-auto scrollbar-hide flex-1 min-h-0 flex flex-col gap-1 pb-6'>
          {orders.length > 0 ? (
            orders.map((value, index) => (
              <OrderList 
                key={value._id || index}
                customerName={value.customerDetails?.name} 
                itemsCount={value.items?.length || 0}
                tableNo={value.table?.table}
              />
            ))
          ) : (
            /* EMPTY STATE DENGAN GRADIENT */
            <div className="flex flex-col items-center justify-center flex-1 opacity-20 py-20">
              <div className="bg-gradient-to-b from-[#1f1f1f] to-transparent p-8 rounded-full mb-4">
                <FaClipboardList className="text-[#f5f5f5] text-5xl" />
              </div>
              <p className="text-[#f5f5f5] text-lg font-semibold italic">No Orders Yet</p>
              <p className="text-[#ababab] text-sm italic">Waiting for the first customer...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecentOrders