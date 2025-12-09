

import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import type { CartItem } from '../constants';

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const { orderItems, total, orderNumber } = (location.state as { 
    orderItems: CartItem[]; 
    total: number; 
    orderNumber: string; 
  }) || {};

  // If the page is accessed directly without order data, redirect to the homepage
  if (!orderItems || orderItems.length === 0) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <div className="bg-green-100 rounded-full p-4 mb-6">
        <Icon name="check-circle" className="w-12 h-12 text-green-500" />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-3">Thank you for your purchase</h1>
      <p className="text-gray-600 mb-1">We've received your order will ship in 5-7 business days.</p>
      <p className="text-gray-600 mb-8">Your order number is <span className="font-semibold text-gray-800">#{orderNumber}</span></p>

      <div className="bg-white border border-gray-200 rounded-lg shadow-md w-full max-w-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-left mb-4">Order Summary</h2>
        <div className="space-y-4">
          {orderItems.map(item => (
            <div key={item.product.id} className="flex justify-between items-center text-left">
              <div className="flex items-center space-x-4">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-cover rounded-md border" loading="lazy" decoding="async" />
                <div>
                  <p className="font-medium text-gray-800">{item.product.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold text-gray-800">৳{item.product.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>৳{total.toLocaleString()}</span>
        </div>
      </div>

      <Link
        to="/"
        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default OrderConfirmationPage;