
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg transition-colors duration-200">
      <h1 className="text-3xl font-bold mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 text-gray-900 dark:text-white">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400 text-lg">Your cart is empty.</p>
          <Link to="/" className="mt-4 inline-block bg-noklity-red text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.product.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-20 h-20 object-cover rounded-md bg-white" loading="lazy" decoding="async" />
                    <div>
                      <h2 className="font-semibold text-lg text-gray-800 dark:text-white">{item.product.name}</h2>
                      <p className="text-gray-500 dark:text-gray-400">৳{item.product.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                     <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                        min="1"
                        className="w-16 p-1 border border-gray-300 dark:border-gray-600 rounded-md text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    <p className="font-semibold w-24 text-right text-gray-800 dark:text-white">৳{(item.product.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Order Summary</h2>
            <div className="flex justify-between mb-2 text-gray-600 dark:text-gray-300">
              <span>Subtotal</span>
              <span>৳{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-600 dark:text-gray-300">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-600 pt-4 text-gray-900 dark:text-white">
              <span>Total</span>
              <span>৳{getCartTotal().toFixed(2)}</span>
            </div>
            <Link to="/checkout">
              <button className="mt-6 w-full bg-noklity-red text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-colors">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
