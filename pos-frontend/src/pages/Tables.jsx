import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTables, updateTable } from "../https";
import { updateTable as updateTableSlice } from "../redux/slices/customerSlice";
import { enqueueSnackbar } from "notistack"; // Pastikan import ini ada
import Modal from "../components/shared/Modal";
import { useDispatch } from "react-redux";
import { setCustomer } from "../redux/slices/customerSlice";
import { useNavigate } from "react-router";

const Tables = () => {
  const [status, setStatus] = useState("all");
  const [isOpenOrderModal, setIsModalOrderOpen] = useState(false);
  const [isOpenTableModal, setIsModalTableOpen] = useState(false);
  const [selectedBookedTab, setSelectedBookedTab] = useState('')
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
    // enqueueSnackbar("Something went wrong!", { variant: "error" });
    console.log("Error fetching tables");
  }

  // 👇 1. LOGIC SORTING (Biar urut 1, 2, 3...)
  // Tutorial aslinya gak punya ini, jadi gw tambahin biar rapi.
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

  const openTableModal = (id) => {
    setSelectedBookedTab(id)
    setIsModalTableOpen(true)
  };
  const closeTableModal = () => {
    setSelectedBookedTab('')
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

  const handleCreateOrder = (id) => {
    // send data to store
    if (guestCount <= 0) {
      enqueueSnackbar("Guest can't be 0", { variant: "error" });
      return
    }
    dispatch(updateTableSlice({ ...selectedAvailableTab }))
    dispatch(setCustomer({ name, phone, guests: guestCount }));
    closeModal()
    navigate("/menu")
  }

  const handleChangetableStatus = async () => {
    const tableData = {
      status: "available",
      orderId: null,
      tableId: selectedBookedTab,
    };

    await tableUpdateMutation.mutate(tableData)
  }

  return (
    <section className="bg-[#1f1f1f] h-full min-h-0 overflow-hidden flex flex-col">
      {/* HEADER (Sama persis kayak Tutorial) */}
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

      {/* 👇 2. GRID LAYOUT (Style Tutorial) + LOGIC FILTER (Fitur Kita) */}
      <div className="grid grid-cols-4 gap-3 px-16 py-4 overflow-y-scroll scrollbar-hide flex-1 min-h-0">
        {sortedTables
          .filter((table) => {
            // Logic Filter: Kalau tab All, lolos semua. Kalau Booked, cuma yg Booked.
            if (status === "all") return true;
            return table.status === "Booked";
          })
          .map((table) => {
            return (
              <TableCard
                key={table._id} // Tambahin Key biar React gak ngomel
                id={table._id}
                // 👇 3. NAMA FIELD DISESUAIKAN
                // Tutorial pake 'tableNo', tapi DB lo pake 'table'. Gw kasih fallback biar aman.
                name={table.table || table.tableNo}
                status={table.status}
                customerName={table?.currentOrder?.customerDetails?.name}
                initials={table?.currentOrder?.customerDetails.name}
                seats={table.seats}
                openModal={(id) => openModal(id)}
                openTableModal={(id, tableNo) => openTableModal(id, tableNo)}
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

      <Modal isOpen={isOpenTableModal} onClose={closeTableModal} title="Update Table">
        <label className="block mb-2 mt-3 text-md font-medium text-[#ababab]">Change Table to Available?</label>
        <div className="flex gap-3">
          <button onClick={handleChangetableStatus} className="w-full bg-[#2e4a40] text-[#f5f5f5] rounded-lg py-3 mt-8">
            Yes
          </button>
          <button onClick={closeTableModal} className="w-full bg-[#7a2e2e] text-[#f5f5f5] rounded-lg py-3 mt-8">
            No
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default Tables;