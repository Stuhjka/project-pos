import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTotalPrice, removeAllItems } from '../../redux/slices/cartSlice'
import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';
import { addOrder, updateTable } from '../../https';
import Invoice from './Invoice';
import { removeCustomer } from '../../redux/slices/customerSlice';

const Bill = () => {
  const customerData = useSelector((state) => state.customer);
  const cartData = useSelector(state => state.cart);
  const total = useSelector(getTotalPrice);
  const [paymentMethod, setPaymentMethod] = React.useState('')
  const [showInvoice, setShowInvoice] = React.useState(false);
  const [orderInfo, setOrderInfo] = React.useState(null); 
  const dispatch = useDispatch()

  const handlePlaceOrder = async () => {
    // 1. VALIDASI: Cek keranjang kosong
    if (cartData.length === 0) {
      enqueueSnackbar("Cart is empty!", { variant: "error" });
      return;
    }

    // 2. VALIDASI: Cek metode pembayaran
    if (!paymentMethod) {
      enqueueSnackbar("Please select a payment method!", { variant: "warning" });
      return;
    }
    
    const orderData = {
      customerDetails: {
        name: customerData.customerName,
        phone: customerData.customerPhone,
        guest: customerData.guests,
      },
      orderStatus: "In Progress",
      bills: {
        total: total,
        tax: 0,
        totalWithTax: total,
      },
      items: cartData,
      table: customerData.tableId,
      paymentMethod: paymentMethod,
    };
    orderMutation.mutate(orderData);
  };

  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (resData) => {
      const { data } = resData.data;
      setOrderInfo(data); 

      // Logic Table: Tetap update ke 'Booked' biar orderId-nya update ke transaksi terbaru
      const cleanTableId = (data.table && typeof data.table === 'object') 
          ? data.table._id 
          : data.table;

      const tableData = {
        status: "Booked",
        orderId: data._id,
        tableId: cleanTableId, 
      };

      setTimeout(() => {
        tableUpdateMutation.mutate(tableData);
      }, 1000);

      enqueueSnackbar("Order Placed Successfully!", { variant: "success" });
      setShowInvoice(true); 
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar("Transaction Failed", { variant: "error" });
    },
  });

  const tableUpdateMutation = useMutation({
    mutationFn: (reqData) => updateTable(reqData.tableId, reqData),
    onSuccess: () => {
      // 3. LOGIC UTAMA: Kosongkan keranjang setelah meja terupdate
      dispatch(removeAllItems()); 
      console.log("Cart cleared. Ready for next items or receipt view.");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleNewOrder = () => {
    dispatch(removeCustomer());
    dispatch(removeAllItems()); 
    setOrderInfo(null);
    setPaymentMethod('');
    enqueueSnackbar("Ready for next customer!", { variant: "info" });
  };

  return (
    <div className='pb-4'>
      <div className='flex items-center justify-between px-5 mt-2'>
        <p className='text-xs text-[#ababab] font-medium mt-2'>Items({cartData.length})</p>
        <h1 className='text-[#f5f5f5] text-md font-bold'>
          Rp. {total.toLocaleString('id-ID')}
        </h1>
      </div>

      <div className='flex items-center justify-between px-5 mt-2'>
        <p className='text-xs text-[#ababab] font-medium mt-2'>Total</p>
        <h1 className='text-[#f5f5f5] text-md font-bold'>
          Rp. {total.toLocaleString('id-ID')}
        </h1>
      </div>

      <div className='flex items-center gap-3 px-5 mt-4'>
        <button
          className={`px-4 py-3 w-full rounded-lg text-[#ababab] font-semibold ${paymentMethod === "CASH" ? 'bg-[#383737]' : 'bg-[#1f1f1f]'}`}
          onClick={() => setPaymentMethod('CASH')}
        >
          Cash
        </button>
        <button
          className={`px-4 py-3 w-full rounded-lg text-[#ababab] font-semibold ${paymentMethod === "ONLINE" ? 'bg-[#383737]' : 'bg-[#1f1f1f]'}`}
          onClick={() => setPaymentMethod('ONLINE')}
        >
          Online
        </button>
      </div>

      <div className='flex items-center gap-3 px-5 mt-4'>
        {/* Tombol View Receipt */}
        <button 
          className={`bg-[#025cca] px-4 py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-lg ${!orderInfo ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => setShowInvoice(true)} 
          disabled={!orderInfo}
        >
          View Receipt
        </button>
        
        {/* Tombol Place Order */}
        {/* Logic Disabled: Kalau lagi loading, ATAU udah ada orderInfo (sukses), ATAU keranjang kosong */}
        <button
          className={`bg-[#f6b100] px-4 py-3 w-full rounded-lg text-[#1f1f1f] font-semibold text-lg ${cartData.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={async () => await handlePlaceOrder()}
          disabled={orderMutation.isPending || orderInfo || cartData.length === 0} 
        >
          {orderMutation.isPending ? "Processing..." : "Place Order"}
        </button>
      </div>

      {/* Tombol Clear Customer (Untuk ganti orang baru) */}
      {/* {orderInfo && (
        <div className='px-5 mt-4'>
          <button 
            onClick={handleNewOrder}
            className='w-full py-2 rounded-lg border border-[#383737] text-[#ababab] text-sm hover:bg-[#383737] transition-all'
          >
            Start New Order (Clear Customer Data)
          </button>
        </div>
      )} */}

      {showInvoice && (
        <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
      )}
    </div>
  )
}

export default Bill