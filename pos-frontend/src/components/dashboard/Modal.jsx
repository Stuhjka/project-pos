import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTable, addCategory, addDish, getCategories } from "../../https"; 
import { enqueueSnackbar } from "notistack";

// 👇 IMPORT ANAK-ANAKNYA
import AddCategoryForm from "./forms/AddCategoryForm";
import AddDishForm from "./forms/AddDishForm";

const Modal = ({ type, onClose }) => {
  const queryClient = useQueryClient();
  
  // 1. UPDATE STATE: Tambahin 'imageFile'
  const [formData, setFormData] = useState({
    tableNo: "", seats: "", 
    title: "", bgColor: "#1f1f1f", icon: "🍽️", 
    price: "", description: "", category: "", rating: "4.5",
    image: "",      // Ini nanti jadi URL Preview buat di layar
    imageFile: null // Ini file aslinya buat dikirim ke backend
  });

  // Fetch Category
  const { data: categoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled: type === "dishes"
  });

  // --- HANDLERS ---
  
  // 1. Handle Text Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Handle Emoji Picker (Category)
  const handleEmojiClick = (emojiData) => {
    setFormData((prev) => ({ ...prev, icon: emojiData.emoji }));
  };

  // 3. Handle Color Picker (Category)
  const handleColorChange = (color) => {
    setFormData((prev) => ({ ...prev, bgColor: color }));
  };

  // 4. API MUTATION LOGIC (UPDATE BAGIAN DISHES)
  const mutationFunction = (data) => {
    if (type === "table") return addTable({ tableNo: data.tableNo, seats: data.seats });
    if (type === "category") return addCategory({ title: data.title, bgColor: data.bgColor, icon: data.icon });
    
    // 👇 KHUSUS DISHES: PAKE FORM DATA
    if (type === "dishes") {
        const payload = new FormData();
        payload.append('title', data.title);
        payload.append('price', data.price);
        payload.append('description', data.description);
        payload.append('category', data.category);
        payload.append('rating', data.rating);

        // Kalau ada file gambar yang dipilih, masukin ke amplop
        if(data.imageFile) {
            payload.append('image', data.imageFile); 
        }

        return addDish(payload);
    }
  };

  const dynamicMutation = useMutation({
    mutationFn: mutationFunction,
    onSuccess: (res) => {
        onClose();
        if (type === "category") queryClient.invalidateQueries({ queryKey: ["categories"] });
        if (type === "dishes") queryClient.invalidateQueries({ queryKey: ["dishes"] });
        if (type === "table") queryClient.invalidateQueries({ queryKey: ["tables"] });
        
        enqueueSnackbar(res.data.message || "Success added!", { variant: "success" })
    },
    onError: (error) => {
        const message = error.response?.data?.message || "Something went wrong";
        enqueueSnackbar(message, { variant: "error" });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dynamicMutation.mutate(formData);
  };

  const getTitle = () => {
    if (type === "table") return "Add New Table";
    if (type === "category") return "Create Category";
    if (type === "dishes") return "Add New Menu Item";
  }

  // 👇 STYLE CONSTANTS
  const labelStyle = "block text-[#ababab] mb-2 mt-3 text-sm font-medium";
  const wrapperStyle = "flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]";
  const inputStyle = "bg-transparent flex-1 text-white focus:outline-none w-full";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        // 👇 UPDATE STYLE: Lebih lebar (max-w-2xl) biar muat preview gambar
        className="bg-[#262626] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[#333]"
      >
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#333] bg-[#1f1f1f]">
          <h2 className="text-[#f5f5f5] text-xl font-bold">{getTitle()}</h2>
          <button onClick={onClose} className="text-[#f5f5f5] hover:text-red-500 bg-[#2a2a2a] p-2 rounded-full transition-colors">
            <IoMdClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <form id="modal-form" onSubmit={handleSubmit}>
                
                {/* --- TABLE FORM --- */}
                {type === "table" && (
                    <div className="space-y-2">
                        <div>
                            <label className={labelStyle}>Table Number</label>
                            <div className={wrapperStyle}>
                                <input type="number" name="tableNo" value={formData.tableNo} onChange={handleChange} className={inputStyle} required />
                            </div>
                        </div>
                        <div>
                            <label className={labelStyle}>Seats Capacity</label>
                            <div className={wrapperStyle}>
                                <input type="number" name="seats" value={formData.seats} onChange={handleChange} className={inputStyle} required />
                            </div>
                        </div>
                    </div>
                )}

                {/* --- CATEGORY FORM --- */}
                {type === "category" && (
                    <AddCategoryForm 
                        formData={formData} 
                        handleChange={handleChange} 
                        handleEmojiClick={handleEmojiClick}
                        handleColorChange={handleColorChange}
                    />
                )}

                {/* --- DISH FORM --- */}
                {type === "dishes" && (
                    // 👇 Pass 'setFormData' kesini biar anak bisa update state bapak
                    <AddDishForm 
                        formData={formData} 
                        handleChange={handleChange} 
                        categoryData={categoryData}
                        setFormData={setFormData} 
                    />
                )}

            </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#333] bg-[#1f1f1f] flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-6 py-3 rounded-lg text-gray-400 hover:text-white font-medium hover:bg-[#333] transition-colors"
            >
                Cancel
            </button>
            <button
                type="submit"
                form="modal-form"
                disabled={dynamicMutation.isPending}
                className="px-8 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold shadow-lg shadow-yellow-500/20 transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
            >
                {dynamicMutation.isPending ? "Uploading..." : "Save Changes"}
            </button>
        </div>

      </motion.div>
    </div>
  );
};

export default Modal;