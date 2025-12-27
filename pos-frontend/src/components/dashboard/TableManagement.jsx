import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTables, deleteTable, updateTable } from '../../https'; 
import { FaTrash, FaChair, FaPen } from 'react-icons/fa'; 
import { MdTableRestaurant } from "react-icons/md";
import { IoMdClose } from 'react-icons/io';
import { enqueueSnackbar } from 'notistack';
import { motion, AnimatePresence } from 'framer-motion';

const TableManagement = () => {
    const queryClient = useQueryClient();
    
    // --- STATE EDIT MODAL ---
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [newSeats, setNewSeats] = useState("");

    // --- 1. AMBIL DATA ---
    const { data: tables, isLoading } = useQuery({
        queryKey: ["tables"],
        queryFn: getTables
    });

    // --- 2. MUTATION DELETE ---
    const deleteMutation = useMutation({
        mutationFn: deleteTable,
        onSuccess: () => {
            queryClient.invalidateQueries(["tables"]); 
            enqueueSnackbar("Table deleted successfully!", { variant: "success" });
        },
        onError: (err) => enqueueSnackbar(err.response?.data?.message || "Error deleting table", { variant: "error" })
    });

    // --- 3. MUTATION UPDATE ---
    const updateMutation = useMutation({
        mutationFn: updateTable,
        onSuccess: () => {
            queryClient.invalidateQueries(["tables"]);
            enqueueSnackbar("Table capacity updated!", { variant: "success" });
            setIsEditOpen(false); 
        },
        onError: (err) => enqueueSnackbar(err.response?.data?.message || "Update failed", { variant: "error" })
    });

    // --- 4. HANDLERS ---
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this table?")) {
            deleteMutation.mutate(id);
        }
    };

    const handleEditClick = (table) => {
        setEditingTable(table);
        setNewSeats(table.seats); 
        setIsEditOpen(true);
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        updateMutation.mutate({
            id: editingTable._id,
            payload: {
                seats: Number(newSeats),
                tableNo: editingTable.tableNo || editingTable.table, 
                status: editingTable.status
            }
        });
    };

    if (isLoading) return <div className="text-white p-10 flex items-center gap-2"><div className="animate-spin h-5 w-5 border-2 border-yellow-500 border-t-transparent rounded-full"></div> Loading tables...</div>;

    return (
        <div className='container mx-auto py-6 px-6 h-full flex flex-col min-h-0'>
            
            <div className='mb-8'>
                <h2 className='font-bold text-[#f5f5f5] text-2xl'>Table Management</h2>
                <p className='text-sm text-[#ababab] mt-1'>Update seat capacities and manage your floor plan.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 flex-1 min-h-0 overflow-y-auto scrollbar-hide">
                {tables?.data?.data?.map((table) => (
                    <div key={table._id} className="bg-[#1f1f1f] p-5 rounded-2xl border border-[#333] relative group hover:border-yellow-500 transition-all flex flex-col items-center shadow-lg">
                        
                        {/* --- TOMBOL ACTION (DELETE & EDIT) --- */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            <button 
                                onClick={() => handleEditClick(table)}
                                className="bg-[#2a2a2a] p-2 rounded-xl text-blue-400 hover:text-white hover:bg-blue-500 transition-all shadow-md"
                                title="Edit Seats"
                            >
                                <FaPen size={12} />
                            </button>
                            <button 
                                onClick={() => handleDelete(table._id)}
                                className="bg-[#2a2a2a] p-2 rounded-xl text-red-500 hover:text-white hover:bg-red-500 transition-all shadow-md"
                                title="Delete Table"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>

                        <div className="bg-[#2a2a2a] p-4 rounded-2xl text-yellow-500 mb-3 border border-[#333]">
                            <MdTableRestaurant size={32} />
                        </div>

                        <div className="text-center w-full">
                            <h3 className="text-white font-black text-lg">T-{table.tableNo || table.table}</h3>
                            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mt-1">
                                <FaChair size={10} className="text-yellow-500/50" />
                                <span className="font-medium">{table.seats} Seats</span>
                            </div>
                            
                            <div className={`mt-3 py-1 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider inline-block border ${
                                table.status === 'Occupied' 
                                ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                                : 'bg-green-500/10 text-green-500 border-green-500/20'
                            }`}>
                                {table.status || "Available"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL EDIT (INLINE) --- */}
            <AnimatePresence>
                {isEditOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#1a1a1a] p-8 rounded-3xl border border-[#333] w-full max-w-sm shadow-2xl relative"
                        >
                            <button 
                                onClick={() => setIsEditOpen(false)}
                                className="absolute top-6 right-6 text-gray-500 hover:text-white"
                            >
                                <IoMdClose size={24} />
                            </button>

                            <h3 className="text-white text-xl font-black mb-1">Edit Table {editingTable?.tableNo || editingTable?.table}</h3>
                            <p className="text-[#ababab] text-sm mb-6">Update seat capacity for this table.</p>
                            
                            <form onSubmit={handleSaveEdit}>
                                <div className="mb-6">
                                    <label className="block text-[#f5f5f5] text-xs font-bold uppercase tracking-widest mb-3">Seat Capacity</label>
                                    <div className="bg-[#222] px-4 py-4 rounded-2xl border border-[#333] flex items-center focus-within:border-yellow-500 transition-all">
                                        <FaChair className="text-yellow-500 mr-4" size={20} />
                                        <input 
                                            type="number" 
                                            value={newSeats}
                                            onChange={(e) => setNewSeats(e.target.value)}
                                            className="bg-transparent text-white w-full focus:outline-none font-black text-lg"
                                            min="1"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="w-full py-4 rounded-2xl bg-yellow-500 text-black font-black hover:bg-yellow-400 transition-all shadow-xl shadow-yellow-500/10 active:scale-95"
                                >
                                    {updateMutation.isPending ? "SAVING..." : "UPDATE TABLE"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TableManagement;