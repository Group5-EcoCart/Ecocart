import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { uploadImages } from '../Service/UploadService';

const FormField = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
    </div>
);
const categories = [
    "clothing", "shoes", "accessories", "jewelry", "electronics", "computer",
    "mobile", "appliances", "furniture", "home", "kitchen", "garden",
    "cosmetics", "skincare", "sports", "books", "stationary", "toys",
    "pet", "health", "other", "food", "groceries"
];

const defaultProductState = {
    Title: '', Price: '', Images: [{ src: '', alt: '' }], Category: 'clothing',
    Description: '', Weight: '', Height: '', Width: '',
    Quantity: '', Keywords: '', Status: 'Active', Size: '', Color: ''
};

export default function ProductFormModal({ isOpen, onClose, onSave, initialData }) {
    const [product, setProduct] = useState(defaultProductState);
    const [imageFiles, setImageFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setProduct({
                    ...defaultProductState,
                    ...initialData,
                    Images: initialData.Images && initialData.Images.length > 0 ? initialData.Images : [{ src: '', alt: '' }],
                    Keywords: Array.isArray(initialData.Keywords) ? initialData.Keywords.join(', ') : '',
                });
            } else {
                setProduct(defaultProductState);
            }
            setImageFiles([]);
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 5) {
            toast.error("You can only upload a maximum of 5 images.");
            return;
        }
        setImageFiles(Array.from(e.target.files));
    };
    
    const handleRemoveImage = (indexToRemove) => {
        setProduct(prev => ({
            ...prev,
            Images: prev.Images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let finalImages = [...product.Images];

            if (imageFiles.length > 0) {
                const formData = new FormData();
                imageFiles.forEach(file => formData.append('images', file));
                const uploadedImageUrls = await uploadImages(formData);
                finalImages = uploadedImageUrls;
            }

            if (finalImages.length === 0) {
                setIsUploading(false);
                return toast.error("Please provide at least one image.");
            }

            const productToSave = {
                ...product,
                Images: finalImages,
                Price: Number(product.Price),
                Quantity: Number(product.Quantity),
                Weight: Number(product.Weight),
                Height: Number(product.Height),
                Width: Number(product.Width),
                Keywords: product.Keywords.split(',').map(k => k.trim()),
            };

            onSave(productToSave);
        } catch (error) {
            toast.error(error.message || "Failed to save product.");
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <FormField label="Product Images (Max 5)">
                        <input type="file" onChange={handleFileChange} multiple accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
                        <div className="mt-2 flex gap-2 flex-wrap">
                            {imageFiles.length > 0
                                ? imageFiles.map((file, index) => (
                                    <img key={index} src={URL.createObjectURL(file)} alt="New preview" className="w-20 h-20 object-cover rounded-md" />
                                ))
                                : product.Images.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img src={img.src} alt={img.alt || 'Product image'} className="w-20 h-20 object-cover rounded-md" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs"
                                            aria-label="Remove image"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    </FormField>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Product Title">
                            <input name="Title" value={product.Title} onChange={handleChange} className="w-full p-2 border rounded" required />
                        </FormField>
                        <FormField label="Price (Rs.)">
                            <input name="Price" type="number" value={product.Price} onChange={handleChange} className="w-full p-2 border rounded" required />
                        </FormField>
                    </div>

                    <FormField label="Description">
                        <textarea name="Description" value={product.Description} onChange={handleChange} rows="3" className="w-full p-2 border rounded" required />
                    </FormField>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Category">
                            <select name="Category" value={product.Category} onChange={handleChange} className="w-full p-2 border rounded bg-white" required>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                        <FormField label="Stock Quantity">
                            <input name="Quantity" type="number" value={product.Quantity} onChange={handleChange} className="w-full p-2 border rounded" required />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField label="Weight (KG)">
                            <input name="Weight" type="number" step="0.01" value={product.Weight} onChange={handleChange} className="w-full p-2 border rounded" required />
                        </FormField>
                        <FormField label="Height (cm)">
                            <input name="Height" type="number" step="0.01" value={product.Height} onChange={handleChange} className="w-full p-2 border rounded" required />
                        </FormField>
                         <FormField label="Width (cm)">
                            <input name="Width" type="number" step="0.01" value={product.Width} onChange={handleChange} className="w-full p-2 border rounded" required />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Size (e.g., M, L, XL)">
                            <input name="Size" value={product.Size} onChange={handleChange} className="w-full p-2 border rounded" />
                        </FormField>
                        <FormField label="Color (e.g., Red)">
                             <input name="Color" value={product.Color} onChange={handleChange} className="w-full p-2 border rounded" />
                        </FormField>
                    </div>

                    <FormField label="Keywords (comma-separated)">
                        <input name="Keywords" value={product.Keywords} onChange={handleChange} className="w-full p-2 border rounded" />
                    </FormField>
                    
                    <FormField label="Status">
                        <select name="Status" value={product.Status} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </FormField>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" disabled={isUploading} className="bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-teal-700 disabled:bg-teal-400">
                            {isUploading ? 'Uploading...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}