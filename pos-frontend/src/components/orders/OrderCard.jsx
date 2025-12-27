import React from "react";
import { FaCheckDouble, FaCircle } from "react-icons/fa";

const OrderCard = ({
    customerName,
    orderInfo,      // contoh: "#101 Dine in"
    dateTime,       // "January 19, 2025 08:32 PM"
    itemsCount,     // 8
    total,          // "Rp.250.000"
    handleDetail
}) => {
    const getInitials = (name = "") => {
        if (!name) return "";

        return name
            .trim()
            .split(" ")
            .slice(0, 2)               // ambil max 2 kata
            .map(word => word[0].toUpperCase())
            .join("");
    };

    const formatDateTime = (isoString) => {
        if (!isoString) return "";

        const date = new Date(isoString);

        return date.toLocaleString("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };
    return (
        <div className="w-full bg-[#262626] p-4 rounded-lg mb-4 h-fit" onClick={() => handleDetail()}>
            <div className="flex items-center gap-5">
                <button className="bg-[#f6b100] p-3 text-xl font-bold rounded-lg min-w-[60px] min-h-[60px]">
                    {getInitials(customerName)}
                </button>

                <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col items-start gap-1">
                        <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
                            {customerName}
                        </h1>
                        <p className="text-[#ababab] text-sm">{orderInfo}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 text-[#ababab]">
                <p>{formatDateTime(dateTime)}</p>
                <p>{itemsCount} Items</p>
            </div>

            <hr className="w-full mt-4 border-t border-gray-500" />

            <div className="flex items-center justify-between mt-4">
                <h1 className="text-[#f5f5f5] text-xl font-semibold">Total</h1>
                <p className="text-[#f5f5f5] text-lg font-semibold">{total}</p>
            </div>
        </div>
    );
};

export default OrderCard;
