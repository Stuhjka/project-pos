import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// 👇 Pastikan updateDish diimport disini
import { getCategories, getDishes, deleteCategory, deleteDish, updateDish } from '../../https'; 
import { FaTrash, FaEdit, FaTag, FaCalculator } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { enqueueSnackbar } from 'notistack';

const MenuManagement = () => {
    const queryClient = useQueryClient();
    
    // --- STATE BUAT EDIT ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingDish, setEditingDish] = useState(null);
    
    // Form State
    const [editForm, setEditForm] = useState({
        price: "",
        discount: 0,
        finalPrice: ""
    });

    // --- 1. AMBIL DATA ---
    const { data: categories, isLoading: catLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories
    });

    const { data: dishes, isLoading: dishLoading } = useQuery({
        queryKey: ["dishes"],
        queryFn: getDishes
    });

    // --- 2. LOGIC DELETE ---
    const deleteCatMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(["categories"]); 
            enqueueSnackbar("Category deleted!", { variant: "success" });
        },
        onError: (err) => enqueueSnackbar(err.response?.data?.message || "Error deleting", { variant: "error" })
    });

    const deleteDishMutation = useMutation({
        mutationFn: deleteDish,
        onSuccess: () => {
            queryClient.invalidateQueries(["dishes"]); 
            enqueueSnackbar("Dish deleted!", { variant: "success" });
        },
        onError: (err) => enqueueSnackbar(err.response?.data?.message || "Error deleting", { variant: "error" })
    });

    // --- 3. LOGIC UPDATE (BARU) ---
    const updateDishMutation = useMutation({
        mutationFn: updateDish,
        onSuccess: () => {
            queryClient.invalidateQueries(["dishes"]);
            setIsEditModalOpen(false);
            enqueueSnackbar("Price & Discount updated!", { variant: "success" });
        },
        onError: (err) => enqueueSnackbar(err.response?.data?.message || "Update failed", { variant: "error" })
    });

    const handleDelete = (id, type) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            if (type === 'category') deleteCatMutation.mutate(id);
            if (type === 'dish') deleteDishMutation.mutate(id);
        }
    };

    // --- HANDLER EDIT ---
    const openEditModal = (dish) => {
        setEditingDish(dish);
        setEditForm({
            price: dish.price, // Harga database
            discount: 0,       // Reset diskon
            finalPrice: dish.price 
        });
        setIsEditModalOpen(true);
    };

    // 👇 LOGIC KALKULATOR (YANG UDAH DIBENERIN BIAR GAK MAKSA '0')
    const handlePriceCalculation = (field, value) => {
        
        // 1. Update State Input apa adanya (String) biar bisa kosong
        setEditForm(prev => {
            const newState = { ...prev, [field]: value };
            
            // 2. Ambil angka buat kalkulasi (Kalau kosong "", anggap 0 buat itung-itungan doang)
            const priceVal = newState.price === "" ? 0 : parseFloat(newState.price);
            const discountVal = newState.discount === "" ? 0 : parseFloat(newState.discount);

            // 3. Hitung Final Price
            const calculatedFinal = priceVal - (priceVal * (discountVal / 100));
            
            return { 
                ...newState, 
                finalPrice: calculatedFinal 
            };
        });
    };

    const handleSaveUpdate = () => {
        // Kita kirim 'finalPrice' sebagai harga baru ke database
        const payload = {
            price: editForm.finalPrice, 
        };

        updateDishMutation.mutate({ id: editingDish._id, payload });
    };

    if (catLoading || dishLoading) return <div className="text-white p-10">Loading data...</div>;

    return (
        <div className='container mx-auto py-2 px-6 md:px-4'>
            
            {/* --- SECTION 1: CATEGORIES --- */}
            <div className='mb-8'>
                <div className='mb-4'>
                     <h2 className='font-semibold text-[#f5f5f5] text-xl'>Manage Categories</h2>
                     <p className='text-sm text-[#ababab]'>Organize your menu categories here.</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categories?.data?.data?.map((cat) => (
                        <div key={cat._id} className="bg-[#1f1f1f] p-4 rounded-lg border border-[#333] relative group hover:border-yellow-500 transition-colors shadow-sm">
                            <div className="flex justify-between items-start">
                                <span className="text-3xl">{cat.icon}</span>
                                <button 
                                    onClick={() => handleDelete(cat._id, 'category')}
                                    className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                            <h3 className="text-white font-semibold mt-2">{cat.title}</h3>
                            <div className="w-full h-1 mt-2 rounded-full" style={{ backgroundColor: cat.bgColor }}></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- SECTION 2: DISHES --- */}
            <div>
                <div className='mb-4'>
                     <h2 className='font-semibold text-[#f5f5f5] text-xl'>Manage Dishes</h2>
                     <p className='text-sm text-[#ababab]'>Set prices and discounts here.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dishes?.data?.data?.map((dish) => (
                        <div key={dish._id} className="bg-[#1f1f1f] p-4 rounded-lg flex gap-4 border border-[#333] relative group hover:bg-[#252525] transition-colors shadow-sm">
                            {/* Image */}
                            <div className="w-20 h-20 bg-gray-700 rounded-md bg-cover bg-center shrink-0 border border-gray-600" 
                                 style={{ backgroundImage: `url(${dish.image || 'https://via.placeholder.com/150'})` }}>
                            </div>
                            
                            <div className="flex-1 overflow-hidden">
                                <h3 className="text-[#f5f5f5] font-bold truncate">{dish.title}</h3>
                                
                                {/* Harga Tampil */}
                                <p className="text-[#f6b100] font-semibold text-lg">
                                    Rp {dish.price.toLocaleString('id-ID')}
                                </p>
                                
                                <p className="text-gray-400 text-xs mt-1 truncate">{dish.description || "No description"}</p>
                                
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="bg-[#2a2a2a] text-xs text-gray-300 px-2 py-1 rounded">
                                        {dish.category?.title || "Uncategorized"}
                                    </span>
                                </div>
                            </div>

                            {/* ACTION BUTTONS (Edit & Delete) */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {/* Tombol Edit Baru */}
                                <button 
                                    onClick={() => openEditModal(dish)}
                                    className="p-2 bg-[#1a1a1a] rounded-full shadow-lg text-blue-400 hover:text-blue-300 border border-[#333]"
                                    title="Edit Price & Discount"
                                >
                                    <FaEdit size={14} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(dish._id, 'dish')}
                                    className="p-2 bg-[#1a1a1a] rounded-full shadow-lg text-red-500 hover:text-red-400 border border-[#333]"
                                    title="Delete Dish"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- MODAL EDIT PRICE & DISCOUNT --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#262626] rounded-xl shadow-2xl w-full max-w-md border border-[#333] p-6 relative">
                        
                        <button 
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <IoMdClose size={24} />
                        </button>

                        <h2 className="text-xl font-bold text-white mb-1">Edit Pricing</h2>
                        <p className="text-sm text-[#ababab] mb-6">Update price for <span className="text-yellow-500">{editingDish?.title}</span></p>

                        <div className="space-y-5">
                            {/* Input Harga Normal */}
                            <div>
                                <label className="block text-xs uppercase text-[#ababab] font-bold mb-2">Base Price (Rp)</label>
                                <div className="bg-[#1f1f1f] p-3 rounded-lg flex items-center border border-[#333] focus-within:border-yellow-500">
                                    <span className="text-gray-500 mr-2">Rp</span>
                                    <input 
                                        type="number" 
                                        value={editForm.price} 
                                        onChange={(e) => handlePriceCalculation('price', e.target.value)}
                                        className="bg-transparent w-full text-white focus:outline-none font-semibold"
                                    />
                                </div>
                            </div>

                            {/* Input Diskon (%) */}
                            <div>
                                <label className="block text-xs uppercase text-[#ababab] font-bold mb-2 flex justify-between">
                                    <span>Discount Percentage</span>
                                    <span className="text-yellow-500 flex items-center gap-1"><FaTag size={10}/> Promo</span>
                                </label>
                                <div className="bg-[#1f1f1f] p-3 rounded-lg flex items-center border border-[#333] focus-within:border-yellow-500">
                                    <input 
                                        type="number" 
                                        max="100"
                                        min="0"
                                        value={editForm.discount} 
                                        onChange={(e) => handlePriceCalculation('discount', e.target.value)}
                                        className="bg-transparent w-full text-white focus:outline-none font-semibold"
                                        placeholder="0"
                                    />
                                    <span className="text-gray-500 ml-2 font-bold">%</span>
                                </div>
                            </div>

                            {/* Divider Logic */}
                            <div className="flex items-center gap-4 py-2">
                                <hr className="flex-1 border-gray-700"/>
                                <FaCalculator className="text-gray-600"/>
                                <hr className="flex-1 border-gray-700"/>
                            </div>

                            {/* Preview Harga Akhir */}
                            <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30 text-center">
                                <p className="text-xs text-[#f6b100] mb-1 font-bold uppercase">New Selling Price</p>
                                <p className="text-2xl font-bold text-white">
                                    Rp {parseInt(editForm.finalPrice || 0).toLocaleString('id-ID')}
                                </p>
                                {editForm.discount > 0 && (
                                    <p className="text-xs text-gray-400 mt-1 line-through">
                                        Original: Rp {parseInt(editForm.price || 0).toLocaleString('id-ID')}
                                    </p>
                                )}
                            </div>

                            {/* Tombol Simpan */}
                            <button 
                                onClick={handleSaveUpdate}
                                disabled={updateDishMutation.isPending}
                                className="w-full bg-[#f6b100] hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition-colors mt-2"
                            >
                                {updateDishMutation.isPending ? "Updating..." : "Save New Price"}
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default MenuManagement;