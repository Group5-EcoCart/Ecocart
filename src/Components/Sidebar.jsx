import React from 'react';

const FilterSection = ({ title, children }) => (
    <div className="py-4 border-b">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <div className="mt-2 space-y-2">
            {children}
        </div>
    </div>
);

export default function Sidebar({ filters, setFilters, categories }) {
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <aside className="w-full md:w-1/4 lg:w-1/5 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Filters</h2>
            
            <FilterSection title="Price">
                <select name="price" value={filters.price} onChange={handleFilterChange} className="w-full p-2 border rounded-md">
                    <option value="">Select a Price</option>
                    <option value="0-2500">Rs.0 - Rs.2500</option>
                    <option value="2500-5000">Rs.2500 - Rs.5000</option>
                    <option value="5000-10000">Rs.5000 - Rs.10000</option>
                    <option value="10000-Infinity">Over Rs.10000</option>
                </select>
            </FilterSection>

            <FilterSection title="Category">
                 <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full p-2 border rounded-md">
                    <option value="All">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </FilterSection>
            
            <FilterSection title="Rating">
                <select name="rating" value={filters.rating} onChange={handleFilterChange} className="w-full p-2 border rounded-md">
                    <option value="0">Any Rating</option>
                    <option value="4">4 Stars & Up</option>
                    <option value="3">3 Stars & Up</option>
                    <option value="2">2 Stars & Up</option>
                    <option value="1">1 Star & Up</option>
                </select>
            </FilterSection>

            <FilterSection title="EcoPoints">
                <select name="ecoPoints" value={filters.ecoPoints} onChange={handleFilterChange} className="w-full p-2 border rounded-md">
                    <option value="">Any EcoPoints</option>
                    <option value="0-100">0 - 100 EP</option>
                    <option value="100-500">100 - 500 EP</option>
                    <option value="500-1000">500 - 1000 EP</option>
                    <option value="1000-Infinity">Over 1000 EP</option>
                </select>
            </FilterSection>
        </aside>
    );
}