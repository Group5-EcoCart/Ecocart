import React, { useState, useEffect, useCallback } from 'react';
import { getSellerOrders, updateOrderStatus } from '../../Service/Seller';
import toast from 'react-hot-toast';

const getStatusColor = (status) => {
    switch (status) {
        case 'Shipped': return 'bg-blue-100 text-blue-800';
        case 'Delivered': return 'bg-green-100 text-green-800';
        case 'Processing': return 'bg-yellow-100 text-yellow-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export default function SellerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingOrderId, setEditingOrderId] = useState(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getSellerOrders();
            setOrders(data.orders || []);
        } catch (error) {
            toast.error(error.message || "Failed to fetch orders.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    
    const promptForStatusUpdate = (orderId, newStatus) => {
        toast((t) => (
            <div className="flex flex-col items-center gap-2">
                <p className="font-semibold">Update status to "{newStatus}"?</p>
                <div className="flex gap-4">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                            handleStatusUpdate(orderId, newStatus);
                            toast.dismiss(t.id);
                        }}
                    >
                        Confirm
                    </button>
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                        onClick={() => {
                            setEditingOrderId(null); 
                            toast.dismiss(t.id);
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ));
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            toast.success("Order status updated!");
            fetchOrders();
        } catch (error) {
            toast.error(error.message || "Failed to update status.");
        } finally {
            setEditingOrderId(null); 
        }
    };
    
    const handleCancelOrder = (orderId) => {
        toast((t) => (
            <div className="flex flex-col items-center gap-2">
                <p className="font-semibold">Cancel this order?</p>
                <div className="flex gap-4">
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                            handleStatusUpdate(orderId, 'Cancelled');
                            toast.dismiss(t.id);
                        }}
                    >
                        Confirm
                    </button>
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Back
                    </button>
                </div>
            </div>
        ));
    };

    if (loading) return <div>Loading orders...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Orders</h2>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Product</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">CO2 Emission</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                           <React.Fragment key={order._id}>
                                {order.products.map((item, index) => (
                                    <tr key={item.product._id} className="border-b hover:bg-gray-50">
                                        {index === 0 && (
                                            <>
                                                <td className="p-4 text-gray-500" rowSpan={order.products.length}>#{order._id.slice(-6)}</td>
                                                <td className="p-4 font-semibold" rowSpan={order.products.length}>{order.user.email}</td>
                                            </>
                                        )}
                                        
                                        <td className="p-4">{item.product.Title}</td>

                                        {index === 0 && (
                                            <>
                                                <td className="p-4" rowSpan={order.products.length}>
                                                    {editingOrderId === order._id ? (
                                                        <select 
                                                            defaultValue={order.status} 
                                                            onChange={(e) => promptForStatusUpdate(order._id, e.target.value)}
                                                            autoFocus={true}
                                                            className="p-1 border rounded-md"
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Processing">Processing</option>
                                                            <option value="Shipped">Shipped</option>
                                                            <option value="Delivered">Delivered</option>
                                                            <option value="Cancelled">Cancelled</option>
                                                        </select>
                                                    ) : (
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="p-4" rowSpan={order.products.length}>
                                                    {order.products.reduce((acc, p) => acc + (p.product.CarbonFootPrint * p.quantity), 0).toFixed(2)}g
                                                </td>

                                                <td className="p-4 text-sm font-semibold space-y-1 align-top" rowSpan={order.products.length}>
                                                    <button 
                                                        onClick={() => setEditingOrderId(order._id)} 
                                                        disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                                                        className="text-blue-600 hover:underline block disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
                                                    >
                                                        Update
                                                    </button>
                                                    <button 
                                                        onClick={() => handleCancelOrder(order._id)} 
                                                        disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                                                        className="text-red-600 hover:underline block disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
                                                    >
                                                        Cancel
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                           </React.Fragment>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && <p className="text-center p-4">You have no orders yet.</p>}
            </div>
        </div>
    );
}