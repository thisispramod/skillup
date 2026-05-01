import React, { useState, useEffect } from 'react';
import api from '../../api';
import Swal from 'sweetalert2';
import { useNotification } from '../../context/NotificationContext';

const ManageStore = () => {
    const { showNotification } = useNotification();
    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('items'); // 'items' or 'orders'

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [itemsRes, ordersRes] = await Promise.all([
                api.get('/admin/store/items'),
                api.get('/admin/store/orders')
            ]);
            setItems(itemsRes.data);
            setOrders(ordersRes.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load store data');
            setLoading(false);
            showNotification('Failed to load store data', 'error');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !title || !price) {
            showNotification('Please fill required fields', 'error');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('file', file);

        try {
            await api.post('/admin/store/items', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setTitle('');
            setDescription('');
            setPrice('');
            setFile(null);
            showNotification('Product uploaded successfully', 'success');
            fetchData();
        } catch (err) {
            showNotification(err.response?.data?.message || 'Upload failed', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        // if (!window.confirm('Are you sure you want to delete this item?')) return;
        // try {
        //     await api.delete(`/admin/store/items/${id}`);
        //     showNotification('Item deleted', 'success');
        //     fetchData();
        // } catch (err) {
        //     showNotification('Failed to delete item', 'error');
        // } 
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/admin/store/items/${id}`);
                setItems(prev => prev.filter(t => t.id !== id));
                Swal.fire(
                    'Deleted!',
                    'Item has been deleted.',
                    'success'
                );
            } catch (err) {
                Swal.fire('Error', 'Failed to delete item.', 'error');
            }
        }
    };

    if (loading) {
        return <div className="p-8 text-center"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Store Management</h1>
                    <p className="text-slate-500 mt-1">Manage digital products and view orders.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl w-max shadow-inner">
                    <button
                        onClick={() => setActiveTab('items')}
                        className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${activeTab === 'items' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${activeTab === 'orders' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Orders
                    </button>
                </div>
            </div>

            {activeTab === 'items' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add New Item Form */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-max sticky top-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                                <span className="material-symbols-rounded text-[20px]">add</span>
                            </div>
                            Add New Product
                        </h2>
                        <form onSubmit={handleUpload} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Title *</label>
                                <input
                                    type="text" required value={title} onChange={e => setTitle(e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-slate-800 font-medium"
                                    placeholder="e.g. Physics Formula PDF"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <textarea
                                    value={description} onChange={e => setDescription(e.target.value)} rows="3"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-slate-800 font-medium"
                                    placeholder="Product details..."
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Price (₹) *</label>
                                <input
                                    type="number" required min="0" value={price} onChange={e => setPrice(e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-slate-800 font-medium text-lg"
                                    placeholder="99"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Upload File (PDF/ZIP) *</label>
                                <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors group ${file ? 'border-primary-400 bg-primary-50' : 'border-slate-300 hover:bg-slate-50'}`}>
                                    <input
                                        type="file" required onChange={e => setFile(e.target.files[0])}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <span className={`material-symbols-rounded text-4xl mb-2 ${file ? 'text-primary-600' : 'text-slate-400 group-hover:text-primary-500'}`}>
                                        {file ? 'draft' : 'upload_file'}
                                    </span>
                                    <p className={`text-sm font-bold ${file ? 'text-primary-700' : 'text-slate-600'}`}>
                                        {file ? file.name : 'Click or drag file to upload'}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="submit" disabled={uploading}
                                className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30 disabled:opacity-70 flex items-center justify-center gap-2 mt-6 text-lg"
                            >
                                {uploading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (
                                    <><span className="material-symbols-rounded">cloud_upload</span> Upload Product</>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Items List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="p-4 text-sm font-extrabold text-slate-600 uppercase tracking-wider">Product</th>
                                        <th className="p-4 text-sm font-extrabold text-slate-600 uppercase tracking-wider">Price</th>
                                        <th className="p-4 text-sm font-extrabold text-slate-600 uppercase tracking-wider">Added</th>
                                        <th className="p-4 text-sm font-extrabold text-slate-600 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-12 text-center text-slate-500">
                                                <span className="material-symbols-rounded text-5xl mb-3 block text-slate-300">inventory_2</span>
                                                <span className="font-bold">No products uploaded yet.</span>
                                            </td>
                                        </tr>
                                    ) : items.map(item => (
                                        <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                                            <td className="p-4">
                                                <div className="font-bold text-slate-800 text-lg mb-1">{item.title}</div>
                                                <div className="text-xs text-slate-500 truncate max-w-[200px] md:max-w-xs">{item.description}</div>
                                            </td>
                                            <td className="p-4 font-black text-emerald-600 text-lg">₹{item.price}</td>
                                            <td className="p-4 text-sm text-slate-500 font-medium">{new Date(item.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-50 group-hover:opacity-100"
                                                    title="Delete"
                                                >
                                                    <span className="material-symbols-rounded">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 text-sm font-extrabold text-slate-600 uppercase tracking-wider">Order ID / Date</th>
                                <th className="p-4 text-sm font-extrabold text-slate-600 uppercase tracking-wider">Customer Email</th>
                                <th className="p-4 text-sm font-extrabold text-slate-600 uppercase tracking-wider">Product</th>
                                <th className="p-4 text-sm font-extrabold text-slate-600 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-slate-500">
                                        <span className="material-symbols-rounded text-5xl mb-3 block text-slate-300">receipt_long</span>
                                        <span className="font-bold">No orders received yet.</span>
                                    </td>
                                </tr>
                            ) : orders.map(order => (
                                <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-sm">
                                        <div className="font-mono text-slate-500 text-xs mb-1 font-bold">#{order.id}</div>
                                        <div className="text-slate-800 font-medium">{new Date(order.createdAt).toLocaleString()}</div>
                                    </td>
                                    <td className="p-4 font-bold text-slate-700">{order.email}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{order.StoreItem?.title || 'Unknown Product'}</div>
                                        <div className="text-sm font-black text-emerald-600 mt-1">₹{order.StoreItem?.price || 0}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ${order.payment_status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            <span className="material-symbols-rounded text-[16px]">
                                                {order.payment_status === 'SUCCESS' ? 'check_circle' : 'pending'}
                                            </span>
                                            {order.payment_status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageStore;
