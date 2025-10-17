import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import type { Order } from '../types';
import { Icon } from '../components/Icon';

const CheckoutPage: React.FC = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { addOrder } = useOrder();
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const orderData = {
        items: [...cartItems],
        total: getCartTotal(),
    };
    
    const orderNumber = `B${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create the new order object to be added to the account page
    const newOrder: Order = {
        id: orderNumber,
        // NOTE: For this demo, we'll group all items under one seller based on the first item's brand.
        sellerName: orderData.items[0]?.product.brand || 'NOKLITY',
        status: 'To ship', // New orders start with 'To ship' status
        items: orderData.items.map(cartItem => ({
            id: cartItem.product.id,
            name: cartItem.product.name,
            imageUrl: cartItem.product.imageUrl,
            // NOTE: Variant details are not tracked in the cart context in this demo.
            variant: `${cartItem.product.colors?.[0]?.name || ''}`,
            price: cartItem.product.price,
            quantity: cartItem.quantity,
        })),
    };

    // Add the new order to the global state
    addOrder(newOrder);

    // Clear the cart
    clearCart();

    // Navigate to the confirmation page with order data
    navigate('/order-confirmation', {
      state: {
        orderItems: orderData.items,
        total: orderData.total,
        orderNumber: orderNumber,
      },
      replace: true, // Replace checkout history so user can't go back
    });
  };

  if (cartItems.length === 0) {
    return (
        <div className="text-center py-10">
            <h2 className="text-2xl font-bold">Your cart is empty.</h2>
            <p className="text-gray-600 mt-2">You cannot proceed to checkout without items.</p>
            <Link to="/" className="text-noklity-red hover:underline mt-4 inline-block">Return to Shopping</Link>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" id="firstName" name="firstName" placeholder="John" className="p-2 border rounded-md w-full" required />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" id="lastName" name="lastName" placeholder="Doe" className="p-2 border rounded-md w-full" required />
              </div>
              <div className="col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" id="email" name="email" placeholder="you@example.com" className="p-2 border rounded-md w-full" required />
              </div>
              <div className="col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" id="address" name="address" placeholder="123 Main St" className="p-2 border rounded-md w-full" required />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" id="city" name="city" placeholder="Anytown" className="p-2 border rounded-md w-full" required />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input type="text" id="postalCode" name="postalCode" placeholder="12345" className="p-2 border rounded-md w-full" required />
              </div>
            </div>
          </div>
          
           <div>
              <h2 className="text-xl font-semibold mb-4">Choose Your Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* bKash */}
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedPaymentMethod === 'bkash' ? 'border-noklity-red bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                      <input type="radio" name="paymentMethod" value="bkash" checked={selectedPaymentMethod === 'bkash'} onChange={() => setSelectedPaymentMethod('bkash')} className="sr-only" />
                      <Icon name="bkash" className="h-6 w-auto text-noklity-red" />
                  </label>

                  {/* Nagad */}
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedPaymentMethod === 'nagad' ? 'border-noklity-red bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                      <input type="radio" name="paymentMethod" value="nagad" checked={selectedPaymentMethod === 'nagad'} onChange={() => setSelectedPaymentMethod('nagad')} className="sr-only" />
                      <Icon name="nagad" className="h-6 w-auto text-orange-500" />
                  </label>

                  {/* Bank Transfer */}
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedPaymentMethod === 'bank' ? 'border-noklity-red bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                      <input type="radio" name="paymentMethod" value="bank" checked={selectedPaymentMethod === 'bank'} onChange={() => setSelectedPaymentMethod('bank')} className="sr-only" />
                      <Icon name="bank" className="w-8 h-8 text-gray-600" />
                      <span className="ml-3 font-semibold text-gray-700">Bank Transfer</span>
                  </label>

                  {/* Cash on Delivery */}
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedPaymentMethod === 'cod' ? 'border-noklity-red bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                      <input type="radio" name="paymentMethod" value="cod" checked={selectedPaymentMethod === 'cod'} onChange={() => setSelectedPaymentMethod('cod')} className="sr-only" />
                      <Icon name="cash" className="w-8 h-8 text-gray-600" />
                      <span className="ml-3 font-semibold text-gray-700">Cash on Delivery</span>
                  </label>
              </div>

              {/* Details Panel */}
              <div className="p-4 bg-gray-50 rounded-lg min-h-[120px]">
                  {selectedPaymentMethod === 'bkash' && (
                      <p className="text-sm text-gray-700">You will be prompted to complete the payment via bKash after placing the order.</p>
                  )}
                  {selectedPaymentMethod === 'nagad' && (
                      <p className="text-sm text-gray-700">You will be prompted to complete the payment via Nagad after placing the order.</p>
                  )}
                  {selectedPaymentMethod === 'bank' && (
                    <div className="text-sm text-gray-700">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Transfer Details</h3>
                        <ul className="space-y-2 bg-white p-4 rounded-md border">
                            <li><span className="font-semibold text-gray-900">Bank Name:</span> City Bank</li>
                            <li><span className="font-semibold text-gray-900">Account Name:</span> NOKLITY</li>
                            <li><span className="font-semibold text-gray-900">Account Number:</span> 1234567890</li>
                        </ul>
                        <p className="mt-4 text-sm text-gray-600">Please use your <strong className="text-gray-800">Order ID</strong> as the payment reference.</p>
                    </div>
                  )}
                  {selectedPaymentMethod === 'cod' && (
                      <p className="text-sm text-gray-700">You will pay in cash when your order is delivered.</p>
                  )}
              </div>
            </div>

          <button type="submit" className="w-full bg-noklity-red text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-colors">
            Place Order
          </button>
        </form>
      </div>
      <div className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Your Order</h2>
        <div className="space-y-4 mb-6">
          {cartItems.map(item => (
            <div key={item.product.id} className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-cover rounded-md" />
                <div>
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p>৳{(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 space-y-2">
           <div className="flex justify-between">
              <span>Subtotal</span>
              <span>৳{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total</span>
              <span>৳{getCartTotal().toFixed(2)}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
