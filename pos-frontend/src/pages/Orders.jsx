import react, { useState } from 'react'
import BottomNav from '../components/shared/BottomNav.jsx'
import OrderCard from '../components/orders/OrderCard.jsx'
import BackButton from '../components/shared/BackButton.jsx'
import { getOrders } from '../https/index.js'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { formatRupiah } from '../utils/index.js'
import Invoice from '../components/menu/Invoice.jsx'

const Orders = () => {

  const [status, setStatus] = useState("all");
  const [orderInfo, setOrderInfo] = useState();
  const [showInvoice, setShowInvoice] = useState(false);

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData
  })

  const orders = resData?.data?.data
    ? [...resData.data.data]
    : [];
  
  function handleDetail (order) {
    setShowInvoice(true)
    setOrderInfo(order)
  }

  return (
    <section className='bg-[#1f1f1f] h-full min-h-0 overflow-hidden flex flex-col'>
      <div className='flex items-center justify-between px-10 py-4'>
        <div className='flex items-center gap-4'>
          <BackButton />
          <h1 className='text-[#f5f5f5] text-2xl font-bold tracking-wider'>
            Orders
          </h1>
        </div>
        {/* <div className='flex items-center justify-around gap-4'>
          <button
            onClick={() => setStatus("all")}
            className={`text-[#ababab] text-lg ${status === "all" ? "bg-[#383838]" : ""} rounded-lg px-5 py-2 font-semibold`}>
            All
          </button>
          <button
            onClick={() => setStatus("in progress")}
            className={`text-[#ababab] text-lg ${status === "in progress" ? "bg-[#383838]" : ""} rounded-lg px-5 py-2 font-semibold`}>
            In Progress
          </button>
          <button
            onClick={() => setStatus("ready")}
            className={`text-[#ababab] text-lg ${status === "ready" ? "bg-[#383838]" : ""} rounded-lg px-5 py-2 font-semibold`}>
            Ready
          </button>
          <button
            onClick={() => setStatus("completed")}
            className={`text-[#ababab] text-lg ${status === "completed" ? "bg-[#383838]" : ""} rounded-lg px-5 py-2 font-semibold`}>
            Completed
          </button>
        </div> */}
      </div>

      <div className="grid grid-cols-3 gap-5 p-10 py-5 overflow-y-scroll scrollbar-hide flex-1 min-h-0">
        {
          orders.length ? orders.map((value, index) => {
            return <OrderCard
            key={index}
            customerName={value.customerDetails?.name} 
            itemsCount={value.items?.length || 0} 
            total={formatRupiah(value.bills?.total)} 
            dateTime={value.createdAt}
            handleDetail={() => handleDetail(value)}
            // handleDetail={() => console.log("Clicked")}
            />
          }) : <p>No Orders at the moment</p>
        }
      </div>

            {showInvoice && (
              <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
            )}
    </section>
  )
}

export default Orders