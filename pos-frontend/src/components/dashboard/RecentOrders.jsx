import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '../../https/index.js';
import { formatRupiah } from '../../utils/index.js';
import OrderCard from '../orders/OrderCard.jsx';
import Invoice from '../menu/Invoice.jsx';
import { FaCalendarAlt, FaChevronDown, FaSpinner } from 'react-icons/fa';

const RecentOrders = () => {
    const [selectedRange, setSelectedRange] = useState("today");
    const [isOpen, setIsOpen] = useState(false); // 👈 State buat buka/tutup dropdown
    const [showInvoice, setShowInvoice] = useState(false);
    const [orderInfo, setOrderInfo] = useState(null);

    const { data: resData, isLoading } = useQuery({
        queryKey: ["orders", selectedRange],
        queryFn: () => getOrders({ filter: selectedRange }),
    });

    const orders = resData?.data?.data || [];

    const handleDetail = (order) => {
        setOrderInfo(order);
        setShowInvoice(true);
    };

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
        <div className="bg-[#262626] p-4 rounded-xl border border-[#333] flex flex-col">
            
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4'>
                <div>
                    <h2 className="text-[#f5f5f5] text-lg font-bold">Recent Orders History</h2>
                    <p className='text-[#ababab] text-xs mt-1'>
                        {isLoading ? "Loading..." : `${orders.length} transactions found`}
                    </p>
                </div>

                {/* 👇 CUSTOM DROPDOWN (LOGIC & STYLE SAMA KAYAK METRICS) */}
                <div className="relative z-20">
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className={`flex items-center gap-3 bg-[#1f1f1f] text-white px-5 py-2.5 rounded-lg border hover:border-yellow-500 transition-all text-sm font-medium min-w-[150px] justify-between shadow-sm ${isOpen ? 'border-yellow-500' : 'border-[#333]'}`}
                    >
                        <span>{getFilterLabel(selectedRange)}</span>
                        <FaChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-yellow-500' : ''}`} />
                    </button>
                    
                    {/* Isi Dropdown */}
                    {isOpen && (
                        <div className="absolute right-0 top-full mt-2 w-full min-w-[150px] bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl overflow-hidden z-30">
                            {["today", "yesterday", "last7days", "last30days"].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => {
                                        setSelectedRange(range);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm hover:bg-[#333] transition-colors border-b border-[#2a2a2a] last:border-0
                                    ${selectedRange === range ? 'text-yellow-500 font-bold bg-[#262626]' : 'text-gray-400'}`}
                                >
                                    {getFilterLabel(range)}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Overlay Click Outside */}
                    {isOpen && (
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    )}
                </div>
            </div>

            {/* Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {isLoading ? (
                    <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-10">
                        <FaSpinner className="animate-spin text-2xl mb-2 text-yellow-500" />
                        <p className="text-xs">Loading...</p>
                    </div>
                ) : orders.length > 0 ? (
                    orders.map((order, index) => (
                        <OrderCard
                            key={order._id || index}
                            customerName={order.customerDetails?.name || "Guest"}
                            itemsCount={order.items?.length || 0}
                            total={formatRupiah(order.bills?.total)}
                            dateTime={order.createdAt}
                            status={order.orderStatus} 
                            handleDetail={() => handleDetail(order)}
                        />
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-10 bg-[#1f1f1f] rounded-xl border border-dashed border-[#333]">
                        <FaCalendarAlt size={24} className="mb-2 opacity-20" />
                        <p className="text-sm font-medium">No orders found.</p>
                    </div>
                )}
            </div>

            {showInvoice && (
                <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
            )}
        </div>
    );
};

export default RecentOrders;