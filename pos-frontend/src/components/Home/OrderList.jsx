import React from "react";

const OrderList = ({
    customerName,
    itemsCount,
    tableNo,
}) => {

    // 🔹 Ambil initials dari customerName
    const getInitials = (name = "") => {
        if (!name) return "";

        return name
            .trim()
            .split(" ")
            .slice(0, 2)
            .map(word => word[0].toUpperCase())
            .join("");
    };

    return (
        <div className="flex items-center gap-5 mb-3">
            <button className="bg-[#f6b100] p-3 text-xl font-bold rounded-lg">
                {getInitials(customerName)}
            </button>

            <div className="flex items-center justify-between w-full">
                <div className="flex flex-col items-start gap-1">
                    <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
                        {customerName}
                    </h1>
                    <p className="text-[#ababab] text-sm">
                        {itemsCount} Items
                    </p>
                </div>

                <div>
                    <h1 className="text-[#f6b100] font-semibold border border-[#f6b100] rounded-lg p-1">
                        Table No: {tableNo}
                    </h1>
                </div>
            </div>
            {/* <div className='flex flex-col items-end gap-2'>
                    <p className='text-green-600'><FaCheckDouble className='inline mr-2' />Ready</p>
                    <p className='text-[#ababab] text-sm'><FaCircle className="inline mr-2 text-green-600"/>Ready to serve</p>
                </div> */}
        </div>
    );
};

export default OrderList;
