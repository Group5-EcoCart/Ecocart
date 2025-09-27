import React, { useState, useEffect, useCallback } from 'react';
import { getSellerAnalytics } from '../../Service/Seller';
import toast from 'react-hot-toast';

export default function SellerAnalytics() {
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getSellerAnalytics();
            setAnalytics(data);
        } catch (error) {
            toast.error(error.message || "Failed to fetch analytics.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (loading) return <div>Loading Analytics...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Product Analytics</h2>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-4">Product</th>
                            <th className="p-4">Units Sold</th>
                            <th className="p-4">Total EcoPoints</th>
                            <th className="p-4">Total CO2 Emission</th>
                            <th className="p-4">Avg. Rating</th>
                            <th className="p-4">Reviews</th>
                        </tr>
                    </thead>
                    <tbody>
                        {analytics.map(product => (
                            <tr key={product._id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-semibold">{product.Title}</td>
                                <td className="p-4">{product.unitsSold || 0}</td>
                                <td className="p-4">{(product.totalEcoPoints || 0)} EP</td>
                                <td className="p-4">{(product.totalCarbon || 0).toFixed(2)}g</td>
                                <td className="p-4">{(product.rating?.average || 0).toFixed(1)} / 5</td>
                                <td className="p-4">{product.rating?.count || 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {analytics.length === 0 && <p className="text-center p-4">No sales data available yet.</p>}
            </div>
        </div>
    );
}