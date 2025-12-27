import React from 'react'
import { itemsData, metricsData } from "../../constants"
import { getDashboardAdmin } from '../../https';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { formatRupiah } from '../../utils';

const Metrics = () => {
  const [range, setRange] = useState('today')
  const queryClient = useQueryClient()

  const { data: resData, isLoading } = useQuery({
    queryKey: ["dashboard-admin"],
    queryFn: getDashboardAdmin,
    placeholderData: keepPreviousData,
  });

  const dashboardData = resData?.data ? { ...resData.data } : {};
  return (
    <div className='container mx-auto py-2 px-6 md:px-4'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='font-semibold text-[#f5f5f5] text-xl'>Overall Performace</h2>
          <p className='text-sm text-[#ababab]'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Delectus, exercitationem.</p>
        </div>
        {/* <button className='flex items-center gap-1 px-4 py-2 rounded-md text-[#f5f5f5] bg-[#1a1a1a]'>
                    Last 1 month
                    <svg
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="4"
                    >
                        <path d="M19 9l-7 7-7-7" />
                    </svg>
                </button> */}
        <select name="category" value={range} onChange={(e) => {setRange(e.target.value); queryClient.invalidateQueries(["dashboard-admin"])}} className="bg-[#1f1f1f] text-white focus:outline-none w-fit cursor-pointer" required>
          <option value="" disabled>Select Range</option>
          <option key="today" value="today">Today</option>
          <option key="yesterday" value="yesterday">Yesterday</option>
          <option key="last7days" value="last7days">Last 7 Days</option>\
          <option key="last30days" value="last30days">Last 30 Days</option>
        </select>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {metricsData.map((metric, index) => {
          return (
            <div
              key={index}
              className="shadow-sm rounded-lg p-4"
              style={{ backgroundColor: metric.color }}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-xs text-[#f5f5f5]">
                  {metric.title}
                </p>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                  >
                    <path
                      d={metric.isIncrease ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    />
                  </svg>
                  <p
                    className="font-medium text-xs"
                    style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                  >
                    {metric.percentage}
                  </p>
                </div>
              </div>
              <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">
                {metric.value === "totalOrders" ? dashboardData?.[metric.value] : formatRupiah(dashboardData?.[metric.value])}
              </p>
            </div>
          );
        })}
      </div>


      <div className='flex flex-col justify-between mt-12'>
        <div>
          <h2 className='font-semibold text-[#f5f5f5] text-xl'>Item Details</h2>
          <p className='text-sm text-[#ababab]'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Delectus, exercitationem.</p>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">

          {itemsData.map((item, index) => {
            return (
              <div key={index} className="shadow-sm rounded-lg p-4" style={{ backgroundColor: item.color }}>
                <div className="flex justify-between items-center">
                  <p className="font-medium text-xs text-[#f5f5f5]">{item.title}</p>
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4" fill="none">
                      <path d="M5 15l7-7 7 7" />
                    </svg>
                    <p className="font-medium text-xs text-[#f5f5f5]">{item.percentage}</p>
                  </div>
                </div>
                <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">{item.value}</p>
              </div>
            )
          })
          }

        </div>
      </div>
    </div>
  )
}

export default Metrics