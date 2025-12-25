import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import { FaNotesMedical } from 'react-icons/fa';
import { removeItem } from '../../redux/slices/cartSlice';

const CartInfo = () => {
    const cartData = useSelector(state => state.cart);
    const scrollRef = useRef();
    const dispatch = useDispatch();

    // 👇 LOGIC SCROLL (SAMA PERSIS TUTORIAL)
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [cartData]);

    const handleRemove = (itemId) => {
        dispatch(removeItem(itemId));
    }

    return (
        <div className='px-4 py-2 flex flex-col h-full min-h-0'>
            <h1 className='text-lg text-[#e4e4e4] font-semibold tracking-wide'>
                Order Details
            </h1>
            
            {/* 👇 CONTAINER SCROLL (REF DITEMPEL DISINI) */}
            <div 
                className='mt-4 overflow-y-auto scrollbar-hide flex-1 min-h-0' 
                ref={scrollRef}
            >
                {cartData.length === 0 ? (
                    <div className='text-center mt-12'>
                        <p className='text-[#ababab] font-semibold text-lg'>Your cart is empty.</p>
                        <p className='text-[#ababab] text-sm mt-1'>Start adding items!</p>
                    </div>
                ) : (
                    cartData.map((item) => {
                        return (
                            <div key={item.id} className='bg-[#1f1f1f] rounded-lg px-4 py-4 mb-2'>
                                <div className='flex items-center justify-between'>
                                    <h1 className='text-[#ababab] font-semibold tracking-wide text-md'>
                                        {item.name}
                                    </h1>
                                    <p className='text-[#ababab] font-semibold'>x{item.quantity}</p>
                                </div>
                                
                                <div className='flex items-center justify-between mt-3'>
                                    <div className='flex items-center gap-3'>
                                        <RiDeleteBin2Fill 
                                            onClick={() => handleRemove(item.id)} 
                                            className='text-[#ababab] cursor-pointer hover:text-red-500' 
                                            size={20} 
                                        />
                                        <FaNotesMedical className='text-[#ababab] cursor-pointer' size={20} />
                                    </div>
                                    <p className='text-[#f5f5f5] text-md font-bold'>
                                        Rp. {item.price.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default CartInfo;