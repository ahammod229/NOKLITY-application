import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 border-b pb-4">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">Your cart is empty.</p>
          <Link to="/" className="mt-4 inline-block bg-noklity-red text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-20 h-20 object-cover rounded-md" />
                    <div>
                      <h2 className="font-semibold text-lg">{item.product.name}</h2>
                      <p className="text-gray-500">৳{item.product.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                     <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                        min="1"
                        className="w-16 p-1 border rounded-md text-center"
                      />
                    <p className="font-semibold w-24 text-right">৳{(item.product.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-gray-500 hover:text-red-600">
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>৳{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-4">
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
