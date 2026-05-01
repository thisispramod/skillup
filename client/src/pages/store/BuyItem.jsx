import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { useNotification } from '../../context/NotificationContext';

const BuyItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: Payment, 3: Success
    const [orderId, setOrderId] = useState(null);
    const [rzpOrder, setRzpOrder] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [downloadToken, setDownloadToken] = useState(null);

    useEffect(() => {
        // Load Razorpay Script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        fetchItem();

        return () => {
            document.body.removeChild(script);
        };
    }, [id]);

    const fetchItem = async () => {
        try {
            const res = await api.get(`/store/items/${id}`);
            setItem(res.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load item details');
            setLoading(false);
        }
    };

    const handleContinueToPayment = async (e) => {
        e.preventDefault();
        if (!email.includes('@')) {
            setError('Please enter a valid email address');
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        setError('');
        setProcessing(true);
        try {
            const res = await api.post('/store/orders', { item_id: id, email });
            setOrderId(res.data.order.id);
            setRzpOrder(res.data.rzpOrder);
            setStep(2);
            
            openRazorpayPopup(res.data.rzpOrder);
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Failed to create order';
            setError(errMsg);
            showNotification(errMsg, 'error');
        } finally {
            setProcessing(false);
        }
    };

    const openRazorpayPopup = (orderData = rzpOrder) => {
        if (!orderData || !window.Razorpay) return;
        
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_12345', 
            amount: orderData.amount,
            currency: orderData.currency,
            name: "SkillUp Store",
            description: item.title,
            order_id: orderData.id,
            handler: async function (response) {
                await handleVerifyPayment(response);
            },
            prefill: {
                email: email,
            },
            theme: {
                color: "#0ea5e9"
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
            showNotification("Payment Failed. Please try again.", "error");
        });
        rzp.open();
    };

    const handleVerifyPayment = async (rzpResponse) => {
        setProcessing(true);
        setError('');
        try {
            const res = await api.post(`/store/verify`, {
                razorpay_order_id: rzpResponse.razorpay_order_id,
                razorpay_payment_id: rzpResponse.razorpay_payment_id,
                razorpay_signature: rzpResponse.razorpay_signature
            });
            if (res.data && res.data.order && res.data.order.download_token) {
                setDownloadToken(res.data.order.download_token);
            }
            setStep(3);
            showNotification('Payment successful! Check your email.', 'success');
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Payment verification failed';
            setError(errMsg);
            showNotification(errMsg, 'error');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!item) {
        return <div className="text-center p-10 text-red-500 font-bold">Item not found</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                
                {/* Left Side: Product Info */}
                <div className="md:w-5/12 bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-white opacity-10"></div>
                    
                    <div className="relative z-10">
                        <span className="material-symbols-rounded text-5xl mb-6 opacity-80">picture_as_pdf</span>
                        <h2 className="text-3xl font-extrabold mb-4 leading-tight">{item.title}</h2>
                        <p className="text-primary-100 mb-8 line-clamp-4 leading-relaxed">
                            {item.description}
                        </p>
                        <div className="mt-auto">
                            <span className="block text-primary-200 text-sm uppercase tracking-wider mb-1 font-semibold">Total Price</span>
                            <span className="text-4xl font-black">₹{item.price}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Action Area */}
                <div className="md:w-7/12 p-8 md:p-12 relative">
                    {/* Stepper */}
                    <div className="flex items-center justify-center mb-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? 'bg-primary-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>1</div>
                        <div className={`w-16 h-1 transition-colors ${step >= 2 ? 'bg-primary-600' : 'bg-slate-200'}`}></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? 'bg-primary-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>2</div>
                        <div className={`w-16 h-1 transition-colors ${step >= 3 ? 'bg-primary-600' : 'bg-slate-200'}`}></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 3 ? 'bg-primary-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>3</div>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3 animate-pulse">
                            <span className="material-symbols-rounded">error</span>
                            <span className="font-medium text-sm">{error}</span>
                        </div>
                    )}

                    {step === 1 && (
                        <form onSubmit={handleContinueToPayment} className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Where should we send it?</h3>
                                <p className="text-slate-500 mb-8">Enter your email address to receive the download link after payment.</p>
                                
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>Continue to Payment <span className="material-symbols-rounded">arrow_forward</span></>
                                )}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <div className="text-center animate-fade-in">
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Complete Payment</h3>
                            <p className="text-slate-500 mb-8">Pay securely via Razorpay to get instant access to <strong className="text-slate-800 text-xl font-black">₹{item.price}</strong></p>
                            
                            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 inline-block mb-8 text-center w-full max-w-sm">
                                <span className="material-symbols-rounded text-6xl text-primary-500 mb-4 block">credit_card</span>
                                <h4 className="text-lg font-bold text-slate-700 mb-2">Secure Checkout</h4>
                                <p className="text-sm text-slate-500">We accept UPI, Cards, and Netbanking</p>
                            </div>

                            <button
                                onClick={() => openRazorpayPopup()}
                                disabled={processing}
                                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-70"
                            >
                                {processing ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span className="material-symbols-rounded">lock</span>
                                        Pay with Razorpay
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center animate-fade-in py-10">
                            <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner transform scale-110 transition-transform duration-500">
                                <span className="material-symbols-rounded text-5xl animate-bounce">check_circle</span>
                            </div>
                            <h3 className="text-3xl font-extrabold text-slate-800 mb-4">Payment Successful!</h3>
                            <p className="text-slate-600 mb-8 max-w-sm mx-auto text-lg">
                                We've sent a secure download link to <br/><strong className="text-slate-800">{email}</strong><br/><span className="text-sm">Please check your inbox (and spam folder).</span>
                            </p>
                            <div className="flex flex-col gap-4 items-center justify-center">
                                {downloadToken && (
                                    <a
                                        href={`${api.defaults.baseURL.replace(/\/api$/, '')}/api/store/download/${downloadToken}`}
                                        className="w-full max-w-xs bg-emerald-600 text-white py-3 px-8 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-rounded">download</span>
                                        Download File Now
                                    </a>
                                )}
                                <button
                                    onClick={() => navigate('/store')}
                                    className="w-full max-w-xs bg-slate-100 text-slate-700 py-3 px-8 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-sm"
                                >
                                    Return to Store
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuyItem;
