
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockOrders } from '../types';
import { Icon } from '../components/Icon';

const OrderDetailPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const order = mockOrders.find(o => o.id === orderId);

    if (!order) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold dark:text-white">Order not found</h2>
                <Link to="/account" className="text-noklity-red hover:underline mt-4 inline-block">Back to My Orders</Link>
            </div>
        );
    }

    const orderItem = order.items[0];
    const shippingFee = 45;
    const total = orderItem.price + shippingFee;

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Order Details</h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200 border border-gray-100 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-white">
                                Standard Delivery | <span className="text-gray-600 dark:text-gray-400">DEX-BDN-0107022432</span>
                                <span className="font-bold text-lg text-gray-800 dark:text-white ml-4">৳ {total}</span>
                                <button className="ml-1 text-gray-400 hover:text-gray-600"><Icon name="info" className="w-4 h-4"/></button>
                            </p>
                            {order.estimatedDelivery && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Estimated Delivery: <span className="text-orange-500 font-medium">{order.estimatedDelivery}</span>
                                </p>
                            )}
                        </div>
                        <Link 
                          to={`/track/${order.id}`}
                          className="bg-cyan-500 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-cyan-600 transition-colors"
                        >
                            Track Package
                        </Link>
                    </div>
                </div>

                <div className="p-4 flex items-center gap-4">
                    <img src={orderItem.imageUrl} alt={orderItem.name} className="w-20 h-20 object-contain rounded-md bg-white border border-gray-200 dark:border-gray-600" loading="lazy" decoding="async" />
                    <div className="flex-grow">
                        <p className="text-sm text-gray-800 dark:text-white">{orderItem.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{orderItem.variant}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">No Warranty</p>
                    </div>
                    <div className="text-sm text-right">
                        <p className="text-gray-700 dark:text-gray-300">৳ {orderItem.price}</p>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Qty: {orderItem.quantity}</p>
                        <button className="text-cyan-600 dark:text-cyan-400 text-xs mt-2 flex items-center gap-1 ml-auto">
                            Cancel <Icon name="info" className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>

            {order.trackingHistory && order.trackingHistory.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Tracking History</h3>
                    <div className="relative pl-8">
                        {/* Vertical line */}
                        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-600"></div>
                        
                        {order.trackingHistory.map((event, index) => (
                            <div key={index} className="relative mb-8 last:mb-0">
                                {/* Dot */}
                                <div className={`absolute -left-7 top-1 w-4 h-4 rounded-full ${index === 0 ? 'bg-cyan-500 ring-4 ring-cyan-100 dark:ring-cyan-900' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{event.timestamp}</p>
                                <p className="font-semibold text-gray-800 dark:text-white mt-1">{event.status}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{event.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-xs text-gray-500 dark:text-gray-400 space-y-1 border border-gray-100 dark:border-gray-700 transition-colors">
                <p>Order <span className="text-cyan-600 dark:text-cyan-400 font-medium">#{order.id}</span></p>
                <p>Placed on 12 Oct 2025 17:14:10</p>
                <p>Paid on 12 Oct 2025 17:15:59</p>
                <p>Paid by Save bKash Account</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-xs border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="font-bold text-sm mb-2 text-gray-800 dark:text-white">AHAMMOD ALI</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        3100, Mirapara, House No- A/2, Rahman Tower, Ground Floor, Naiorpool, Beside Osmani Jadughor, Sylhet-3100, , Bangladesh, 3100
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">1713812668</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-xs border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="font-bold text-sm mb-3 text-gray-800 dark:text-white">Total Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-gray-600 dark:text-gray-300">
                            <span>Subtotal({orderItem.quantity} Item)</span>
                            <span>৳ {orderItem.price}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-300">
                            <span>Shipping Fee</span>
                            <span>৳ {shippingFee}</span>
                        </div>
                        <div className="flex justify-between font-bold text-sm text-gray-800 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                            <span>Total</span>
                            <span>৳ {total}</span>
                        </div>
                    </div>
                     <p className="text-gray-500 dark:text-gray-400 mt-2 text-right">Paid by bKash Online Payment</p>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
