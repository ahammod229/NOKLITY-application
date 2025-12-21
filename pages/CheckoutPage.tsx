
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import type { Order } from '../types';
import type { Address } from '../constants';
import { Icon } from '../components/Icon';
import { toast } from '../components/Toast';

const CheckoutPage: React.FC = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { addOrder } = useOrder();
  const { user, addAddress, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentFile, setPaymentFile] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: user?.email || '',
      phone: '',
      street: '',
      city: '',
      postalCode: '',
      isDefault: false
  });

  useEffect(() => {
      // If user has addresses, select default or first one
      if (user && user.addresses.length > 0) {
          const defaultAddr = user.addresses.find(a => a.isDefault);
          if (defaultAddr) setSelectedAddressId(defaultAddr.id);
          else setSelectedAddressId(user.addresses[0].id);
          setShowAddressForm(false);
      } else {
          setShowAddressForm(true);
      }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
      }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Address
    let shippingAddress: Address;

    if (showAddressForm) {
        if(!formData.firstName || !formData.phone || !formData.street) {
            toast.error("Please fill in required shipping details.");
            return;
        }
        
        shippingAddress = {
            id: 'temp-' + Date.now(),
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
            isDefault: formData.isDefault
        };

        // If logged in, save this address
        if (isAuthenticated) {
            addAddress(shippingAddress);
        }
    } else {
        const selected = user?.addresses.find(a => a.id === selectedAddressId);
        if (!selected) {
            toast.error("Please select a shipping address.");
            return;
        }
        shippingAddress = selected;
    }

    const orderData = {
        items: [...cartItems],
        total: getCartTotal(),
    };
    
    const orderNumber = `NOK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create the new order object
    const newOrder: Order = {
        id: orderNumber,
        sellerName: orderData.items[0]?.product.brand || 'NOKLITY Store',
        status: 'To ship',
        estimatedDelivery: '3-5 Business Days',
        deliveryPartner: 'NOKLITY Express',
        // In a real app, you'd store the full address object here
        customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        customerPhone: shippingAddress.phone,
        items: orderData.items.map(cartItem => ({
            id: cartItem.product.id,
            name: cartItem.product.name,
            imageUrl: cartItem.product.imageUrl,
            variant: `${cartItem.product.colors?.[0]?.name || 'Standard'}`,
            price: cartItem.product.price,
            quantity: cartItem.quantity,
        })),
        total: orderData.total,
        paymentMethod: selectedPaymentMethod,
        orderDate: new Date().toLocaleString(),
        paymentInfo: {
            method: selectedPaymentMethod === 'bank' ? 'Bank Transfer' : 
                    selectedPaymentMethod === 'cod' ? 'Cash on Delivery' : 
                    selectedPaymentMethod === 'bkash' ? 'bKash' : 'Nagad',
            status: selectedPaymentMethod === 'cod' ? 'Pending' : 'Paid',
            date: new Date().toLocaleDateString(),
            bankDetails: selectedPaymentMethod === 'bank' ? {
                bankName: 'City Bank',
                accountNumber: '123 456 7890',
                documentType: paymentFile ? 'Payment Proof' : undefined,
                documentImage: paymentFile || undefined
            } : undefined
        },
        billingAddress: {
            street: shippingAddress.street,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
            country: 'Bangladesh'
        }
    };

    addOrder(newOrder);
    clearCart();

    navigate('/order-confirmation', {
      state: {
        orderItems: orderData.items,
        total: orderData.total,
        orderNumber: orderNumber,
      },
      replace: true,
    });
  };

  if (cartItems.length === 0) {
    return (
        <div className="text-center py-10">
            <h2 className="text-2xl font-bold dark:text-white">Your cart is empty.</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">You cannot proceed to checkout without items.</p>
            <Link to="/" className="text-noklity-red hover:underline mt-4 inline-block">Return to Shopping</Link>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      <div>
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Checkout</h1>
        
        {/* Address Selection Section */}
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold dark:text-white">Shipping Address</h2>
                {isAuthenticated && user && user.addresses.length > 0 && !showAddressForm && (
                    <button 
                        type="button" 
                        onClick={() => setShowAddressForm(true)} 
                        className="text-sm text-noklity-red hover:underline font-medium"
                    >
                        + Add New Address
                    </button>
                )}
            </div>

            {/* Saved Addresses List */}
            {isAuthenticated && !showAddressForm && user && user.addresses.length > 0 && (
                <div className="space-y-3 mb-4">
                    {user.addresses.map(addr => (
                        <label key={addr.id} className={`block border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-noklity-red bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                            <div className="flex items-start">
                                <input 
                                    type="radio" 
                                    name="address" 
                                    className="mt-1 text-noklity-red focus:ring-noklity-red"
                                    checked={selectedAddressId === addr.id}
                                    onChange={() => setSelectedAddressId(addr.id)}
                                />
                                <div className="ml-3">
                                    <p className="font-semibold text-gray-900 dark:text-white">{addr.firstName} {addr.lastName} <span className="text-gray-500 font-normal">({addr.phone})</span></p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{addr.street}, {addr.city} - {addr.postalCode}</p>
                                    {addr.isDefault && <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded mt-2 inline-block">Default</span>}
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
            )}

            {/* Add New Address Form */}
            {showAddressForm && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="p-2 border dark:border-gray-600 rounded-md w-full dark:bg-gray-700 dark:text-white" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="p-2 border dark:border-gray-600 rounded-md w-full dark:bg-gray-700 dark:text-white" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="p-2 border dark:border-gray-600 rounded-md w-full dark:bg-gray-700 dark:text-white" required placeholder="017..." />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="p-2 border dark:border-gray-600 rounded-md w-full dark:bg-gray-700 dark:text-white" required />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address *</label>
                            <input type="text" name="street" value={formData.street} onChange={handleInputChange} className="p-2 border dark:border-gray-600 rounded-md w-full dark:bg-gray-700 dark:text-white" placeholder="House/Road/Area" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City *</label>
                            <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="p-2 border dark:border-gray-600 rounded-md w-full dark:bg-gray-700 dark:text-white" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postal Code</label>
                            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="p-2 border dark:border-gray-600 rounded-md w-full dark:bg-gray-700 dark:text-white" />
                        </div>
                        {isAuthenticated && (
                            <div className="col-span-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleInputChange} className="text-noklity-red focus:ring-noklity-red rounded" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Save as default address</span>
                                </label>
                            </div>
                        )}
                    </div>
                    {isAuthenticated && user && user.addresses.length > 0 && (
                        <button type="button" onClick={() => setShowAddressForm(false)} className="mt-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 underline">Cancel</button>
                    )}
                </div>
            )}
        </div>
          
        <form onSubmit={handlePlaceOrder}>
           <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* bKash */}
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedPaymentMethod === 'bkash' ? 'border-noklity-red bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'}`}>
                      <input type="radio" name="paymentMethod" value="bkash" checked={selectedPaymentMethod === 'bkash'} onChange={() => setSelectedPaymentMethod('bkash')} className="sr-only" />
                      <Icon name="bkash" className="h-8 w-auto text-noklity-red" />
                  </label>

                  {/* Nagad */}
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedPaymentMethod === 'nagad' ? 'border-noklity-red bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'}`}>
                      <input type="radio" name="paymentMethod" value="nagad" checked={selectedPaymentMethod === 'nagad'} onChange={() => setSelectedPaymentMethod('nagad')} className="sr-only" />
                      <Icon name="nagad" className="h-8 w-auto text-orange-500" />
                  </label>

                  {/* Bank Transfer */}
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedPaymentMethod === 'bank' ? 'border-noklity-red bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'}`}>
                      <input type="radio" name="paymentMethod" value="bank" checked={selectedPaymentMethod === 'bank'} onChange={() => setSelectedPaymentMethod('bank')} className="sr-only" />
                      <Icon name="bank" className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                      <span className="ml-3 font-semibold text-gray-700 dark:text-gray-200">Bank Transfer</span>
                  </label>

                  {/* Cash on Delivery */}
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedPaymentMethod === 'cod' ? 'border-noklity-red bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'}`}>
                      <input type="radio" name="paymentMethod" value="cod" checked={selectedPaymentMethod === 'cod'} onChange={() => setSelectedPaymentMethod('cod')} className="sr-only" />
                      <Icon name="cash" className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                      <span className="ml-3 font-semibold text-gray-700 dark:text-gray-200">Cash on Delivery</span>
                  </label>
              </div>

              {/* Dynamic Payment Details */}
              <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  {selectedPaymentMethod === 'bkash' && (
                      <p className="text-sm text-gray-700 dark:text-gray-300">You will be redirected to the bKash payment gateway to complete your secure transaction.</p>
                  )}
                  {selectedPaymentMethod === 'nagad' && (
                      <p className="text-sm text-gray-700 dark:text-gray-300">You will be redirected to the Nagad payment gateway to complete your secure transaction.</p>
                  )}
                  {selectedPaymentMethod === 'bank' && (
                    <div className="text-sm text-gray-700 dark:text-gray-300 animate-fade-in">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Bank Details</h3>
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-md border dark:border-gray-600 space-y-2">
                            <div className="flex justify-between border-b border-dashed dark:border-gray-500 pb-2">
                                <span className="font-medium">Bank Name:</span>
                                <span>City Bank</span>
                            </div>
                            <div className="flex justify-between border-b border-dashed dark:border-gray-500 pb-2">
                                <span className="font-medium">Account Name:</span>
                                <span>NOKLITY Enterprise</span>
                            </div>
                            <div className="flex justify-between border-b border-dashed dark:border-gray-500 pb-2">
                                <span className="font-medium">Account Number:</span>
                                <span className="font-mono tracking-wide">123 456 7890</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Branch:</span>
                                <span>Gulshan Branch</span>
                            </div>
                        </div>
                        
                        {/* New Upload Section */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Payment Proof (Optional)</label>
                            <input 
                                type="file" 
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-noklity-red file:text-white
                                hover:file:bg-red-700
                                dark:text-gray-400"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Upload screenshot or receipt of the transaction.</p>
                        </div>

                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs rounded border border-yellow-200 dark:border-yellow-800">
                            <strong>Note:</strong> Please use your Order ID (generated in next step) as the payment reference. Your order will be processed once funds are cleared.
                        </div>
                    </div>
                  )}
                  {selectedPaymentMethod === 'cod' && (
                      <p className="text-sm text-gray-700 dark:text-gray-300">Pay in cash when our delivery hero brings the package to your doorstep.</p>
                  )}
              </div>
            </div>

          <button type="submit" className="w-full bg-noklity-red text-white font-bold py-4 rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200 dark:shadow-none text-lg">
            Place Order
          </button>
        </form>
      </div>

      {/* Order Summary Side */}
      <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg h-fit sticky top-24 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Order Summary</h2>
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
          {cartItems.map(item => (
            <div key={item.product.id} className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-cover rounded-md bg-white border dark:border-gray-600" loading="lazy" decoding="async" />
                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{item.quantity}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm line-clamp-2 dark:text-white">{item.product.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Variant: {item.product.colors?.[0]?.name || 'Standard'}</p>
                </div>
              </div>
              <p className="font-medium text-gray-900 dark:text-gray-200">৳{(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
           <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Subtotal</span>
              <span>৳{getCartTotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Shipping Fee</span>
              <span>৳60</span>
            </div>
            <div className="flex justify-between font-bold text-xl pt-2 dark:text-white border-t border-gray-200 dark:border-gray-700 mt-2">
              <span>Total</span>
              <span className="text-noklity-red">৳{(getCartTotal() + 60).toLocaleString()}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
