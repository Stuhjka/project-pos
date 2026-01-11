import React from "react";

const OrderList = ({ customerName, itemsCount, tableNo }) => {
    
    const getInitials = (name = "") => {
        if (!name) return "?";
        return name
            .trim()
            .split(" ")
            .slice(0, 2)
            .map(word => word[0].toUpperCase())
            .join("");
    };

    return (
        <div className="flex items-center gap-4 p-3 hover:bg-[#1f1f1f] rounded-xl transition-all duration-300 cursor-pointer group border border-transparent hover:border-white/5 mb-1">
            {/* INITIALS DENGAN SHADOW & HOVER EFFECT */}
            <div className="bg-[#f6b100] h-12 w-12 min-w-[48px] flex items-center justify-center text-black text-lg font-black rounded-xl shadow-lg shadow-[#f6b100]/10 group-hover:scale-105 transition-transform duration-300">
                {getInitials(customerName)}
            </div>

            <div className="flex items-center justify-between w-full">
                <div className="flex flex-col items-start">
                    <h1 className="text-[#f5f5f5] text-[15px] font-bold tracking-wide group-hover:text-[#f6b100] transition-colors">
                        {customerName || "Anonymous"}
                    </h1>
                    <p className="text-[#ababab] text-xs font-medium">
                        {itemsCount} {itemsCount > 1 ? 'Items' : 'Item'}
                    </p>
                </div>

                {/* TABLE BADGE MINIMALIS */}
                <div className="flex flex-col items-end">
                    <div className="border border-[#f6b100]/30 group-hover:border-[#f6b100] bg-[#f6b100]/5 px-2 py-1 rounded-md transition-colors">
                        <p className="text-[#f6b100] text-[10px] font-black uppercase tracking-tighter">
                            Tbl: {tableNo || 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderList;