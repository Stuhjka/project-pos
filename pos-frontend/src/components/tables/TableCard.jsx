import React from "react";
import { getAvatarName, getBgColor } from "../../utils"
import { FaLongArrowAltRight } from "react-icons/fa";

const TableCard = ({id, name, status, initials, seats, openModal, openTableModal}) => {

  const handleClick = () => {
    if(status === "Booked") {
      openTableModal(id)
      return;
    };
    openModal(id, name)
  };

  return (
    <div 
      onClick={() => handleClick()} 
      key={id} 
      className="w-full h-fit hover:bg-[#2c2c2c] bg-[#262626] p-4 rounded-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-white/5"
    >
      <div className="flex items-center justify-between px-1">
        {/* HEADER: Table [No] -> [Nama Putih] */}
        <h1 className="text-[#f5f5f5] text-lg font-bold flex items-center">
          Table {name} 
          {status === "Booked" && initials && (
            <>
              <FaLongArrowAltRight className="text-[#ababab] mx-2" /> 
              <span className="text-[#f5f5f5] truncate max-w-[100px] text-sm font-semibold">
                {initials}
              </span>
            </>
          )}
        </h1>

        {/* STATUS BADGE */}
        <p className={`${
          status === "Booked" 
          ? "text-red-400 bg-red-900/30 border border-red-800" 
          : "bg-green-900/30 text-green-400 border border-green-800"
        } px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider`}>
          {status}
        </p>
      </div>

      {/* AVATAR SECTION */}
      <div className="flex items-center justify-center mt-6 mb-8">
        <div 
          className="text-white rounded-full h-16 w-16 flex items-center justify-center text-xl font-black shadow-lg" 
          style={{backgroundColor : initials ? getBgColor() : "#1f1f1f"}}
        >
          {getAvatarName(initials) || "N/A"}
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center px-1">
        <p className="text-[#ababab] text-xs uppercase tracking-widest font-semibold">
          Seats: <span className="text-[#f5f5f5]">{seats}</span>
        </p>
      </div>
    </div>
  );
};

export default TableCard;