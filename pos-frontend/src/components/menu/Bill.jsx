import React from 'react'
import { useSelector } from 'react-redux'
import { getTotalPrice, removeAllItems } from '../../redux/slices/cartSlice'
import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';
import { addOrder, updateTable } from '../../https';
import Invoice from './Invoice';
import { removeCustomer } from '../../redux/slices/customerSlice';
import { useNavigate } from 'react-router';

const Bill = () => {
  const customerData = useSelector((state) => state.customer);
  const cartData = useSelector(state => state.cart);
  const total = useSelector(getTotalPrice);
  const [paymentMethod, setPaymentMethod] = React.useState('')
  const [showInvoice, setShowInvoice] = React.useState(false);
  const [orderInfo, setOrderInfo] = React.useState();
  const navigate = useNavigate()

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      enqueueSnackbar("Please select a payment method!", {
        variant: "warning",
      });

      return;
    }
    // Place the order
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

      // Update Table
      const tableData = {
        status: "Booked",
        orderId: data._id,
        tableId: data.table,
      };

      setTimeout(() => {
        tableUpdateMutation.mutate(tableData);
      }, 1500);

      enqueueSnackbar("Order Placed!", {
        variant: "success",
      });
      setShowInvoice(true);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const tableUpdateMutation = useMutation({
    mutationFn: (reqData) => updateTable(reqData),
    onSuccess: (resData) => {
      dispatch(removeCustomer());
      dispatch(removeAllItems());
      navigate("/orders")
    },
    onError: (error) => {
      console.log(error);
    },
  });

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
        <button
          className='bg-[#025cca] px-4 py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-lg'
        >
          Print Receipt
        </button>
        <button
          className='bg-[#f6b100] px-4 py-3 w-full rounded-lg text-[#1f1f1f] font-semibold text-lg'
          onClick={async () => await handlePlaceOrder()}
        >
          Place Order
        </button>
      </div>

      {showInvoice && (
        <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
      )}
    </div>
  )
}

export default Bill