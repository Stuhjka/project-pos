import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, getDishes, deleteCategory, deleteDish, updateDish } from '../../https'; 
import { FaTrash, FaEdit, FaTag } from 'react-icons/fa'; // FaCalculator dihapus krn gak dipake
import { IoMdClose } from 'react-icons/io';
import { enqueueSnackbar } from 'notistack';

const MenuManagement = () => {
    const queryClient = useQueryClient();
    
    // --- STATE FILTER & MODAL ---
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingDish, setEditingDish] = useState(null);
    
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

    // --- 2. EFFECT: DEFAULT CATEGORY ---
    useEffect(() => {
        if (categories?.data?.data?.length > 0 && !selectedCategory) {
            setSelectedCategory(categories.data.data[0]);
        }
    }, [categories, selectedCategory]);

    // --- 3. LOGIC MUTATIONS ---
    const deleteCatMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(["categories"]); 
            enqueueSnackbar("Category deleted!", { variant: "success" });
        }
    });

    const deleteDishMutation = useMutation({
        mutationFn: deleteDish,
        onSuccess: () => {
            queryClient.invalidateQueries(["dishes"]); 
            enqueueSnackbar("Dish deleted!", { variant: "success" });
        }
    });

    const updateDishMutation = useMutation({
        mutationFn: updateDish,
        onSuccess: () => {
            queryClient.invalidateQueries(["dishes"]);
            setIsEditModalOpen(false);
            enqueueSnackbar("Price & Discount updated!", { variant: "success" });
        }
    });

    // --- 4. HANDLERS ---
    const handleDelete = (id, type) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            if (type === 'category') deleteCatMutation.mutate(id);
            if (type === 'dish') deleteDishMutation.mutate(id);
        }
    };

    const openEditModal = (dish) => {
        setEditingDish(dish);
        setEditForm({
            price: dish.price,
            discount: 0,
            finalPrice: dish.price 
        });
        setIsEditModalOpen(true);
    };

    const handlePriceCalculation = (field, value) => {
        setEditForm(prev => {
            let val = value;
            
            // 🛡️ VALIDASI: Pastikan diskon cuma boleh 0-100
            if (field === 'discount') {
                 // Kalau user ngetik kosong, biarin dulu biar bisa dihapus
                 if (val === "") val = ""; 
                 else val = Math.min(Math.max(parseFloat(val), 0), 100);
            }

            const newState = { ...prev, [field]: val };
            const priceVal = newState.price === "" ? 0 : parseFloat(newState.price);
            const discountVal = newState.discount === "" ? 0 : parseFloat(newState.discount);
            
            // Hitung harga akhir otomatis
            const calculatedFinal = priceVal - (priceVal * (discountVal / 100));
            return { ...newState, finalPrice: calculatedFinal };
        });
    };

    const handleSaveUpdate = () => {
        const payload = { price: editForm.finalPrice };
        updateDishMutation.mutate({ id: editingDish._id, payload });
    };

    // --- 5. FILTER LOGIC ---
    const filteredDishes = dishes?.data?.data?.filter(
        (dish) => dish.category?._id === selectedCategory?._id || dish.category === selectedCategory?._id
    );

    if (catLoading || dishLoading) return (
        <div className="flex justify-center items-center h-[50vh] text-white">
            <p className="animate-pulse">Loading management data...</p>
        </div>
    );

    return (
        <div className='container mx-auto py-6 px-6'>
            
            {/* --- SECTION 1: MANAGE CATEGORIES --- */}
            <div className='mb-10'>
                <div className='mb-6'>
                      <h2 className='font-bold text-[#f5f5f5] text-2xl'>Menu Management</h2>
                      <p className='text-sm text-[#ababab]'>Organize your categories and price lists.</p>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-4 pt-2 pr-2 scrollbar-hide">
                    {categories?.data?.data?.map((cat) => (
                        <div key={cat._id} className="relative group shrink-0">
                            <button 
                                onClick={() => setSelectedCategory(cat)}
                                className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all border-2
                                ${selectedCategory?._id === cat._id ? 'bg-yellow-500 border-white text-black font-bold shadow-lg scale-105' : 'bg-[#1f1f1f] border-[#333] text-gray-400'}`}
                            >
                                <span className="text-2xl">{cat.icon}</span>
                                <span className="text-sm whitespace-nowrap">{cat.title}</span>
                            </button>
                            
                            <button 
                                onClick={() => handleDelete(cat._id, 'category')}
                                className="absolute -top-2 -right-1 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl z-10 hover:scale-110 active:scale-90 border border-white/20"
                            >
                                <FaTrash size={10} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- SECTION 2: FILTERED DISHES --- */}
            <div className="mt-4">
                <div className='mb-6 flex justify-between items-end'>
                    <div>
                        <h2 className='font-bold text-[#f5f5f5] text-xl'>Items in {selectedCategory?.title}</h2>
                        <p className='text-sm text-[#ababab]'>Total: {filteredDishes?.length || 0} items</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-20">
                    {filteredDishes?.length > 0 ? (
                        filteredDishes.map((dish) => (
                            <div key={dish._id} className="bg-[#1f1f1f] p-5 rounded-2xl flex gap-4 border border-[#333] relative group hover:border-yellow-500 transition-all shadow-sm">
                                <div className="w-16 h-16 bg-[#2a2a2a] rounded-xl flex items-center justify-center text-2xl border border-[#333]">
                                    {selectedCategory?.icon || "🍽️"}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-[#f5f5f5] font-bold truncate text-lg">{dish.title}</h3>
                                    <p className="text-[#f6b100] font-bold text-base mt-1">
                                        Rp {dish.price.toLocaleString('id-ID')}
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1 line-clamp-1">{dish.description || "No description"}</p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button onClick={() => openEditModal(dish)} className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-all border border-blue-500/20">
                                        <FaEdit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(dish._id, 'dish')} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20">
                                        <FaTrash size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-[#1a1a1a] rounded-2xl border border-dashed border-[#333] py-16 text-center text-gray-500">
                             <p className="text-lg font-medium">No dishes found in this category.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL EDIT (PRICE & DISCOUNT) --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] rounded-3xl shadow-2xl w-full max-w-md border border-[#333] p-8 relative">
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                            <IoMdClose size={28} />
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-2">Edit Price</h2>
                        <p className="text-[#ababab] mb-8">Set new pricing for <span className="text-yellow-500 font-bold">{editingDish?.title}</span></p>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs uppercase text-gray-500 font-bold mb-3 tracking-widest">Base Price</label>
                                <div className="bg-[#222] p-4 rounded-2xl flex items-center border border-[#333] focus-within:border-yellow-500 transition-all">
                                    <span className="text-gray-500 mr-3 font-bold">Rp</span>
                                    <input 
                                        type="number" 
                                        value={editForm.price} 
                                        onChange={(e) => handlePriceCalculation('price', e.target.value)}
                                        className="bg-transparent w-full text-white focus:outline-none font-bold text-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase text-gray-500 font-bold mb-3 tracking-widest flex justify-between">
                                    <span>Discount</span>
                                    <span className="text-yellow-500 font-bold">%</span>
                                </label>
                                <div className="bg-[#222] p-4 rounded-2xl flex items-center border border-[#333] focus-within:border-yellow-500 transition-all">
                                    <input 
                                        type="number" 
                                        max="100" min="0"
                                        value={editForm.discount} 
                                        onChange={(e) => handlePriceCalculation('discount', e.target.value)}
                                        className="bg-transparent w-full text-white focus:outline-none font-bold text-lg"
                                        placeholder="0"
                                    />
                                    <FaTag className="text-gray-600 ml-2" />
                                </div>
                            </div>

                            <div className="bg-yellow-500/5 p-6 rounded-2xl border border-yellow-500/20 text-center">
                                <p className="text-xs text-yellow-500/60 mb-2 font-bold uppercase tracking-widest">Final Selling Price</p>
                                <p className="text-3xl font-black text-white">
                                    Rp {parseInt(editForm.finalPrice || 0).toLocaleString('id-ID')}
                                </p>
                            </div>

                            <button 
                                onClick={handleSaveUpdate}
                                disabled={updateDishMutation.isPending}
                                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-2xl transition-all shadow-xl shadow-yellow-500/10 active:scale-95"
                            >
                                {updateDishMutation.isPending ? "SAVING..." : "UPDATE PRICE"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuManagement;