import React, { useState } from 'react'
import { BiSolidDish } from 'react-icons/bi'
import { MdCategory, MdTableBar } from 'react-icons/md'
// 👇 Pastikan path ini bener. Kalau Metrics bisa, harusnya yang lain juga bisa.
import Metrics from '../components/dashboard/Metrics';
import RecentOrders from '../components/dashboard/RecentOrders';
import Modal from '../components/dashboard/Modal';
import MenuManagement from '../components/dashboard/MenuManagement';
import TableManagement from '../components/dashboard/TableManagement'; // 👈 Import TableManagement

const buttons = [
    { label: "Add Table", icon: <MdTableBar />, action: "table" },
    { label: "Add Category", icon: <MdCategory />, action: "category" },
    { label: "Add Dishes", icon: <BiSolidDish />, action: "dishes" },
];

// 👇 Tab "Tables" udah gw masukin sini
const tabs = ["Metrics", "Orders", "Menu", "Tables"];

const Dashboard = () => {
    const [activeModal, setActiveModal] = useState(null);
    const [activeTab, setActiveTab] = useState("Metrics");

    const handleOpenModal = (action) => {
        setActiveModal(action);
    }

    const handleCloseModal = () => {
        setActiveModal(null);
    }

    return (
        <div className='bg-[#1f1f1f] h-full min-h-0 flex flex-col'>
            <div className='container mx-auto flex items-center justify-between py-8 px-6 md:px-4'>
                <div className='flex items-center gap-3'>
                    {buttons.map(({ label, icon, action }) => {
                        return (
                            <button
                                key={label}
                                onClick={() => handleOpenModal(action)}
                                className='bg-[#1a1a1a] hover:bg-[#262626] px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2'
                            >
                                {label} {icon}
                            </button>
                        )
                    })}
                </div>

                <div className='flex items-center gap-3'>
                    {tabs.map((tab) => {
                        return (
                            <button
                                key={tab}
                                className={`px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2 ${activeTab === tab ? "bg-[#262626]" : "bg-[#1a1a1a] hover:bg-[#262626]"}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* 👇 RENDER COMPONENT SESUAI TAB */}
            <div className='flex-1 min-h-0'>
                {activeTab === "Metrics" && <Metrics />}
                {activeTab === "Orders" && <RecentOrders />}
                {activeTab === "Menu" && <MenuManagement />}
                {activeTab === "Tables" && <TableManagement />} {/* 👈 Fitur Hapus Tabel Muncul Disini */}
            </div>

            {/* Modal Logic */}
            {activeModal && (
                <Modal
                    type={activeModal}
                    onClose={handleCloseModal}
                />
            )}

        </div>
    )
}

export default Dashboard