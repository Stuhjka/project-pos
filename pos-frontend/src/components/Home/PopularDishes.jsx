import React from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getPopular } from '../../https';

const PopularDishes = () => {

    const { data: resData, isLoading } = useQuery({
        queryKey: ["popular"],
        queryFn: getPopular,
        placeholderData: keepPreviousData,
    });

    const populars = resData?.data?.data ? [...resData.data.data] : [];

    if (isLoading) {
        return <div className="p-6 text-white text-center">Loading trends...</div>;
    }

    return (
        <div className='py-6 pr-6 h-full'>
            <div className='bg-[#1a1a1a] w-full rounded-xl h-full flex flex-col border border-[#2a2a2a]'>
                
                {/* HEADER */}
                <div className='flex justify-between items-center px-6 py-4 border-b border-[#2a2a2a]'>
                    <h1 className='text-[#f5f5f5] text-lg font-bold tracking-wide'>Popular Dishes</h1>
                    <button className='text-[#f6b100] text-sm font-semibold hover:underline'>View All</button> 
                </div>

                {/* LIST CONTENT */}
                <div className="overflow-y-auto scrollbar-hide flex-1 min-h-0 py-2">
                    {populars.length > 0 ? (
                        populars.map((dish, index) => {
                            // Formatting ranking: 1 jadi 01
                            const ranking = (index + 1) < 10 ? `0${index + 1}` : index + 1;

                            return (
                                <div key={index}
                                     className="flex items-center gap-4 bg-[#1f1f1f] rounded-xl px-4 py-3 mt-3 mx-4 border border-transparent hover:border-[#333] transition-all group"
                                >
                                    {/* RANKING NUMBER */}
                                    <h1 className="text-gray-600 font-black text-xl w-8 text-center group-hover:text-yellow-500 transition-colors">
                                        {ranking}
                                    </h1>

                                    {/* IMAGE AREA */}
                                    <div className="w-[50px] h-[50px] rounded-full overflow-hidden border border-[#333] shrink-0 bg-[#2a2a2a]">
                                        <img
                                            src={dish.image || "https://placehold.co/100x100?text=Food"} 
                                            alt={dish.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                                        />
                                    </div>

                                    {/* INFO AREA */}
                                    <div className="flex-1 min-w-0">
                                        <h1 className="text-[#f5f5f5] font-bold tracking-wide truncate text-sm">
                                            {dish.name}
                                        </h1>
                                        
                                        <div className="flex items-center gap-3 mt-1">
                                            <p className="text-[#ababab] text-xs font-medium">
                                                Orders: <span className="text-white font-bold">{dish.totalOrders}</span>
                                            </p>
                                            <span className="text-gray-700 text-[10px]">•</span>
                                            <p className="text-[#ababab] text-xs font-medium">
                                                Qty: <span className="text-yellow-500 font-bold">{dish.totalQty}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-30 text-white">
                             <span className="text-4xl mb-2">📊</span>
                             <p className="text-sm">No sales data found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PopularDishes