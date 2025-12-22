import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTables } from "../https";
import { enqueueSnackbar } from "notistack"; // Pastikan import ini ada

const Tables = () => {
  const [status, setStatus] = useState("all");

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

  if (isError) {
    // enqueueSnackbar("Something went wrong!", { variant: "error" });
    console.log("Error fetching tables");
  }

  // 👇 1. LOGIC SORTING (Biar urut 1, 2, 3...)
  // Tutorial aslinya gak punya ini, jadi gw tambahin biar rapi.
  const sortedTables = resData?.data?.data
    ? [...resData.data.data].sort((a, b) => a.table - b.table)
    : [];

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">
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
            className={`text-[#ababab] text-lg ${
              status === "all" && "bg-[#383838] rounded-lg px-5 py-2"
            }  rounded-lg px-5 py-2 font-semibold`}
          >
            All
          </button>
          <button
            onClick={() => setStatus("booked")}
            className={`text-[#ababab] text-lg ${
              status === "booked" && "bg-[#383838] rounded-lg px-5 py-2"
            }  rounded-lg px-5 py-2 font-semibold`}
          >
            Booked
          </button>
        </div>
      </div>

      {/* 👇 2. GRID LAYOUT (Style Tutorial) + LOGIC FILTER (Fitur Kita) */}
      <div className="grid grid-cols-5 gap-3 px-16 py-4 h-[650px] overflow-y-scroll scrollbar-hide">
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
                initials={table?.currentOrder?.customerDetails.name}
                seats={table.seats}
              />
            );
          })}
      </div>

      <BottomNav />
    </section>
  );
};

export default Tables;