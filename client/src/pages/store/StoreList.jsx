import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const StoreList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await api.get('/store/items');
            setItems(res.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load store items');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 lg:p-10 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        SkillUp <span className="text-primary-600">Store</span>
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Premium digital resources and study materials to accelerate your learning journey.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded shadow-sm">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {items.length === 0 && !error ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <span className="material-symbols-rounded text-6xl text-slate-300 mb-4 block">inventory_2</span>
                        <h3 className="text-xl font-bold text-slate-700">Store is Empty</h3>
                        <p className="text-slate-500 mt-2">Check back later for new study materials!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map(item => (
                            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                                <div className="flex-1">
                                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-6 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                                        <span className="material-symbols-rounded text-2xl">description</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">{item.title}</h3>
                                    <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                                <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Price</span>
                                        <span className="text-2xl font-black text-slate-900">₹{item.price}</span>
                                    </div>
                                    <Link
                                        to={`/store/buy/${item.id}`}
                                        className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-700 active:scale-95 transition-all shadow-md shadow-primary-500/30 flex items-center gap-2"
                                    >
                                        Buy Now
                                        <span className="material-symbols-rounded text-sm">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoreList;
