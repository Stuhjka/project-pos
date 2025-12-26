import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTables, deleteTable, updateTable } from '../../https'; // 👈 Import updateTable
import { FaTrash, FaChair, FaPen } from 'react-icons/fa'; // 👈 Import FaPen
import { MdTableRestaurant } from "react-icons/md";
import { enqueueSnackbar } from 'notistack';
import { motion } from 'framer-motion';

const TableManagement = () => {
    const queryClient = useQueryClient();
    
    // State buat Edit Modal
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [newSeats, setNewSeats] = useState("");

    const { data: tables, isLoading } = useQuery({
        queryKey: ["tables"],
        queryFn: getTables
    });

    // --- MUTATION DELETE ---
    const deleteMutation = useMutation({
        mutationFn: deleteTable,
        onSuccess: () => {
            queryClient.invalidateQueries(["tables"]); 
            enqueueSnackbar("Table deleted!", { variant: "success" });
        },
        onError: (err) => enqueueSnackbar(err.response?.data?.message, { variant: "error" })
    });

    // --- MUTATION UPDATE ---
    const updateMutation = useMutation({
        mutationFn: updateTable,
        onSuccess: () => {
            queryClient.invalidateQueries(["tables"]);
            enqueueSnackbar("Table updated!", { variant: "success" });
            setIsEditOpen(false); // Tutup modal edit
        },
        onError: (err) => enqueueSnackbar(err.response?.data?.message, { variant: "error" })
    });

    // Handle Klik Tombol Delete
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this table?")) {
            deleteMutation.mutate(id);
        }
    };

    // Handle Klik Tombol Edit (Buka Modal)
    const handleEditClick = (table) => {
        setEditingTable(table);
        setNewSeats(table.seats); // Isi default dengan kursi yg sekarang
        setIsEditOpen(true);
    };

    // Handle Save Edit
    const handleSaveEdit = (e) => {
        e.preventDefault();
        // Panggil API Update
        updateMutation.mutate({
            id: editingTable._id,
            seats: newSeats,
            // Kita kirim ulang data lama biar gak ilang/berubah
            tableNo: editingTable.table, 
            status: editingTable.status
        });
    };

    if (isLoading) return <div className="text-white p-10">Loading tables...</div>;

    return (
        <div className='container mx-auto py-2 px-6 md:px-4'>
            
            <div className='mb-6'>
                <h2 className='font-semibold text-[#f5f5f5] text-xl'>Manage Tables</h2>
                <p className='text-sm text-[#ababab]'>View and manage your restaurant tables.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {tables?.data?.data?.map((table) => (
                    <div key={table._id} className="bg-[#1f1f1f] p-4 rounded-xl border border-[#333] relative group hover:border-yellow-500 transition-all flex flex-col items-center justify-center gap-2 shadow-sm">
                        
                        {/* --- TOMBOL ACTION (DELETE & EDIT) --- */}
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Tombol Edit */}
                            <button 
                                onClick={() => handleEditClick(table)}
                                className="bg-[#2a2a2a] p-1.5 rounded-full text-blue-400 hover:text-blue-300 hover:bg-[#333]"
                                title="Edit Seats"
                            >
                                <FaPen size={10} />
                            </button>
                            {/* Tombol Delete */}
                            <button 
                                onClick={() => handleDelete(table._id)}
                                className="bg-[#2a2a2a] p-1.5 rounded-full text-red-500 hover:text-red-400 hover:bg-[#333]"
                                title="Delete Table"
                            >
                                <FaTrash size={10} />
                            </button>
                        </div>

                        <div className="bg-[#2a2a2a] p-3 rounded-full text-yellow-500 mb-1">
                            <MdTableRestaurant size={24} />
                        </div>

                        <div className="text-center w-full">
                            <h3 className="text-white font-bold text-base truncate">Table {table.tableNo || table.table}</h3>
                            <div className="flex items-center justify-center gap-1.5 text-gray-400 text-xs mt-1">
                                <FaChair size={10} />
                                <span>{table.seats} Seats</span>
                            </div>
                            
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded mt-2 inline-block border ${
                                table.status === 'Occupied' 
                                ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                                : 'bg-green-500/10 text-green-500 border-green-500/20'
                            }`}>
                                {table.status || "Free"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL KECIL BUAT EDIT (INLINE) --- */}
            {isEditOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#262626] p-6 rounded-xl border border-[#333] w-full max-w-sm shadow-2xl"
                    >
                        <h3 className="text-white text-lg font-bold mb-4">Edit Table {editingTable?.table}</h3>
                        
                        <form onSubmit={handleSaveEdit}>
                            <div className="mb-4">
                                <label className="block text-[#ababab] text-sm mb-2">Number of Seats</label>
                                <div className="bg-[#1f1f1f] px-4 py-3 rounded-lg border border-[#333] flex items-center">
                                    <FaChair className="text-gray-500 mr-3" />
                                    <input 
                                        type="number" 
                                        value={newSeats}
                                        onChange={(e) => setNewSeats(e.target.value)}
                                        className="bg-transparent text-white w-full focus:outline-none font-bold"
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditOpen(false)}
                                    className="flex-1 py-2 rounded-lg text-gray-400 hover:bg-[#333] transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="flex-1 py-2 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition"
                                >
                                    {updateMutation.isPending ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

        </div>
    );
};

export default TableManagement;