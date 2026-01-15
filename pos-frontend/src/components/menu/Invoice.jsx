import React, { useRef } from "react";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa6";
import { formatRupiah } from "../../utils";

const Invoice = ({ orderInfo, setShowInvoice }) => {
  const invoiceRef = useRef(null);

  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const WinPrint = window.open("", "", "width=900,height=650");

    WinPrint.document.write(`
      <html>
        <head>
          <title>Order Receipt - AkuLapar</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; padding: 20px; }
            .receipt-container { width: 300px; margin: 0 auto; }
            
            /* Sembunyikan scrollbar pas print */
            ::-webkit-scrollbar { display: none; }
          </style>
        </head>
        <body class="bg-white flex justify-center">
          <div class="receipt-container">
            ${printContent}
          </div>
          <script>
            // Tunggu sebentar biar Tailwind loading dulu baru print
            setTimeout(() => {
              window.print();
              window.close();
            }, 800);
          </script>
        </body>
      </html>
    `);

    WinPrint.document.close();
    WinPrint.focus();
  };

  if (!orderInfo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-[400px]">
        
        {/* Area yang akan di-print */}
        <div ref={invoiceRef} className="p-4 bg-white">
          {/* Receipt Header */}
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
              className="w-12 h-12 border-8 border-green-500 rounded-full flex items-center justify-center shadow-lg bg-green-500"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-2xl"
              >
                <FaCheck className="text-white" />
              </motion.span>
            </motion.div>
          </div>

          <h2 className="text-xl font-bold text-center mb-2">Order Receipt</h2>
          <p className="text-gray-600 text-center text-sm">Thank you for your order!</p>

          {/* Order Details */}
          <div className="mt-4 border-t pt-4 text-sm text-gray-700">
            <p><strong>Order ID:</strong> {Math.floor(new Date(orderInfo.orderDate || orderInfo.createdAt).getTime())}</p>
            <p><strong>Name:</strong> {orderInfo.customerDetails?.name}</p>
            <p><strong>Phone:</strong> {orderInfo.customerDetails?.phone}</p>
            <p><strong>Guests:</strong> {orderInfo.customerDetails?.guest}</p>
          </div>

          {/* Items Summary */}
          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-semibold mb-2">Items Ordered</h3>
            <ul className="text-sm text-gray-700">
              {orderInfo.items?.map((item, index) => (
                <li key={index} className="flex justify-between items-center text-xs mb-1">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{formatRupiah(item.price)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bills Summary */}
          <div className="mt-4 border-t pt-4 text-sm">
            <div className="flex justify-between mb-1">
              <span>Subtotal:</span> 
              <span>{formatRupiah(Number(orderInfo.bills?.total))}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Tax:</span> 
              <span>{formatRupiah(0)}</span>
            </div>
            <div className="flex justify-between font-bold text-md mt-2 pt-2 border-t">
              <span>Grand Total:</span> 
              <span>{formatRupiah(Number(orderInfo.bills?.total))}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mt-4 text-[10px] text-gray-500 text-center italic">
            Payment Method: {orderInfo.paymentMethod}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrint}
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold px-4 py-2"
          >
            Print Receipt
          </button>
          <button
            onClick={() => setShowInvoice(false)}
            className="text-red-500 hover:text-red-700 text-sm font-semibold px-4 py-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;