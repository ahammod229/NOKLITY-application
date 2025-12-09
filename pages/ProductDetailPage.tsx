
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import StarRating from '../components/StarRating';
import { Icon } from '../components/Icon';
import ProductReviews from '../components/ProductReviews';
import { useReview } from '../context/ReviewContext';
import WriteReviewModal from '../components/WriteReviewModal';
import { toast } from '../components/Toast';
import type { Product } from '../constants';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';


const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { getReviewsForProduct, addReview } = useReview();

  const [product, setProduct] = useState<Product | undefined>(undefined);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [fbtProducts, setFbtProducts] = useState<Product[]>([]);
  const [selectedFbt, setSelectedFbt] = useState<Record<number, boolean>>({});

  const isWishlisted = product ? isInWishlist(product.id) : false;
  const imageList = product?.images && product.images.length > 0 ? product.images : [product?.imageUrl || ''];
  const productReviews = product ? getReviewsForProduct(product.id) : [];
  
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only search if products have been loaded
    if (products.length > 0) {
      const foundProduct = products.find(p => p.id === parseInt(productId || ''));
      setProduct(foundProduct);

      if (foundProduct) {
        setSelectedImage(foundProduct.imageUrl);
        setSelectedColor(foundProduct.colors?.[0]?.name);
        setSelectedSize(null);
        setQuantity(1);
        
        // Logic for Frequently Bought Together
        const frequentlyBought = products.filter(
            p => p.categoryId === foundProduct.categoryId && p.id !== foundProduct.id
        ).slice(0, 2); // Get up to 2 products
        setFbtProducts(frequentlyBought);
        
        const initialSelection: Record<number, boolean> = {};
        frequentlyBought.forEach(p => {
            initialSelection[p.id] = true;
        });
        setSelectedFbt(initialSelection);
      }
    }
  }, [productId, products]);

  if (!product) {
    return (
       <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link to="/" className="text-noklity-red hover:underline mt-4 inline-block">Go back to Home</Link>
      </div>
    );
  }
  
  const category = CATEGORIES.find(c => c.id === product.categoryId);
  
  const relatedProducts = products.filter(
    p => p.categoryId === product.categoryId && p.id !== product.id
  ).slice(0, 4);

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} x ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} x ${product.name} added to cart!`);
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.show('Removed from wishlist');
    } else {
      addToWishlist(product.id);
      toast.success('Added to wishlist!');
    }
  };
  
  const handleFbtCheckboxChange = (productId: number) => {
    setSelectedFbt(prev => ({
        ...prev,
        [productId]: !prev[productId]
    }));
  };

  const totalFbtPrice = product.price + fbtProducts
      .filter(p => selectedFbt[p.id])
      .reduce((total, p) => total + p.price, 0);
      
  const handleAddFbtToCart = () => {
      // Add current product
      addToCart(product, 1);
      // Add selected related products
      fbtProducts.forEach(p => {
          if (selectedFbt[p.id]) {
              addToCart(p, 1);
          }
      });
      const selectedCount = Object.values(selectedFbt).filter(Boolean).length;
      toast.success(`${selectedCount + 1} items added to cart!`);
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
      if(!prevProduct) return undefined;
      // Initialize rating if undefined
      const currentRating = prevProduct.rating || { count: 0, stars: 0, breakdown: { '1':0, '2':0, '3':0, '4':0, '5':0 } };
      const currentBreakdown = currentRating.breakdown || { '1':0, '2':0, '3':0, '4':0, '5':0 };
      
      const newRatingVal = reviewData.rating;
      const ratingKey = String(Math.round(newRatingVal)) as keyof typeof currentBreakdown;

      const newBreakdown = {
        ...currentBreakdown,
        [ratingKey]: (currentBreakdown[ratingKey] || 0) + 1,
      };

      const newCount = currentRating.count + 1;
      
      const totalStars = Object.entries(newBreakdown).reduce(
          (sum, [star, count]) => sum + parseInt(star, 10) * (count as number), 0
      );
      
      const newStars = totalStars / newCount;

      return {
        ...prevProduct,
        rating: {
          ...currentRating,
          count: newCount,
          stars: newStars,
          breakdown: newBreakdown,
        },
      };
    });

    setReviewModalOpen(false);
    toast.success('Thank you for your review!');
  };


  return (
    <>
      <div className="pb-32 md:pb-0">
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
                      <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain" loading="lazy" decoding="async" />
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
              
              <div className="my-4">
                <p className="text-3xl font-bold text-orange-500">৳{product.price.toLocaleString()}</p>
                {product.originalPrice && (
                    <div className="flex items-center text-base text-gray-500">
                        <span className="line-through">৳{product.originalPrice.toLocaleString()}</span>
                        <span className="ml-3 font-semibold">-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>
                    </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  {product.rating && <StarRating rating={product.rating.stars} />}
                  {product.rating && <a href="#reviews" className="text-blue-600 hover:underline">{product.rating.count} Ratings</a>}
                  {product.answeredQuestions && <a href="#qa" className="text-blue-600 hover:underline">{product.answeredQuestions} Answered Questions</a>}
                </div>
                <div className="hidden md:flex items-center gap-4">
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

              {product.colors && product.colors.length > 0 && (
                <div className="mb-6 mt-4">
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
              
              <div className="hidden md:grid grid-cols-2 gap-4">
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
        
        {/* Frequently Bought Together Section */}
        {fbtProducts.length > 0 && (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mt-8">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Frequently Bought Together</h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-center">
                    {/* Current Product */}
                    <div className="flex flex-col items-center max-w-[150px]">
                        <Link to={`/product/${product.id}`}>
                            <img src={product.imageUrl} alt={product.name} className="w-28 h-28 object-contain rounded-md border p-1 hover:border-noklity-red transition" />
                        </Link>
                        <p className="text-sm font-medium mt-2 line-clamp-2">{product.name}</p>
                        <p className="text-sm text-gray-600">৳{product.price.toLocaleString()}</p>
                    </div>

                    {/* Plus Signs and Other Products */}
                    {fbtProducts.map((fbtProduct) => (
                        <React.Fragment key={fbtProduct.id}>
                            <div className="text-2xl my-2 text-gray-300 md:text-4xl md:my-0 md:font-thin md:text-gray-400 md:mx-2">+</div>
                            <div className="flex flex-col items-center max-w-[150px]">
                                <Link to={`/product/${fbtProduct.id}`}>
                                    <img src={fbtProduct.imageUrl} alt={fbtProduct.name} className="w-28 h-28 object-contain rounded-md border p-1 hover:border-noklity-red transition" />
                                </Link>
                                <label className="text-sm font-medium mt-2 flex items-center gap-2 cursor-pointer hover:text-noklity-red">
                                    <input
                                        type="checkbox"
                                        checked={!!selectedFbt[fbtProduct.id]}
                                        onChange={() => handleFbtCheckboxChange(fbtProduct.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-noklity-red focus:ring-noklity-red"
                                    />
                                    <span className="line-clamp-2">{fbtProduct.name}</span>
                                </label>
                                <p className="text-sm text-gray-600">৳{fbtProduct.price.toLocaleString()}</p>
                            </div>
                        </React.Fragment>
                    ))}

                    {/* Total and Add to Cart */}
                    <div className="text-2xl font-thin text-gray-400 mx-2 hidden md:block">=</div>
                    <div className="md:ml-4 mt-4 md:mt-0 flex flex-col items-center md:items-start p-4 border-t md:border-t-0 md:border-l md:pl-8 w-full md:w-auto">
                        <div className="text-center md:text-left">
                            <p className="text-gray-600 text-sm">For {Object.values(selectedFbt).filter(Boolean).length + 1} items</p>
                            <p className="text-2xl font-bold text-orange-500">৳{totalFbtPrice.toLocaleString()}</p>
                        </div>
                        <button
                            onClick={handleAddFbtToCart}
                            className="mt-4 bg-orange-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Add Selected to Cart
                        </button>
                    </div>
                </div>
            </div>
        )}

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

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customers Also Viewed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onQuickViewClick={handleQuickView}
                />
              ))}
            </div>
          </div>
        )}

         <WriteReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          onSubmit={handleReviewSubmit}
          product={product}
        />
        <QuickViewModal product={quickViewProduct} onClose={closeQuickView} />
      </div>

      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center px-2 gap-2 z-40">
        <div className="flex items-center gap-2">
            <Link to="/" className="flex flex-col items-center justify-center text-gray-600 hover:text-noklity-red p-1 w-14">
                <Icon name="store" className="w-6 h-6" />
                <span className="text-xs">Store</span>
            </Link>
            <button onClick={handleWishlistToggle} className="flex flex-col items-center justify-center text-gray-600 hover:text-noklity-red p-1 w-14">
                <Icon name="heart" className={`w-6 h-6 ${isWishlisted ? 'text-noklity-red fill-current' : ''}`} />
                <span className="text-xs">Wishlist</span>
            </button>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2">
            <button
                onClick={handleAddToCart}
                className="w-full py-3 px-3 rounded-lg text-white font-semibold bg-orange-500 hover:bg-orange-600 transition-colors duration-300 text-sm"
            >
                Add to Cart
            </button>
            <button
                onClick={handleBuyNow}
                className="w-full py-3 px-3 rounded-lg text-white font-semibold bg-cyan-500 hover:bg-cyan-600 transition-colors duration-300 text-sm"
            >
                Buy Now
            </button>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
