
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockOrders } from '../types';
import { Icon, IconName } from '../components/Icon';

type TrackingStatus = 'Processing' | 'Packed' | 'Shipped' | 'Delivered';

const TrackingPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const order = mockOrders.find(o => o.id === orderId);
    const [copied, setCopied] = useState(false);

    const trackingStatuses: { name: TrackingStatus; icon: IconName }[] = [
        { name: 'Processing', icon: 'processing' },
        { name: 'Packed', icon: 'packed' },
        { name: 'Shipped', icon: 'truck' },
        { name: 'Delivered', icon: 'delivered' },
    ];

    if (!order || !order.trackingHistory) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold dark:text-white">Tracking information not available</h2>
                <Link to="/account" className="text-noklity-red hover:underline mt-4 inline-block">Back to My Orders</Link>
            </div>
        );
    }

    const currentStatusIndex = trackingStatuses.findIndex(s => s.name === order.status);

    const handleCopy = () => {
        navigator.clipboard.writeText(`DEX-BDN-${orderId}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <header className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center transition-colors">
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Estimated Delivery By {order.estimatedDelivery}
                </h1>
            </header>

            <main className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-8 transition-colors">
                {/* Courier Info */}
                <section className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
                    <img src="https://i.ibb.co/7j6y2L5/courier-avatar.png" alt="Courier" className="w-16 h-16 rounded-full bg-gray-100 p-2" />
                    <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Courier Info</p>
                            <p className="font-medium text-gray-800 dark:text-white">Delivery Partner: {order.deliveryPartner}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Tracking Number</p>
                            <div className="flex items-center gap-2">
                                <p className="font-medium text-cyan-600 dark:text-cyan-400">DEX-BDN-{orderId}</p>
                                <button onClick={handleCopy} className="text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400 relative">
                                    <Icon name="copy" className="w-5 h-5" />
                                    {copied && <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded">Copied!</span>}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Progress Bar */}
                <section className="pt-4">
                    <div className="flex items-center">
                        {trackingStatuses.map((status, index) => {
                            const isActive = index <= currentStatusIndex;
                            return (
                                <React.Fragment key={status.name}>
                                    <div className="flex flex-col items-center text-center w-24">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? 'bg-gray-800 dark:bg-gray-700 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
                                            <Icon name={status.icon} className="w-6 h-6" />
                                        </div>
                                        <p className={`mt-2 text-sm font-medium ${isActive ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-500'}`}>{status.name}</p>
                                    </div>
                                    {index < trackingStatuses.length - 1 && (
                                        <div className={`flex-1 h-px ${index < currentStatusIndex ? 'bg-gray-800 dark:bg-gray-500' : 'bg-transparent border-t-2 border-gray-300 dark:border-gray-600 border-dashed'}`}></div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </section>

                {/* Timeline */}
                <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
                     <div className="relative pl-8">
                         {/* Vertical line */}
                         <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-600"></div>
                         
                         {order.trackingHistory.map((event, index) => (
                             <div key={index} className="relative mb-8">
                                 {/* Dot */}
                                 <div className={`absolute -left-5.5 top-1 w-4 h-4 rounded-full ${index === 0 ? 'bg-cyan-500 ring-4 ring-cyan-100 dark:ring-cyan-900' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                 <p className="text-sm text-gray-500 dark:text-gray-400">{event.timestamp}</p>
                                 <p className="font-semibold text-gray-800 dark:text-white mt-1">{event.status}</p>
                                 <p className="text-sm text-gray-600 dark:text-gray-300">{event.description}</p>
                             </div>
                         ))}
                     </div>
                </section>
            </main>
        </div>
    );
};

export default TrackingPage;
