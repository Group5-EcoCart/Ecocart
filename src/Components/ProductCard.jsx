import React from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HeartIcon } from './Images';
import { addToWishlist, addToCart } from '../Service/Buyer';

export default function ProductCard({ product }) {
    // Use a placeholder image if the product doesn't have one
    const imageUrl = product.Images && product.Images.length > 0 ? product.Images[0].src : 'https://via.placeholder.com/300';

    // Handler for adding to wishlist
    const handleAddToWishlist = async (e) => {
        e.stopPropagation(); // Prevents the Link from navigating
        e.preventDefault();  // Prevents default anchor behavior
        try {
            await addToWishlist(product._id);
            toast.success(`${product.Title} added to wishlist!`);
        } catch (error) {
            toast.error(error.message || "Could not add to wishlist.");
        }
    };

    // Handler for adding to cart
    const handleAddToCart = async (e) => {
        e.stopPropagation(); // Prevents the Link from navigating
        e.preventDefault();  // Prevents default anchor behavior
        try {
            await addToCart(product._id);
            toast.success(`${product.Title} added to cart!`);
        } catch (error) {
            toast.error(error.message || "Could not add to cart.");
        }
    };

    return (
        <Link to={`/product/${product._id}`} className="block group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform group-hover:-translate-y-1 transition-transform duration-300">
                <div className="relative">
                    <img src={imageUrl} alt={product.Title} className="w-full h-48 object-cover" />
                    <button 
                        onClick={handleAddToWishlist}
                        className="absolute top-2 right-2 text-white bg-black bg-opacity-25 rounded-full p-1 hover:bg-opacity-50 hover:text-red-500 transition-colors"
                        aria-label="Add to wishlist"
                    >
                        <HeartIcon />
                    </button>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{product.Title}</h3>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-900 font-bold">Rs.{(product.Price ?? 0).toFixed(2)}</span>
                        <span className="text-teal-600 text-sm font-semibold">{product.EcoPoints ?? 0}EP~</span>
                    </div>
                    <div className="mt-4 flex space-x-2">
                        <button 
                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); /* 'Buy Now' logic can be added here */ }}
                            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                        >
                            Buy Now
                        </button>
                        <button 
                            onClick={handleAddToCart} 
                            className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300"
                        >
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}