import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import StarRating from '../components/StarRating';
import { Icon } from '../components/Icon';
import ProductReviews from '../components/ProductReviews';
import { useReview } from '../context/ReviewContext';
import WriteReviewModal from '../components/WriteReviewModal';
import { toast } from '../components/Toast';
import type { Product } from '../constants';


const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { getReviewsForProduct, addReview } = useReview();

  const initialProduct = PRODUCTS.find(p => p.id === parseInt(productId || ''));
  const [product, setProduct] = useState<Product | undefined>(initialProduct);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product?.imageUrl);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);

  const isWishlisted = product ? isInWishlist(product.id) : false;
  const imageList = product?.images && product.images.length > 0 ? product.images : [product?.imageUrl || ''];
  const productReviews = product ? getReviewsForProduct(product.id) : [];
  
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const foundProduct = PRODUCTS.find(p => p.id === parseInt(productId || ''));
    setProduct(foundProduct);

    if (foundProduct) {
      setSelectedImage(foundProduct.imageUrl);
      setSelectedColor(foundProduct.colors?.[0]?.name);
      setSelectedSize(null);
      setQuantity(1);
    }
  }, [productId]);

  if (!product) {
    return (
       <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link to="/" className="text-noklity-red hover:underline mt-4 inline-block">Go back to Home</Link>
      </div>
    );
  }
  
  const category = CATEGORIES.find(c => c.id === product.categoryId);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.show(`${quantity} x ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    toast.show(`${quantity} x ${product.name} added to cart!`);
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.show('Removed from wishlist');
    } else {
      addToWishlist(product.id);
      toast.show('Added to wishlist!');
    }
  };

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailsRef.current) {
        const scrollAmount = direction === 'left' ? -100 : 100;
        thumbnailsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleReviewSubmit = (reviewData: {
    rating: number;
    comment: string;
    sellerRating: 'Positive' | 'Neutral' | 'Negative' | null;
    isAnonymous: boolean;
  }) => {
    if (!product) return;

    addReview(product.id, {
      ...reviewData,
      sellerRating: reviewData.sellerRating || undefined,
      author: reviewData.isAnonymous ? 'Anonymous' : 'New User',
      date: new Date().toISOString(),
      verifiedPurchase: true,
    });

    // Update the local product data state to make the summary reactive
    setProduct(prevProduct => {
      if (!prevProduct?.rating?.breakdown) return prevProduct;
      
      const newRating = reviewData.rating;
      const ratingKey = String(Math.round(newRating)) as keyof typeof prevProduct.rating.breakdown;

      const newBreakdown = {
        ...prevProduct.rating.breakdown,
        [ratingKey]: (prevProduct.rating.breakdown[ratingKey] || 0) + 1,
      };

      const newCount = prevProduct.rating.count + 1;
      
      const totalStars = Object.entries(newBreakdown).reduce(
          (sum, [star, count]) => sum + parseInt(star, 10) * count, 0
      );
      
      const newStars = totalStars / newCount;

      return {
        ...prevProduct,
        rating: {
          ...prevProduct.rating,
          count: newCount,
          stars: newStars,
          breakdown: newBreakdown,
        },
      };
    });

    setReviewModalOpen(false);
    toast.show('Thank you for your review!');
  };


  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <nav className="text-sm mb-4" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <Icon name="chevronRight" className="h-4 w-4 mx-2 text-gray-400" />
            </li>
            {category && (
              <li className="flex items-center">
                <Link to={`/category/${category.id}`} className="text-gray-500 hover:text-gray-700">{category.name}</Link>
                <Icon name="chevronRight" className="h-4 w-4 mx-2 text-gray-400" />
              </li>
            )}
            <li>
              <span className="text-gray-700 font-medium">{product.name}</span>
            </li>
          </ol>
        </nav>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-4">
              <img src={selectedImage} alt={product.name} className="max-w-full max-h-full object-contain" />
            </div>
            <div className="relative flex items-center">
              <button onClick={() => scrollThumbnails('left')} className="p-1 text-gray-500 hover:text-gray-800" aria-label="Scroll left">
                  <Icon name="chevronLeft" className="w-6 h-6"/>
              </button>
              <div ref={thumbnailsRef} className="flex-1 flex space-x-2 overflow-x-auto scrollbar-hide">
                {imageList.map((img, index) => (
                  <div 
                    key={index} 
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 flex-shrink-0 cursor-pointer rounded border-2 p-1 ${selectedImage === img ? 'border-orange-500' : 'border-gray-200'}`}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
              <button onClick={() => scrollThumbnails('right')} className="p-1 text-gray-500 hover:text-gray-800" aria-label="Scroll right">
                  <Icon name="chevronRight" className="w-6 h-6"/>
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-2xl font-semibold my-2">{product.name}</h1>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                {product.rating && <StarRating rating={product.rating.stars} />}
                {product.rating && <a href="#reviews" className="text-blue-600 hover:underline">{product.rating.count} Ratings</a>}
                {product.answeredQuestions && <a href="#qa" className="text-blue-600 hover:underline">{product.answeredQuestions} Answered Questions</a>}
              </div>
              <div className="flex items-center gap-4">
                <button onClick={handleWishlistToggle} className={isWishlisted ? 'text-noklity-red' : 'text-gray-500'} aria-label="Add to wishlist">
                  <Icon name="heart" className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="text-gray-500 hover:text-blue-600" aria-label="Share">
                  <Icon name="share" className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="my-4 text-sm">
              <span className="text-gray-500">Brand: </span>
              <a href="#" className="text-blue-600 hover:underline">{product.brand || 'N/A'}</a>
            </div>
            
            <hr/>

            <div className="my-4">
              <p className="text-3xl font-bold text-orange-500">৳{product.price.toLocaleString()}</p>
              {product.originalPrice && (
                  <div className="flex items-center text-base text-gray-500">
                      <span className="line-through">৳{product.originalPrice.toLocaleString()}</span>
                      <span className="ml-3 font-semibold">-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>
                  </div>
              )}
            </div>
          
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <p className="font-semibold mb-2">Color Family: <span className="font-normal text-gray-600">{selectedColor}</span></p>
                <div className="flex gap-2">
                  {product.colors.map(color => (
                    <div 
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative w-12 h-12 rounded border-2 cursor-pointer p-0.5 ${selectedColor === color.name ? 'border-orange-500' : 'border-gray-300'}`}
                      >
                        <img src={color.imageUrl} alt={color.name} className="w-full h-full object-cover rounded-sm"/>
                        {selectedColor === color.name && <div className="absolute inset-0 bg-black/30 flex items-center justify-center"><Icon name="check" className="w-5 h-5 text-white"/></div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <p className="font-semibold mb-2">Size: <span className="font-normal text-gray-600">{selectedSize || 'Please select'}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded border ${selectedSize === size ? 'border-orange-500 text-orange-500 bg-orange-50' : 'border-gray-300 hover:border-gray-500'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-8 mb-6">
              <p className="font-semibold">Quantity</p>
              <div className="flex items-center border border-gray-200 rounded">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 text-gray-500 hover:bg-gray-100"><Icon name="minus" className="w-5 h-5"/></button>
                <span className="px-4 font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="p-2 text-gray-500 hover:bg-gray-100"><Icon name="plus" className="w-5 h-5"/></button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                  onClick={handleBuyNow}
                  className="w-full py-3 px-6 rounded-lg text-white font-semibold bg-cyan-500 hover:bg-cyan-600 transition-colors duration-300"
              >
                  Buy Now
              </button>
              <button 
                  onClick={handleAddToCart}
                  className="w-full py-3 px-6 rounded-lg text-white font-semibold bg-orange-500 hover:bg-orange-600 transition-colors duration-300"
              >
                  Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details Section */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Product Details</h2>
        <div className="space-y-4">
          {product.description.split('\n').filter(p => p.trim()).map((paragraph, index) => (
            <p key={index} className="text-gray-600 leading-relaxed">{paragraph}</p>
          ))}
        </div>
      </div>

      {(product.reviews || productReviews.length > 0) && (
        <ProductReviews 
          product={product} 
          reviews={productReviews} 
          onWriteReview={() => setReviewModalOpen(true)}
        />
      )}
       <WriteReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        product={product}
      />
    </>
  );
};

export default ProductDetailPage;