import React, { useState } from 'react'
import { menus } from '../../constants'
import { GrRadialSelected } from 'react-icons/gr'
import { FaShoppingCart } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addItems } from '../../redux/slices/cartSlice';

const MenuContainer = () => {
    
    const [selected, setSelected] = useState(menus[0]);
    const [itemCount, setItemCount] = useState(0);
    const [itemId, setItemId] = useState(0); 
    const dispatch = useDispatch();

    const increment = (id) => {
        setItemId(id);
        if (itemCount >= 4) return;
        setItemCount((prev) => prev + 1);
    };

    const decrement = (id) => {
        setItemId(id);
        if (itemCount <= 0) return;
        setItemCount((prev) => prev - 1);
    };

    const handleAddToCart = (item) => {
        if(itemCount === 0) {
            alert("Please select quantity first!"); 
            return;
        }

        const {name, price} = item;
        
        const newObj = {
            id: new Date().getTime(), // 👈 Pake .getTime() biar ID-nya angka (aman buat Redux)
            name, 
            pricePerQuantity: price, 
            quantity: itemCount, 
            price: price * itemCount // Pastikan price di constants udah angka ya!
        };

        dispatch(addItems(newObj));
        
        // Reset state
        setItemCount(0);
        setItemId(0);
    }

    return (
        <>
            {/* --- BAGIAN ATAS (KATEGORI) --- */}
            <div className='grid grid-cols-4 gap-4 px-10 py-4 w-[100%]'>
                {menus.map((menu) => {
                    return (
                        <div 
                            key={menu.id}
                            className={`flex flex-col items-start justify-between p-4 rounded-lg h-[100px] cursor-pointer transition-all duration-300 ${selected.id === menu.id ? 'scale-105 shadow-lg' : 'hover:scale-105'}`}
                            style={{ backgroundColor: menu.bgColor }}
                            onClick={() => {
                                setSelected(menu);
                                setItemId(0);     
                                setItemCount(0); 
                            }}
                        >
                            <div className='flex items-center justify-between w-full'>
                                <h1 className='text-[#f5f5f5] text-lg font-semibold'>
                                    {menu.icon} {menu.name}
                                </h1>
                                {selected.id === menu.id && (
                                    <GrRadialSelected className='text-white' size={20} />
                                )}
                            </div>
                            <p className='text-[#ababab] text-sm font-semibold'>
                                {menu.items.length} Items
                            </p>
                        </div>
                    )
                })}
            </div>

            {/* --- GARIS PEMBATAS --- */}
            <hr className='border-[#2a2a2a] border-t-2 mt-4' />

            {/* --- BAGIAN BAWAH (LIST MAKANAN) --- */}
            <div className='grid grid-cols-4 gap-4 px-10 py-4 w-[100%]'>
                {selected?.items.map((item) => {
                    return (
                        <div 
                            key={item.id}
                            className='flex flex-col items-start justify-between p-4 rounded-lg h-[160px] cursor-pointer bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-all duration-300 hover:scale-105 relative'
                        >
                            <div className='flex items-start justify-between w-full'>
                                <h1 className='text-[#f5f5f5] text-lg font-semibold tracking-wide'>
                                    {item.name}
                                </h1>
                                <button 
                                    onClick={() => handleAddToCart(item)} 
                                    className='bg-[#2e4a40] text-[#02ca3a] p-2 rounded-lg cursor-pointer hover:scale-110 transition-transform'
                                >
                                    <FaShoppingCart className='text-white' size={18} />
                                </button>
                            </div>

                            <div className='flex items-end justify-between w-full mt-auto'>
                                <p className='text-[#f5f5f5] text-xl font-bold'>
                                    Rp. {item.price.toLocaleString('id-ID')}
                                </p>

                                <div className='flex items-center justify-between bg-[#1f1f1f] px-3 py-2 rounded-lg gap-3'>
                                    <button 
                                        onClick={() => decrement(item.id)}
                                        className='text-yellow-500 text-xl font-bold'
                                    >
                                        &minus;
                                    </button>
                                    
                                    <span className='text-white font-semibold text-sm w-4 text-center'>
                                        {itemId === item.id ? itemCount : "0"}
                                    </span>

                                    <button 
                                        onClick={() => increment(item.id)}
                                        className='text-yellow-500 text-xl font-bold'
                                    >
                                        &#43;
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default MenuContainer