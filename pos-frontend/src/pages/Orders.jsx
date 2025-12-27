import React, { useState } from 'react'
import BottomNav from '../components/shared/BottomNav.jsx'
import OrderCard from '../components/orders/OrderCard.jsx'
import BackButton from '../components/shared/BackButton.jsx'
import { getOrders } from '../https/index.js'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { formatRupiah } from '../utils/index.js'
import Invoice from '../components/menu/Invoice.jsx'
import { FaSpinner, FaClipboardList } from 'react-icons/fa' // Import icon tambahan

const Orders = () => {

  const [status, setStatus] = useState("all");
  const [orderInfo, setOrderInfo] = useState();
  const [showInvoice, setShowInvoice] = useState(false);

  // 📅 UPDATE: Filter Hari Ini + Auto Refetch
  const { data: resData, isError, isLoading } = useQuery({
    queryKey: ["orders", "today"], 
    queryFn: async () => {
      return await getOrders({ filter: "today" });
    },
    placeholderData: keepPreviousData,
    refetchInterval: 10000 // Auto refresh setiap 10 detik
  })

  const orders = resData?.data?.data
    ? [...resData.data.data]
    : [];
  
  function handleDetail (order) {
    setShowInvoice(true)
    setOrderInfo(order)
  }

  const todayDate = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <section className='bg-[#1f1f1f] h-full min-h-0 overflow-hidden flex flex-col'>
      
      {/* --- HEADER CLEAN (Tanpa Background/Border Kotak) --- */}
      <div className='flex items-center justify-between px-6 md:px-10 py-6'>
        <div className='flex items-center gap-4'>
          <BackButton />
          <div>
            <h1 className='text-[#f5f5f5] text-2xl font-bold tracking-wide'>
              Today's Orders
            </h1>
            <p className='text-[#ababab] text-sm mt-1 font-medium'>
              {todayDate} • {orders.length} Active Orders
            </p>
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      {/* Ditambah pt-0 biar jarak ke judul gak kejauhan */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {
          isLoading ? (
            // Loading State
            <div className="col-span-full h-[50vh] flex flex-col items-center justify-center text-gray-500">
                <FaSpinner className="animate-spin text-4xl mb-4 text-yellow-500" />
                <p className="text-lg font-medium">Syncing orders...</p>
            </div>
          ) : orders.length ? (
            // List Order
            orders.map((value, index) => {
                return <OrderCard
                    key={value._id || index}
                    customerName={value.customerDetails?.name} 
                    itemsCount={value.items?.length || 0} 
                    total={formatRupiah(value.bills?.total)} 
                    dateTime={value.createdAt}
                    status={value.orderStatus} 
                    tableNo={value.table?.tableNo || value.table?.table}
                    handleDetail={() => handleDetail(value)}
                />
            })
          ) : (
            // Empty State
            <div className="col-span-full h-[50vh] flex flex-col items-center justify-center text-gray-500 opacity-50 border-2 border-dashed border-[#333] rounded-3xl">
                <FaClipboardList size={60} className="mb-4" />
                <p className="text-xl font-bold">No orders yet today</p>
                <p className="text-sm mt-1">Ready to take new orders!</p>
            </div>
          )
        }
        </div>
      </div>

      {showInvoice && (
        <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
      )}
    </section>
  )
}

export default Orders