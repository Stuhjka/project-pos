import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTables, updateTable } from "../https";
import { updateTable as updateTableSlice } from "../redux/slices/customerSlice";
import { enqueueSnackbar } from "notistack"; 
import Modal from "../components/shared/Modal";
import { useDispatch } from "react-redux";
import { setCustomer } from "../redux/slices/customerSlice";
import { useNavigate } from "react-router";
// 1. IMPORT PENTING BUAT HAPUS KERANJANG
import { removeAllItems } from "../redux/slices/cartSlice"; 

const Tables = () => {
  const [status, setStatus] = useState("all");
  const [isOpenOrderModal, setIsModalOrderOpen] = useState(false);
  const [isOpenTableModal, setIsModalTableOpen] = useState(false);
  
  const [selectedBookedTableData, setSelectedBookedTableData] = useState(null);

  const [selectedAvailableTab, setSelectedAvailableTab] = useState({
    tableId: '',
    tableNo: ''
  })
  const [guestCount, setGuestCount] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "POS | Tables";
  }, []);

  const { data: resData, isError } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      return await getTables();
    },
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();

  const tableUpdateMutation = useMutation({
    mutationFn: (reqData) => updateTable(reqData.tableId, reqData),
    onSuccess: (resData) => {
      enqueueSnackbar("Table status change successfully", { variant: "success" });
      closeTableModal()
      return queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  if (isError) {
    console.log("Error fetching tables");
  }

  const sortedTables = resData?.data?.data
    ? [...resData.data.data].sort((a, b) => a.table - b.table)
    : [];

  const openModal = (id, tableNo) => {
    setSelectedAvailableTab({
      tableId: id,
      tableNo: tableNo
    })
    setIsModalOrderOpen(true)
  }
  const closeModal = () => {
    setSelectedAvailableTab({
      tableId: '',
      tableNo: ''
    })
    setIsModalOrderOpen(false)
  };

  const openTableModal = (tableData) => {
    setSelectedBookedTableData(tableData); 
    setIsModalTableOpen(true);
  };

  const closeTableModal = () => {
    setSelectedBookedTableData(null);
    setIsModalTableOpen(false)
  };

  const increment = () => {
    if (guestCount >= 6) return;
    setGuestCount((prev) => prev + 1);
  }
  const decrement = () => {
    if (guestCount <= 0) return;
    setGuestCount((prev) => prev - 1);
  }

  // --- LOGIC 1: ORDER BARU (MEJA KOSONG) ---
  const handleCreateOrder = (id) => {
    if (guestCount <= 0) {
      enqueueSnackbar("Guest can't be 0", { variant: "error" });
      return
    }
    
    // ✅ AUTO CLEAR: Karena Meja Baru, keranjang wajib bersih!
    dispatch(removeAllItems());

    dispatch(updateTableSlice({ ...selectedAvailableTab }))
    dispatch(setCustomer({ name, phone, guests: guestCount }));
    closeModal()
    navigate("/menu")
  }

  // --- LOGIC 2: TAMBAH PESANAN (MEJA ISI) ---
  const handleAddToOrder = () => {
    if (!selectedBookedTableData) return;

    const existingCustomer = selectedBookedTableData.currentOrder?.customerDetails;

    if (existingCustomer) {
      dispatch(setCustomer({ 
        name: existingCustomer.name, 
        phone: existingCustomer.phone, 
        guests: existingCustomer.guest 
      }));
    }

    dispatch(updateTableSlice({ 
      tableId: selectedBookedTableData._id,
      tableNo: selectedBookedTableData.table
    }));

    // ❌ NO CLEAR: Kita tidak hapus keranjang di sini. 
    // Jadi kalau ada barang "nyangkut" atau mau nambah, dia tetep ada.
    
    closeTableModal();
    navigate("/menu");
    enqueueSnackbar("Adding items for " + existingCustomer?.name, { variant: "info" });
  };

  const handleChangetableStatus = async () => {
    const tableData = {
      status: "available",
      orderId: null,
      tableId: selectedBookedTableData?._id, 
    };

    await tableUpdateMutation.mutate(tableData)
  }

  return (
    <section className="bg-[#1f1f1f] h-full min-h-0 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-10 py-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
            Tables
          </h1>
        </div>
        <div className="flex items-center justify-around gap-4">
          <button
            onClick={() => setStatus("all")}
            className={`text-[#ababab] text-lg ${status === "all" && "bg-[#383838] rounded-lg px-5 py-2"
              }  rounded-lg px-5 py-2 font-semibold`}
          >
            All
          </button>
          <button
            onClick={() => setStatus("booked")}
            className={`text-[#ababab] text-lg ${status === "booked" && "bg-[#383838] rounded-lg px-5 py-2"
              }  rounded-lg px-5 py-2 font-semibold`}
          >
            Booked
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 px-16 py-4 overflow-y-scroll scrollbar-hide flex-1 min-h-0">
        {sortedTables
          .filter((table) => {
            if (status === "all") return true;
            return table.status === "Booked";
          })
          .map((table) => {
            return (
              <TableCard
                key={table._id}
                id={table._id}
                name={table.table || table.tableNo}
                status={table.status}
                customerName={table?.currentOrder?.customerDetails?.name}
                initials={table?.currentOrder?.customerDetails?.name}
                seats={table.seats}
                openModal={(id) => openModal(id, table.table)}
                openTableModal={() => openTableModal(table)}
              />
            );
          })}
      </div>

      <Modal isOpen={isOpenOrderModal} onClose={closeModal} title="Create Order">
        <form onSubmit={handleCreateOrder}>
          <div>
            <label className='block text-[#ababab] mb-2 text-sm font-medium'>Customer Name</label>
            <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
              <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="" required placeholder="Enter customer name" id=""
                className="bg-transparent flex-1 text-white focus:outline-none" />
            </div>
          </div>
          <div>
            <label className='block text-[#ababab] mb-2 mt-3 text-sm font-medium'>
              Customer Phone <span className="text-xs text-gray-600">(Optional)</span></label>
            <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} type="number" name="" required placeholder="+62-0000000000000" id=""
                className="bg-transparent flex-1 text-white focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block mb-2 mt-3 text-sm font-medium text-[#ababab]">Guest</label>
            <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg">
              <button type="button" onClick={() => decrement()} className="text-yellow-500 text-2xl">&minus;</button>
              <span className="text-white">{guestCount}</span>
              <button type="button" onClick={() => increment()} className="text-yellow-500 text-2xl">&#43;</button>
            </div>
          </div>
          <button type="submit" className="w-full bg-[#F6B100] text-[#f5f5f5] rounded-lg py-3 mt-8 hover:bg-yellow-700">
            Create Order
          </button>
        </form>
      </Modal>

      <Modal isOpen={isOpenTableModal} onClose={closeTableModal} title={`Table ${selectedBookedTableData?.table || ''}`}>
        <div className="flex flex-col gap-3 mt-4">
            <button onClick={handleAddToOrder} className="w-full bg-[#025cca] text-[#f5f5f5] rounded-lg py-3 font-semibold hover:bg-blue-700 transition-all">
                Add Items to Order
            </button>

            <div className="border-t border-gray-600 my-2"></div>

            <p className="text-sm text-[#ababab] text-center mb-1">Finish & Clear Table?</p>
            <div className="flex gap-3">
                <button onClick={handleChangetableStatus} className="w-full bg-[#2e4a40] text-[#f5f5f5] rounded-lg py-3 hover:bg-green-800">
                    Yes, Clear
                </button>
                <button onClick={closeTableModal} className="w-full bg-[#7a2e2e] text-[#f5f5f5] rounded-lg py-3 hover:bg-red-800">
                    Cancel
                </button>
            </div>
        </div>
      </Modal>
    </section>
  );
};

export default Tables;