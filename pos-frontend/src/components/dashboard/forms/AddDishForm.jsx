import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone'; // 👈 Import ini

// 👇 Tambahin 'setFormData' di props biar bisa kirim file ke parent
const AddDishForm = ({ formData, handleChange, categoryData, setFormData }) => {

    // Logic saat gambar ditarik (drop)
    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                imageFile: file, // Simpan file fisik buat dikirim ke backend
                image: URL.createObjectURL(file) // Simpan URL sementara buat preview
            }));
        }
    }, [setFormData]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept: {'image/*': []}, // Cuma terima gambar
        maxFiles: 1 
    });

    return (
        <div className="flex flex-col-reverse md:flex-row gap-6">
            
            {/* --- KIRI: INPUT FORM --- */}
            <div className="flex-1 space-y-4">
                <div>
                    <label className="block text-[#ababab] text-sm font-medium mb-2">Dish Name</label>
                    <div className="flex item-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="bg-transparent flex-1 text-white focus:outline-none w-full" required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[#ababab] text-sm font-medium mb-2">Price (Rp)</label>
                        <div className="flex item-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                            <input type="number" name="price" value={formData.price} onChange={handleChange} className="bg-transparent flex-1 text-white focus:outline-none w-full" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[#ababab] text-sm font-medium mb-2">Rating</label>
                        <div className="flex item-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                            <input type="number" step="0.1" max="5" name="rating" value={formData.rating} onChange={handleChange} className="bg-transparent flex-1 text-white focus:outline-none w-full" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-[#ababab] text-sm font-medium mb-2">Category</label>
                    <div className="flex item-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                        <select name="category" value={formData.category} onChange={handleChange} className="bg-[#1f1f1f] flex-1 text-white focus:outline-none w-full cursor-pointer" required>
                            <option value="">Select Category</option>
                            {categoryData?.data?.data?.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.icon} {cat.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Input Image URL Text DIHAPUS, pindah ke kanan */}

                 <div>
                    <label className="block text-[#ababab] text-sm font-medium mb-2">Description</label>
                    <div className="flex item-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                        <textarea name="description" rows="2" value={formData.description} onChange={handleChange} className="bg-transparent flex-1 text-white focus:outline-none w-full resize-none"></textarea>
                    </div>
                </div>
            </div>

            {/* --- KANAN: IMAGE PREVIEW & UPLOAD --- */}
            <div className="w-full md:w-1/3">
                <p className="text-[#ababab] text-xs mb-2 uppercase tracking-wider">Image Upload</p>
                
                {/* Area Drag & Drop */}
                <div 
                    {...getRootProps()}
                    className={`w-full aspect-video rounded-lg overflow-hidden border-2 border-dashed flex items-center justify-center relative cursor-pointer transition-all
                        ${isDragActive ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-600 hover:border-gray-400 bg-[#1a1a1a]'}
                    `}
                >
                    <input {...getInputProps()} />
                    
                    {formData.image ? (
                        <>
                            <img 
                                src={formData.image} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity">
                                Click or Drop to Change
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-500 flex flex-col items-center">
                            <span className="text-4xl mb-2">📷</span>
                            <span className="text-xs text-center">Drag Image Here <br/> or Click to Browse</span>
                        </div>
                    )}
                    
                    {/* Badge Price Preview */}
                    {formData.price && formData.image && (
                        <div className="absolute bottom-2 right-2 bg-black/80 text-[#f6b100] px-2 py-1 rounded text-xs font-bold shadow-sm pointer-events-none">
                            Rp {parseInt(formData.price).toLocaleString('id-ID')}
                        </div>
                    )}
                </div>
                
                {formData.imageFile && (
                    <p className="text-center text-[#ababab] text-[10px] mt-2">
                        Ready to upload: {formData.imageFile.name}
                    </p>
                )}
            </div>
        </div>
    );
};

export default AddDishForm;