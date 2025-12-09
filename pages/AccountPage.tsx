

import React, { useState, useMemo } from 'react';
import { Icon } from '../components/Icon';
import { Link } from 'react-router-dom';
import type { Order } from '../types';
import { useOrder } from '../context/OrderContext';

const OrderStatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const baseClasses = "text-xs font-medium px-3 py-1 rounded-full";
  let statusClasses = "";

  switch (status) {
    case 'Shipped':
    case 'Cancelled':
      statusClasses = "bg-gray-200 text-gray-700";
      break;
    case 'Completed':
      statusClasses = "bg-gray-100 text-gray-600";
      break;
    case 'To Receive':
      statusClasses = "bg-blue-100 text-blue-700";
      break;
    case 'To Review':
       statusClasses = "bg-green-100 text-green-700";
      break;
    case 'To Pay':
       statusClasses = "bg-yellow-100 text-yellow-700";
       break;
    case 'To ship':
        statusClasses = "bg-orange-100 text-orange-700";
        break;
    default:
      statusClasses = "bg-gray-200 text-gray-800";
  }

  return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
};

const AccountPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const { orders } = useOrder();

    const tabCounts = useMemo(() => {
        const counts: Record<string, number> = {
            'To Pay': 0,
            'To ship': 0,
            'To Receive': 0,
            'To Review': 0,
        };
        orders.forEach(order => {
            if (order.status in counts) {
                counts[order.status as keyof typeof counts]++;
            }
        });
        return counts;
    }, [orders]);
    
    const tabs = ['All', 'To Pay', 'To ship', 'To Receive', 'To Review'];

    const filteredOrders = useMemo(() => {
        let currentOrders = orders;
        
        if (activeTab !== 'All') {
            currentOrders = currentOrders.filter(order => order.status === activeTab);
        }

        if (searchQuery.trim() !== '') {
            const lowercasedQuery = searchQuery.toLowerCase();
            currentOrders = currentOrders.filter(order => 
                order.sellerName.toLowerCase().includes(lowercasedQuery) ||
                order.id.toLowerCase().includes(lowercasedQuery) ||
                order.items.some(item => item.name.toLowerCase().includes(lowercasedQuery))
            );
        }

        return currentOrders;
    }, [activeTab, searchQuery, orders]);


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-gray-800">My Orders</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    {tabs.map(tabName => {
                        const isActive = activeTab === tabName;
                        const count = tabCounts[tabName as keyof typeof tabCounts];
                        const displayName = count > 0 ? `${tabName}(${count})` : tabName;
                        return (
                            <button
                                key={tabName}
                                onClick={() => setActiveTab(tabName)}
                                className={`whitespace-nowrap py-4 px-2 border-b-2 font-medium text-sm focus:outline-none ${
                                isActive
                                    ? 'border-cyan-500 text-cyan-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {displayName}
                            </button>
                        )
                    })}
                </nav>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon name="search" className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by seller name, order ID or product name"
                        className="block w-full bg-gray-50 border border-gray-200 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                </div>
            </div>

            {/* Order List */}
            <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <div key={order.id} className="relative bg-white rounded-md shadow-sm overflow-hidden hover:bg-gray-50 transition-colors duration-200">
                            {/* Card Content */}
                            <div className="p-4 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Icon name="store" className="w-5 h-5 text-gray-600" />
                                    <span className="font-semibold text-gray-800">{order.sellerName}</span>
                                </div>
                                <OrderStatusBadge status={order.status} />
                            </div>
                            {order.status === 'Shipped' && order.estimatedDelivery && order.deliveryPartner && (
                                <div className="px-4 pt-2 pb-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-500">
                                        Est. Delivery: <span className="font-medium text-gray-700">{order.estimatedDelivery}</span>
                                        <span className="mx-2 text-gray-300">|</span>
                                        Partner: <span className="font-medium text-gray-700">{order.deliveryPartner}</span>
                                    </p>
                                </div>
                            )}
                            {order.items.map(item => (
                                <div key={item.id} className="border-t border-gray-200 p-4">
                                    <div className="grid grid-cols-12 gap-4 items-center">
                                        <div className="col-span-12 sm:col-span-2">
                                            <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" loading="lazy" decoding="async"/>
                                        </div>
                                        <div className="col-span-12 sm:col-span-6">
                                          <Link to={`/product/${item.id}`} className="relative hover:underline">
                                            <p className="text-sm text-gray-800">{item.name}</p>
                                          </Link>
                                          <p className="text-xs text-gray-500 mt-1">{item.variant}</p>
                                        </div>
                                        <div className="col-span-6 sm:col-span-2 text-sm text-gray-700 text-left sm:text-center">
                                            ৳ {item.price.toLocaleString()}
                                        </div>
                                        <div className="col-span-6 sm:col-span-2 text-sm text-gray-500 text-right">
                                            Qty: {order.status === 'To Review' ?
                                              <Link to={`/review/${order.id}/${item.id}`} className="relative ml-4 inline-block bg-cyan-500 text-white font-semibold px-4 py-1.5 rounded-md text-xs hover:bg-cyan-600 transition-colors">Rate</Link>
                                              : `x${item.quantity}`
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))}
                             {/* Full-card overlay link */}
                            <Link to={`/order/${order.id}`} className="absolute inset-0" aria-label={`View details for order ${order.id}`}></Link>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-8 text-center rounded-md shadow-sm">
                        <p className="text-gray-500">No orders to display.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountPage;