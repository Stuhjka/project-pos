import React, { useState } from 'react'
import { itemsData, metricsData } from "../../constants"
import { getDashboardAdmin } from '../../https';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatRupiah } from '../../utils';
import { FaChevronDown } from 'react-icons/fa';

const Metrics = () => {
  const [range, setRange] = useState('today')
  const [isOpen, setIsOpen] = useState(false); // 👈 State baru buat kontrol dropdown
  const queryClient = useQueryClient()

  const { data: resData, isLoading } = useQuery({
    queryKey: ["dashboard-admin", range], 
    queryFn: () => getDashboardAdmin({ range }), 
    placeholderData: keepPreviousData,
  });

  const dashboardData = resData?.data ? { ...resData.data } : {};

  const getFilterLabel = (filter) => {
    switch (filter) {
      case "today": return "Today";
      case "yesterday": return "Yesterday";
      case "last7days": return "Last 7 Days";
      case "last30days": return "Last 30 Days";
      default: return "Select Range";
    }
  };

  return (
    <div className='container mx-auto py-2 px-6 md:px-4 h-full overflow-y-auto'>
      
      {/* HEADER ATAS */}
      <div className='flex justify-between items-end mb-6'>
        <div>
          <h2 className='font-semibold text-[#f5f5f5] text-xl'>Overall Performance</h2>
          <p className='text-sm text-[#ababab]'>Summary of your restaurant's performance.</p>
        </div>

        {/* --- CUSTOM DROPDOWN (VERSI KLIK) --- */}
        <div className="relative z-20">
            <button 
                onClick={() => setIsOpen(!isOpen)} // 👈 Klik buat toggle Buka/Tutup
                className={`flex items-center gap-3 bg-[#1f1f1f] text-white px-5 py-2.5 rounded-lg border hover:border-yellow-500 transition-all text-sm font-medium min-w-[150px] justify-between shadow-sm ${isOpen ? 'border-yellow-500' : 'border-[#333]'}`}
            >
                <span>{getFilterLabel(range)}</span>
                {/* Icon muter kalau lagi dibuka */}
                <FaChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-yellow-500' : ''}`} />
            </button>
            
            {/* Isi Dropdown (Muncul cuma kalau isOpen = true) */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-full min-w-[150px] bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl overflow-hidden z-30">
                    {["today", "yesterday", "last7days", "last30days"].map((itemRange) => (
                        <button
                            key={itemRange}
                            onClick={() => {
                                setRange(itemRange);
                                setIsOpen(false); // 👈 Otomatis nutup pas dipilih
                                queryClient.invalidateQueries(["dashboard-admin"]);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm hover:bg-[#333] transition-colors border-b border-[#2a2a2a] last:border-0
                            ${range === itemRange ? 'text-yellow-500 font-bold bg-[#262626]' : 'text-gray-400'}`}
                        >
                            {getFilterLabel(itemRange)}
                        </button>
                    ))}
                </div>
            )}
            
            {/* Overlay transparan biar kalau klik di luar dropdown, dia nutup */}
            {isOpen && (
                <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
            )}
        </div>
      </div>

      {/* --- GRID METRICS (SAMA AJA) --- */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((metric, index) => {
          return (
            <div
              key={index}
              className="shadow-sm rounded-lg p-4"
              style={{ backgroundColor: metric.color }}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-xs text-[#f5f5f5]">{metric.title}</p>
                {/* <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4" fill="none" style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}>
                    <path d={metric.isIncrease ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                  </svg>
                  <p className="font-medium text-xs" style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}>{metric.percentage}</p>
                </div> */}
              </div>
              <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">
                {metric.value === "totalOrders" ? dashboardData?.[metric.value] || 0 : formatRupiah(dashboardData?.[metric.value] || 0)}
              </p>
            </div>
          );
        })}
      </div>

      {/* --- ITEM DETAILS (SAMA AJA) --- */}
      <div className='flex flex-col justify-between mt-12'>
        <div>
          <h2 className='font-semibold text-[#f5f5f5] text-xl'>Item Details</h2>
          <p className='text-sm text-[#ababab]'>Overview of your inventory and menu items.</p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {itemsData.map((item, index) => {
             let realValue = 0;
             if (item.title === "Total Categories") realValue = dashboardData?.totalCategory || 0;
             else if (item.title === "Total Dishes") realValue = dashboardData?.totalDish || 0;
             else if (item.title === "Total Tables") realValue = dashboardData?.totalTable || 0;
             else if (item.title === "Active Orders") realValue = dashboardData?.totalOrders || 0;
             else realValue = item.value;

            return (
              <div key={index} className="shadow-sm rounded-lg p-4" style={{ backgroundColor: item.color }}>
                <div className="flex justify-between items-center">
                  <p className="font-medium text-xs text-[#f5f5f5]">{item.title}</p>
                  {/* <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4" fill="none">
                      <path d="M5 15l7-7 7 7" />
                    </svg>
                    <p className="font-medium text-xs text-[#f5f5f5]">{item.percentage}</p>
                  </div> */}
                </div>
                <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">{realValue}</p> 
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Metrics