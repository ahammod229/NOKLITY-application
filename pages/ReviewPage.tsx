import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockOrders } from '../types';
import { Icon, IconName } from '../components/Icon';
import StarRating from '../components/StarRating';
import ToggleSwitch from '../components/ToggleSwitch';
import { useReview } from '../context/ReviewContext';
import { toast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';

type SellerRating = 'Negative' | 'Neutral' | 'Positive' | null;

const ReviewPage: React.FC = () => {
    const { orderId, itemId } = useParams<{ orderId: string, itemId: string }>();
    const navigate = useNavigate();
    const { addReview } = useReview();
    const { user } = useAuth();
    const { orders } = useOrder();
    
    // Find order in global order context first, fall back to mockOrders if needed
    const order = orders.find(o => o.id === orderId) || mockOrders.find(o => o.id === orderId);
    const item = order?.items.find(i => i.id === Number(itemId));

    const [productRating, setProductRating] = useState(5);
    const [sellerRating, setSellerRating] = useState<SellerRating>('Positive');
    const [deliveryRating, setDeliveryRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    if (!order || !item) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold dark:text-white">Product not found in order</h2>
                <Link to="/account" className="text-noklity-red hover:underline mt-4 inline-block">Back to My Orders</Link>
            </div>
        );
    }

    const sellerRatingOptions: { name: SellerRating, icon: IconName, label: string }[] = [
        { name: 'Negative', icon: 'smiley-sad', label: 'Negative' },
        { name: 'Neutral', icon: 'smiley-neutral', label: 'Neutral' },
        { name: 'Positive', icon: 'smiley-positive', label: 'Positive' }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!comment.trim()) {
            toast.error('Please write a review comment.');
            return;
        }

        // Add the review to context (which saves to localStorage)
        addReview(Number(itemId), {
            rating: productRating,
            comment: comment,
            author: isAnonymous ? 'Anonymous' : (user?.name || 'Verified User'),
            date: new Date().toISOString(),
            verifiedPurchase: true,
            sellerRating: sellerRating || undefined,
            isAnonymous: isAnonymous,
            variantInfo: item.variant
        });

        toast.success('Review submitted successfully!');
        // Redirect to product page to see the review immediately
        navigate(`/product/${itemId}`);
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-colors duration-200">
            <header className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                <p className="text-lg text-gray-700 dark:text-gray-300">Delivered</p>
            </header>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column: Product Review */}
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Rate and review purchased product:</h2>
                    <div className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700/50">
                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-contain bg-white rounded-md" loading="lazy" decoding="async" />
                        <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-white">{item.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.variant}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <StarRating rating={productRating} onRatingChange={setProductRating} interactive size="h-8 w-8" />
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{['', 'Poor', 'Fair', 'Average', 'Good', 'Delightful'][productRating]}</span>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-between">
                            <span>Review detail</span>
                            <a href="#" className="text-cyan-600 dark:text-cyan-400 hover:underline">How to write a good review</a>
                        </label>
                        <textarea 
                            rows={4} 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="What do you think of this product?"
                            className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                            required
                        ></textarea>
                    </div>

                    <div>
                         <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md bg-white dark:bg-gray-700/30">
                            <div className="space-y-1 text-center">
                                <Icon name="camera" className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">Upload Photo</p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200">Important:</h3>
                        <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                            <li>Maximum 6 images can be uploaded</li>
                            <li>Image size can be maximum 5mb</li>
                            <li>It takes upto 24 hours for the image to be reviewed</li>
                            <li>Please ensure you meet these <a href="#" className="text-cyan-600 dark:text-cyan-400 underline">Community Guidelines</a> before uploading images</li>
                        </ul>
                    </div>
                </div>

                {/* Right Column: Seller & Delivery Review */}
                <div className="space-y-8 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-md border border-gray-100 dark:border-gray-700">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Sold by <Link to="#" className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">{order.sellerName}</Link></p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Rate and review your seller:</h3>
                        <div className="flex items-center gap-6">
                            {sellerRatingOptions.map(opt => (
                                <button key={opt.name} type="button" onClick={() => setSellerRating(opt.name)} className={`flex flex-col items-center gap-2 transition-transform duration-200 ${sellerRating === opt.name ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}>
                                    <Icon name={opt.icon} className={`w-10 h-10 ${sellerRating === opt.name ? (opt.name === 'Positive' ? 'text-yellow-500' : 'text-gray-700 dark:text-gray-200') : 'text-gray-400' }`} />
                                    <span className={`text-xs font-medium ${sellerRating === opt.name ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{opt.label}</span>
                                </button>
                            ))}
                        </div>
                         <textarea 
                            rows={3} 
                            placeholder="How is your overall experience with the seller ?"
                            className="mt-4 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                        ></textarea>
                    </div>

                     <div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Rate and review delivery service:</h3>
                        <StarRating rating={deliveryRating} onRatingChange={setDeliveryRating} interactive size="h-8 w-8" />
                         <textarea 
                            rows={3} 
                            placeholder="How is your overall delivery experience ?"
                            className="mt-4 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                        ></textarea>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex items-center justify-between">
                         <span className="text-sm text-gray-700 dark:text-gray-300">Review as {user?.name || 'Verified User'}</span>
                         <div className="flex items-center gap-2">
                            <ToggleSwitch checked={isAnonymous} onChange={setIsAnonymous} />
                            <span className={`text-sm font-semibold ${isAnonymous ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-500 dark:text-gray-400'}`}>Anonymous</span>
                         </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button type="submit" className="bg-noklity-red text-white font-semibold px-8 py-3 rounded-md hover:bg-red-700 transition-colors">
                    SUBMIT
                </button>
            </div>
        </form>
    );
};

export default ReviewPage;