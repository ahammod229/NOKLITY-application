import React, { useState, useMemo, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { Link, useNavigate } from 'react-router-dom';
import type { Order } from '../types';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import ToggleSwitch from '../components/ToggleSwitch';

const OrderStatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const baseClasses = "text-xs font-medium px-3 py-1 rounded-full";
  let statusClasses = "";

  switch (status) {
    case 'Shipped':
    case 'Cancelled':
      statusClasses = "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
      break;
    case 'Completed':
      statusClasses = "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
      break;
    case 'Delivered':
        statusClasses = "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300";
        break;
    case 'To Receive':
      statusClasses = "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      break;
    case 'To Review':
       statusClasses = "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      break;
    case 'To Pay':
       statusClasses = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
       break;
    case 'To ship':
        statusClasses = "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
        break;
    default:
      statusClasses = "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }

  return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
};

const AccountPage: React.FC = () => {
    const { user, logout, updateProfile, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const { orders } = useOrder();

    // Profile Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editDob, setEditDob] = useState('');
    const [editPhoto, setEditPhoto] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (user) {
            setEditName(user.name || '');
            setEditEmail(user.email || '');
            setEditPhone(user.phoneNumber || '');
            setEditDob(user.dateOfBirth || '');
            setEditPhoto(user.photoUrl || '');
        }
    }, [isAuthenticated, user, navigate]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setEditPhoto(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile({
            name: editName,
            email: editEmail,
            phoneNumber: editPhone,
            dateOfBirth: editDob,
            photoUrl: editPhoto
        });
        setIsEditing(false);
        toast.success("Profile updated successfully!");
    };

    const handleThemeToggle = (isDark: boolean) => {
        updateProfile({ themePreference: isDark ? 'dark' : 'light' });
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast.show("Logged out successfully");
    };

    const tabCounts = useMemo(() => {
        const counts: Record<string, number> = {
            'To Pay': 0,
            'To ship': 0,
            'To Receive': 0,
            'To Review': 0,
        };
        orders.forEach(order => {
            if (order.status === 'To Pay') counts['To Pay']++;
            if (order.status === 'To ship') counts['To ship']++;
            if (order.status === 'Shipped') counts['To Receive']++;
            if (['Delivered', 'Completed', 'To Review'].includes(order.status)) counts['To Review']++;
        });
        return counts;
    }, [orders]);
    
    const tabs = ['All', 'To Pay', 'To ship', 'To Receive', 'To Review'];

    const filteredOrders = useMemo(() => {
        let currentOrders = orders;
        
        if (activeTab !== 'All') {
            if (activeTab === 'To Pay') {
                currentOrders = currentOrders.filter(order => order.status === 'To Pay');
            } else if (activeTab === 'To ship') {
                currentOrders = currentOrders.filter(order => order.status === 'To ship');
            } else if (activeTab === 'To Receive') {
                currentOrders = currentOrders.filter(order => order.status === 'Shipped');
            } else if (activeTab === 'To Review') {
                currentOrders = currentOrders.filter(order => ['Delivered', 'Completed', 'To Review'].includes(order.status));
            } else {
                currentOrders = currentOrders.filter(order => order.status === activeTab);
            }
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

    if (!user) return null;

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20 dark:text-white">
            {/* Profile Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-start gap-6 transition-colors">
               <div className="flex-1 w-full">
                   {isEditing ? (
                       <form onSubmit={handleSaveProfile} className="flex flex-col md:flex-row gap-8 w-full">
                           <div className="flex flex-col items-center gap-3">
                               <div className="relative h-28 w-28">
                                   {editPhoto ? (
                                       <img src={editPhoto} alt="Profile" className="h-full w-full rounded-full object-cover border-4 border-gray-100 dark:border-gray-600 shadow-sm" />
                                   ) : (
                                       <div className="h-full w-full bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-4xl font-bold text-gray-400 dark:text-gray-500 border-4 border-white dark:border-gray-600 shadow-sm">
                                           {user.name.charAt(0).toUpperCase()}
                                       </div>
                                   )}
                                   <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-500">
                                       <Icon name="camera" className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                       <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                                   </label>
                               </div>
                               <p className="text-xs text-gray-500 dark:text-gray-400">Click icon to change</p>
                           </div>

                           <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                   <label className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-1">Full Name</label>
                                   <input 
                                       type="text" value={editName} onChange={e => setEditName(e.target.value)} 
                                       className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 rounded-lg text-sm w-full focus:ring-2 focus:ring-cyan-500 outline-none transition-colors" placeholder="Full Name" required
                                   />
                               </div>
                               <div>
                                   <label className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-1">Email Address</label>
                                   <input 
                                       type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} 
                                       className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 rounded-lg text-sm w-full focus:ring-2 focus:ring-cyan-500 outline-none transition-colors" placeholder="Email" required
                                   />
                               </div>
                               <div>
                                   <label className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-1">Phone Number</label>
                                   <input 
                                       type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} 
                                       className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 rounded-lg text-sm w-full focus:ring-2 focus:ring-cyan-500 outline-none transition-colors" placeholder="+880..." 
                                   />
                               </div>
                               <div>
                                   <label className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-1">Date of Birth</label>
                                   <input 
                                       type="date" value={editDob} onChange={e => setEditDob(e.target.value)} 
                                       className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 rounded-lg text-sm w-full focus:ring-2 focus:ring-cyan-500 outline-none transition-colors"
                                   />
                               </div>
                               <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                                   <button type="button" onClick={() => setIsEditing(false)} className="text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-2.5 rounded-lg transition-colors font-medium">Cancel</button>
                                   <button type="submit" className="text-sm bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg transition-colors shadow-md font-medium">Save Changes</button>
                               </div>
                           </div>
                       </form>
                   ) : (
                       <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full">
                           <div className="h-24 w-24 flex-shrink-0">
                               {user.photoUrl ? (
                                   <img src={user.photoUrl} alt="Profile" className="h-full w-full rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md" />
                               ) : (
                                   <div className="h-full w-full bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-4xl font-bold text-gray-500 dark:text-gray-400 border-4 border-white dark:border-gray-700 shadow-md">
                                       {user.name.charAt(0).toUpperCase()}
                                   </div>
                               )}
                           </div>
                           
                           <div className="flex-1 text-center md:text-left space-y-2">
                               <div>
                                   <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{user.name}</h1>
                                   <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                                   {(user.phoneNumber || user.dateOfBirth) && (
                                       <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                           {user.phoneNumber && <span>📞 {user.phoneNumber}</span>}
                                           {user.dateOfBirth && <span>🎂 {user.dateOfBirth}</span>}
                                       </div>
                                   )}
                               </div>
                               <div className="flex justify-center md:justify-start gap-2 mt-2">
                                   <span className="text-xs text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full flex items-center gap-1 border border-green-100 dark:border-green-800">
                                       <Icon name="verified" className="w-3 h-3"/> Verified
                                   </span>
                                   <span className="text-xs text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                                       Member
                                   </span>
                               </div>
                           </div>

                           <div className="flex flex-col gap-3 w-full md:w-auto min-w-[160px]">
                               <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                       <Icon name="eye" className="w-4 h-4"/> 
                                       Dark Mode
                                   </span>
                                   <ToggleSwitch checked={user.themePreference === 'dark'} onChange={handleThemeToggle} />
                               </div>
                               <button onClick={() => setIsEditing(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm bg-white dark:bg-gray-800">
                                   <Icon name="gear" className="w-4 h-4 text-gray-500 dark:text-gray-400"/> Edit Profile
                               </button>
                               <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-all shadow-sm">
                                   Logout
                               </button>
                           </div>
                       </div>
                   )}
               </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Orders</h2>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                        {tabs.map(tabName => {
                            const isActive = activeTab === tabName;
                            const count = tabCounts[tabName as keyof typeof tabCounts];
                            const displayName = count > 0 ? `${tabName} (${count})` : tabName;
                            return (
                                <button
                                    key={tabName}
                                    onClick={() => setActiveTab(tabName)}
                                    className={`whitespace-nowrap py-4 px-2 border-b-2 font-medium text-sm focus:outline-none transition-colors ${
                                    isActive
                                        ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
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
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon name="search" className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by seller name, order ID or product name"
                            className="block w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 pl-10 pr-3 text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white dark:focus:bg-gray-600 transition-all"
                        />
                    </div>
                </div>

                {/* Order List */}
                <div className="space-y-4">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                            <div key={order.id} className="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200 group">
                                {/* Card Content */}
                                <div className="p-4 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                                            <Icon name="store" className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                        </div>
                                        <span className="font-semibold text-gray-800 dark:text-white text-sm">{order.sellerName}</span>
                                        <Icon name="chevronRight" className="w-3 h-3 text-gray-400" />
                                    </div>
                                    <OrderStatusBadge status={order.status} />
                                </div>
                                {order.status === 'Shipped' && order.estimatedDelivery && order.deliveryPartner && (
                                    <div className="px-4 py-2 bg-orange-50/50 dark:bg-orange-900/20 border-b border-orange-100 dark:border-orange-900/30 flex items-center gap-2">
                                        <Icon name="truck" className="w-4 h-4 text-orange-500" />
                                        <p className="text-xs text-gray-600 dark:text-gray-300">
                                            Est. Delivery: <span className="font-semibold text-gray-800 dark:text-white">{order.estimatedDelivery}</span>
                                        </p>
                                    </div>
                                )}
                                {order.items.map(item => (
                                    <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-3 sm:col-span-2 md:col-span-1">
                                                <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" loading="lazy" decoding="async"/>
                                                </div>
                                            </div>
                                            <div className="col-span-9 sm:col-span-6 md:col-span-7">
                                            <Link to={`/product/${item.id}`} className="relative hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors z-10">
                                                <p className="text-sm font-medium text-gray-800 dark:text-white line-clamp-2">{item.name}</p>
                                            </Link>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.variant}</p>
                                            </div>
                                            <div className="col-span-6 sm:col-span-2 text-sm font-medium text-gray-800 dark:text-white text-left sm:text-center mt-2 sm:mt-0">
                                                ৳ {item.price.toLocaleString()}
                                            </div>
                                            <div className="col-span-6 sm:col-span-2 text-sm text-gray-500 dark:text-gray-400 text-right mt-2 sm:mt-0">
                                                Qty: { ['Delivered', 'Completed', 'To Review'].includes(order.status) ?
                                                <Link to={`/review/${order.id}/${item.id}`} className="relative ml-auto inline-flex items-center justify-center bg-cyan-600 text-white font-medium px-4 py-1.5 rounded-full text-xs hover:bg-cyan-700 transition-colors shadow-sm z-10">Rate Product</Link>
                                                : `x${item.quantity}`
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/* Full-card overlay link for details */}
                                <Link to={`/order/${order.id}`} className="absolute inset-0 z-0" aria-label={`View details for order ${order.id}`}></Link>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white dark:bg-gray-800 p-12 text-center rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon name="shoppingBag" className="w-8 h-8 text-gray-300 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No orders found</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Looks like you haven't placed any orders yet.</p>
                            <Link to="/" className="mt-6 inline-block bg-noklity-red text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm">
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountPage;