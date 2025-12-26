import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

const AddCategoryForm = ({ formData, handleChange, handleEmojiClick, handleColorChange }) => {
    const [showPicker, setShowPicker] = useState(false);

    // Warna-warna preset pilihan yang estetik
    const presetColors = [
        "#b73e3e", "#5b45b0", "#7f167f", "#735f32", "#1d2569", "#285430", "#be3e3f", "#1f1f1f"
    ];

    return (
        <div className="flex flex-col md:flex-row gap-6 h-full">
            {/* --- KIRI: INPUT FORM --- */}
            <div className="flex-1 space-y-4">
                <div>
                    <label className="block text-[#ababab] text-sm font-medium mb-2">Category Name</label>
                    <div className="flex item-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                        <input 
                            type="text" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            placeholder="e.g. Coffee"
                            className="bg-transparent flex-1 text-white focus:outline-none w-full" 
                            required 
                        />
                    </div>
                </div>

                {/* Custom Emoji Picker */}
                <div className="relative">
                    <label className="block text-[#ababab] text-sm font-medium mb-2">Icon</label>
                    <button 
                        type="button"
                        onClick={() => setShowPicker(!showPicker)}
                        className="w-full bg-[#1f1f1f] text-left text-2xl p-3 rounded-lg flex items-center justify-between border border-transparent hover:border-gray-600 text-white"
                    >
                        <span>{formData.icon || "Select Icon"}</span>
                        <span className="text-xs text-gray-500">Change Emoji</span>
                    </button>
                    
                    {showPicker && (
                        <div className="absolute top-full left-0 mt-2 z-50 shadow-2xl">
                            <EmojiPicker 
                                theme="dark" 
                                onEmojiClick={(emojiData) => {
                                    handleEmojiClick(emojiData);
                                    setShowPicker(false);
                                }} 
                                width={300}
                                height={400}
                            />
                        </div>
                    )}
                </div>

                {/* Color Palette Selection */}
                <div>
                    <label className="block text-[#ababab] text-sm font-medium mb-2">Card Color</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {presetColors.map((color) => (
                            <div 
                                key={color}
                                onClick={() => handleColorChange(color)}
                                className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-transform ${formData.bgColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-110'}`}
                                style={{ backgroundColor: color }}
                            ></div>
                        ))}
                        {/* Custom Color Input */}
                        <div className="relative w-8 h-8 rounded-full overflow-hidden cursor-pointer border-2 border-gray-600">
                            <input 
                                type="color" 
                                name="bgColor" 
                                value={formData.bgColor} 
                                onChange={(e) => handleColorChange(e.target.value)} 
                                className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- KANAN: LIVE PREVIEW --- */}
            <div className="w-full md:w-1/3 flex flex-col">
                <p className="text-[#ababab] text-xs mb-2 uppercase tracking-wider">Live Preview</p>
                <div className="flex-1 flex items-center justify-center p-4 bg-[#1a1a1a] rounded-xl border border-dashed border-gray-700">
                    
                    {/* Kartu Preview */}
                    <div className="w-full aspect-square p-4 rounded-lg relative shadow-lg transition-all" style={{ backgroundColor: formData.bgColor }}>
                        <div className="flex justify-between items-start">
                            <span className="text-4xl">{formData.icon}</span>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white font-bold text-lg truncate">{formData.title || "Category Name"}</h3>
                            <div className="w-full h-1 mt-2 bg-white/20 rounded-full"></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddCategoryForm;