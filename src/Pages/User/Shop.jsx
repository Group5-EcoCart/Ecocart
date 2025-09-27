import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import Sidebar from '../../Components/Sidebar';
import ProductCard from '../../Components/ProductCard';
import Pagination from '../../Components/Pagination';
import { getWishlist } from '../../Service/Buyer.js';
import { getAllProducts } from '../../Service/Product';
import toast from 'react-hot-toast';

export default function Shop() {
    const [wishlist, setWishlist] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('title-asc');
    const [filters, setFilters] = useState({
        price: '',
        category: 'All',
        rating: '0',
        ecoPoints: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(9);

    const navigate = useNavigate();
    const fetchPageData = useCallback(async () => {
        setLoading(true);
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (!userData || !userData.token) {
                toast.error("Please login to access the shop.");
                navigate('/login');
                return;
            }
            const [productsData, wishlistData] = await Promise.all([
                getAllProducts(),
                getWishlist()
            ]);
            setAllProducts(productsData);
            setWishlist(wishlistData.products || []);
        } catch (error) {
            toast.error(error.message || "Could not fetch page data.");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchPageData();
    }, [fetchPageData]);

    const categories = useMemo(() => {
        return [...new Set(allProducts.map(p => p.Category))];
    }, [allProducts]);

    useEffect(() => {
        let tempProducts = [...allProducts];
        
        if (filters.category !== 'All') {
            tempProducts = tempProducts.filter(p => p.Category === filters.category);
        }
        if (filters.price) {
            const [min, max] = filters.price.split('-').map(Number);
            tempProducts = tempProducts.filter(p => p.Price >= min && p.Price < (max || Infinity));
        }
        if (filters.rating !== '0') {
            tempProducts = tempProducts.filter(p => p.rating && p.rating.average >= Number(filters.rating));
        }
        if (filters.ecoPoints) {
            const [min, max] = filters.ecoPoints.split('-').map(Number);
            tempProducts = tempProducts.filter(p => p.EcoPoints >= min && p.EcoPoints < (max || Infinity));
        }

        const [sortKey, sortOrder] = sortBy.split('-');
        tempProducts.sort((a, b) => {
            const valA = sortKey === 'title' ? a.Title : a.Price;
            const valB = sortKey === 'title' ? b.Title : b.Price;
            
            if (typeof valA === 'string') {
                return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            return sortOrder === 'asc' ? valA - valB : valB - valA;
        });

        setFilteredProducts(tempProducts);
        setCurrentPage(1);
    }, [filters, sortBy, allProducts]);
    
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div>Loading Shop...</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <main className="container mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
                <Sidebar filters={filters} setFilters={setFilters} categories={categories} />
                <div className="w-full">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-600">
                            Showing <span className="font-bold">{currentProducts.length}</span> of <span className="font-bold">{filteredProducts.length}</span> Products
                        </p>
                        <div className="flex items-center space-x-2">
                            <label htmlFor="sort" className="text-gray-600">Sort By</label>
                            <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 border rounded-md">
                                <option value="title-asc">Title (A-Z)</option>
                                <option value="title-desc">Title (Z-A)</option>
                                <option value="price-asc">Price (Low to High)</option>
                                <option value="price-desc">Price (High to Low)</option>
                            </select>
                        </div>
                    </div>
                    {currentProducts.length > 0 ? (
                        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {currentProducts.map(product => (
                                <ProductCard 
                                    key={product._id} 
                                    product={product} 
                                    wishlistItems={wishlist}
                                    refreshWishlist={fetchPageData}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 mt-12">No products match your filters.</p>
                    )}
                    <Pagination 
                        productsPerPage={productsPerPage}
                        totalProducts={filteredProducts.length}
                        paginate={paginate}
                        currentPage={currentPage}
                    />
                </div>
            </main>
        </div>
    );
}