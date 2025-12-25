import React, { useState } from "react";
import { IoMdHome } from "react-icons/io";
import { MdOutlineReorder } from "react-icons/md";
import { MdTableBar } from "react-icons/md"; 
import { CiCircleMore } from "react-icons/ci"; 
import { BiSolidDish } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import { useDispatch } from "react-redux";
import { setCustomer } from "../../redux/slices/customerSlice";

const BottomNav = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [isOpen, setIsModalOpen] = useState(false);
    const [guestCount, setGuestCount] = useState(0);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const increment = () => {
        if(guestCount >=6) return;
        setGuestCount((prev) => prev +1);
    }
    const decrement = () => {
        if(guestCount <=0) return;
        setGuestCount((prev) => prev -1);
    }

    const isActive = (path) => location.pathname === path;

    const handleCreateOrder = () =>{
        // send data to store
        dispatch(setCustomer({name, phone, guest: guestCount}));
        closeModal()
        navigate("/tables")
    }

    return (
        <div className='bg-[#262626] p-2 h-16 flex justify-around'>
            <button 
                onClick={() => navigate("/")} 
                className={`flex items-center justify-center font-bold w-[200px] rounded-[20px] ${
                    isActive("/") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
                }`}
            >
                <IoMdHome className="inline mr-2" size={20} /> 
                <p>Home</p>
            </button>
            <button 
                onClick={() => navigate("/orders")} 
                className={`flex items-center justify-center font-bold w-[200px] rounded-[20px] ${
                    isActive("/orders") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
                }`}
            >
                <MdOutlineReorder className="inline mr-2" size={20} /> 
                <p>Orders</p>
            </button> 
            <button 
                onClick={() => navigate("/tables")} 
                className={`flex items-center justify-center font-bold w-[300px] rounded-[20px] ${
                    isActive("/tables") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
                }`}
            >
                <MdTableBar className="inline mr-2" size={20} /> 
                <p>Tables</p>
            </button>
            <button className='flex items-center justify-center text-[#ababab] w-[200px]'>
                <CiCircleMore className="inline mr-2" size={20} /> 
                <p>More</p>
            </button>
            {/* <button
                disabled={isActive("/tables") || isActive("/menu")} 
                onClick={openModal} 
                className="absolute bottom-6 bg-[#F6B100] text-[#f5f5f5] rounded-full p-4 items-center hover:scale-105 transition-transform"
                >
                <BiSolidDish size={40}/>
            </button> */}
            
            {/* <Modal isOpen={isOpen} onClose={closeModal} title="Create Order">
                <div>
                    <label className='block text-[#ababab] mb-2 text-sm font-medium'>Customer Name</label>
                    <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="" placeholder="Enter customer name" id="" 
                        className="bg-transparent flex-1 text-white focus:outline-none"/>
                    </div>
                </div>
                <div>
                    <label className='block text-[#ababab] mb-2 mt-3 text-sm font-medium'>
                        Customer Phone <span className="text-xs text-gray-600">(Optional)</span></label>
                    <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} type="number" name="" placeholder="+62-0000000000000" id="" 
                        className="bg-transparent flex-1 text-white focus:outline-none"/>
                    </div>
                </div>
                <div>
                    <label className="block mb-2 mt-3 text-sm font-medium text-[#ababab]">Guest</label>
                    <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg">
                        <button onClick={decrement} className="text-yellow-500 text-2xl">&minus;</button>
                        <span className="text-white">{guestCount}</span>
                        <button onClick={increment} className="text-yellow-500 text-2xl">&#43;</button>
                    </div>
                </div>
                <button onClick={handleCreateOrder} className="w-full bg-[#F6B100] text-[#f5f5f5] rounded-lg py-3 mt-8 hover:bg-yellow-700">
                    Create Order
                </button>
            </Modal> */}
        </div>
    )
};

export default BottomNav;