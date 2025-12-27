import React, { useState, useEffect } from 'react';
import { GrRadialSelected } from 'react-icons/gr';
import { FaShoppingCart, FaSpinner, FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addItems, updateItem } from '../../redux/slices/cartSlice';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getDishes } from '../../https';

const MenuContainer = () => {
    const dispatch = useDispatch();

    // 1. AMBIL DATA DARI SERVER
    const { data: categoriesData, isLoading: catLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories
    });

    const { data: dishesData, isLoading: dishLoading } = useQuery({
        queryKey: ["dishes"],
        queryFn: getDishes
    });

    const cartData = useSelector(state => state.cart);

    // 2. STATE LOKAL
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [itemCount, setItemCount] = useState(0);
    const [itemId, setItemId] = useState(0);

    // 3. EFFECT: SET DEFAULT CATEGORY
    useEffect(() => {
        if (categoriesData?.data?.data?.length > 0 && !selectedCategory) {
            setSelectedCategory(categoriesData.data.data[0]);
        }
    }, [categoriesData, selectedCategory]);

    // 4. LOGIC FILTER DISHES
    const filteredDishes = dishesData?.data?.data?.filter(
        (dish) => dish.category?._id === selectedCategory?._id || dish.category === selectedCategory?._id
    );

    // --- LOGIC CART ---
    const increment = (id) => {
        setItemId(id);
        if (itemCount >= 20) return;
        setItemCount((prev) => prev + 1);
    };

    const decrement = (id) => {
        setItemId(id);
        if (itemCount <= 0) return;
        setItemCount((prev) => prev - 1);
    };

    const handleAddToCart = (item) => {
        if (itemCount === 0) {
            alert("Please select quantity first!");
            return;
        }

        const { title, price, image, _id } = item;
        const dishes = cartData.find((dish) => dish.productId === _id)

        if (dishes) {
            dispatch(updateItem({
                productId: _id,
                quantity: dishes.quantity + itemCount,
                price: dishes.price + (price * itemCount)
            }));
        } else {
            const newObj = {
                id: new Date().getTime(),
                name: title,
                pricePerQuantity: price,
                quantity: itemCount,
                price: price * itemCount,
                image: image,
                productId: _id
            };
            dispatch(addItems(newObj));
        }
        setItemCount(0);
        setItemId(0);
    };

    // --- LOADING STATE ---
    if (catLoading || dishLoading) {
        return (
            <div className="w-full h-96 flex flex-col items-center justify-center text-white">
                <FaSpinner className="animate-spin text-4xl mb-4 text-yellow-500" />
                <p>Loading menu...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col">

            {/* --- BAGIAN ATAS (KATEGORI) --- */}
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 px-6 md:px-10 py-4 w-full'>
                {categoriesData?.data?.data?.map((cat) => {
                    const isSelected = selectedCategory?._id === cat._id;
                    return (
                        <div
                            key={cat._id}
                            className={`flex flex-col items-start justify-between p-3 rounded-lg h-[90px] cursor-pointer transition-all duration-200 relative overflow-hidden group 
                            ${isSelected ? 'scale-105 shadow-lg border-2 border-white' : 'hover:scale-105 border border-transparent'}`}
                            style={{ backgroundColor: cat.bgColor || '#1f1f1f' }}
                            onClick={() => {
                                setSelectedCategory(cat);
                                setItemId(0);
                                setItemCount(0);
                            }}
                        >
                            <div className='flex items-center justify-between w-full relative z-10'>
                                <h1 className='text-[#f5f5f5] text-sm font-semibold flex items-center gap-2'>
                                    <span className="text-xl">{cat.icon}</span> {cat.title}
                                </h1>
                                {isSelected && (
                                    <GrRadialSelected className='text-white' size={16} />
                                )}
                            </div>

                            <p className='text-white/70 text-xs font-medium relative z-10'>
                                {dishesData?.data?.data?.filter(d => d.category?._id === cat._id).length} Items
                            </p>
                        </div>
                    )
                })}
            </div>

            <hr className='border-[#2a2a2a] border-t-2 mt-1 mx-10' />

            {/* --- BAGIAN BAWAH (LIST MAKANAN - NO IMAGE VERSION) --- */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-6 md:px-10 py-6 w-full pb-24 overflow-y-auto scrollbar-hide'>
                {filteredDishes?.length > 0 ? (
                    filteredDishes.map((item) => {
                        const isActive = itemId === item._id;
                        return (
                            <div
                                key={item._id}
                                className='flex flex-col justify-between p-4 rounded-xl min-h-[150px] cursor-pointer bg-[#1a1a1a] border border-[#333] hover:border-yellow-500 hover:bg-[#202020] transition-all duration-200 relative group shadow-md'
                            >
                                {/* INFO UTAMA */}
                                <div>
                                    <div className='flex items-start justify-between w-full mb-1 gap-2'>
                                        <h1 className='text-[#e4e4e4] text-sm font-bold leading-tight line-clamp-2 group-hover:text-yellow-500 transition-colors'>
                                            {item.title}
                                        </h1>
                                        <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold shrink-0">
                                            <FaStar size={10} /> {item.rating || 4.5}
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-500 text-[10px] line-clamp-2 mt-2 leading-relaxed">
                                        {item.description || "No description available."}
                                    </p>
                                </div>

                                {/* FOOTER: HARGA & ACTIONS */}
                                <div className='flex items-center justify-between w-full mt-4 pt-3 border-t border-[#2a2a2a]'>
                                    <p className='text-[#f6b100] text-sm font-bold'>
                                        Rp {item.price.toLocaleString('id-ID')}
                                    </p>

                                    {/* COUNTER BUTTONS */}
                                    <div className='flex items-center bg-[#2a2a2a] rounded-lg p-1 gap-1'>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); decrement(item._id); }}
                                            className='text-gray-400 hover:text-white w-6 h-6 flex items-center justify-center text-lg'
                                        >&minus;</button>
                                        <span className='text-white font-bold text-xs min-w-[15px] text-center'>
                                            {isActive ? itemCount : "0"}
                                        </span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); increment(item._id); }}
                                            className='text-yellow-500 hover:text-yellow-400 w-6 h-6 flex items-center justify-center text-lg'
                                        >&#43;</button>
                                    </div>
                                </div>

                                {/* ADD TO CART BUTTON */}
                                {isActive && itemCount > 0 && (
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className='absolute -top-2 -right-2 bg-[#02ca3a] text-white w-9 h-9 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform z-20'
                                    >
                                        <FaShoppingCart size={14} />
                                    </button>
                                )}
                            </div>
                        )
                    })
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                        <span className="text-5xl mb-4 opacity-50">🍽️</span>
                        <p className="text-lg font-medium text-white">No dishes found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MenuContainer;