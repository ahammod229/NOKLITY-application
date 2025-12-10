import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { Icon } from '../components/Icon';
import QuickViewModal from '../components/QuickViewModal';
import type { Product } from '../constants';

const HomePage: React.FC = () => {
  const { products } = useProducts();
  const flashSaleProducts = products.filter(p => p.originalPrice);
  const regularProducts = products.filter(p => !p.originalPrice);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [banner, setBanner] = useState<{image: string, link: string} | null>(null);

  useEffect(() => {
    // Load home slider banner if available
    try {
        const banners = JSON.parse(localStorage.getItem('admin_banners') || '[]');
        const homeBanner = banners.find((b: any) => b.location === 'Home Slider') || banners[0]; // Fallback to first available
        if (homeBanner) {
            setBanner({ image: homeBanner.image, link: homeBanner.link });
        }
    } catch (e) {
        console.error("Error loading banners", e);
    }
  }, []);

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };


  const mainCategoriesData = [
    { id: 'electronics', name: 'Electronic Products', imageUrl: 'https://i.ibb.co/VvZGHgq/electronic-icon.png' },
    { id: 'tyres', name: 'Tyre & Tube', imageUrl: 'https://i.ibb.co/1GSy7Bw/tyre-icon.png' },
    { id: 'spare-parts', name: 'Spare Parts', imageUrl: 'https://i.ibb.co/Yy6Qz6s/bearing-icon.png' },
    { id: 'tools', name: 'Tools & DIY', imageUrl: 'https://i.ibb.co/D8yYq3Q/tools-icon.png' },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section - Dynamic if banner exists */}
      <section className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden min-h-[250px] md:min-h-[450px] flex items-center group">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${banner ? banner.image : "https://i.ibb.co/F8kQcM1/batteries-bg.jpg"}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 via-gray-800/20 to-transparent"></div>
        </div>
        
        {/* Only show default text content if it's the default background or if we want text overlay on custom banners */}
        <div className="relative z-10 container mx-auto px-4 grid md:grid-cols-2">
            <div className="md:col-start-1 text-center md:text-left text-white p-6">
                 {/* Only show default CTA if no custom link is provided or if it's the default view */}
                 {!banner || !banner.link ? (
                    <div className="bg-black/30 backdrop-blur-sm p-8 rounded-xl inline-block border border-white/10">
                        <h1 className="text-3xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-md">Genuine Parts</h1>
                        <p className="text-lg md:text-xl mb-8 drop-shadow-sm text-gray-100">High-quality components for all your needs</p>
                        <Link to="/category/electronics" className="inline-block bg-noklity-red text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-red-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            Shop Now
                        </Link>
                    </div>
                 ) : (
                     <Link to={banner.link} className="absolute inset-0 z-20 block w-full h-full text-transparent">Shop Now</Link>
                 )}
            </div>
        </div>
      </section>

      {/* Main Categories Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {mainCategoriesData.map((category) => (
            <Link 
              key={category.id} 
              to={`/category/${category.id}`} 
              className="block group text-center p-4 md:p-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-blue-200 dark:border-blue-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex justify-center items-center mb-4 h-16 md:h-20">
                <img src={category.imageUrl} alt={category.name} className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-110" />
              </div>
              <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm md:text-base">{category.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale */}
      {flashSaleProducts.length > 0 && (
        <section>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Flash Sale</h2>
                    <div className="mt-2">
                        <span className="bg-white dark:bg-gray-800 border border-orange-500 text-orange-500 text-sm font-semibold px-4 py-1.5 rounded-md animate-pulse">On Sale Now</span>
                    </div>
                </div>
                <Link to="/search?q=sale" className="text-sm font-semibold text-orange-600 border border-orange-500 px-4 py-2 rounded-md hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors">
                    SHOP ALL
                </Link>
            </div>
            <div className="border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {flashSaleProducts.map((product) => (
                <div key={product.id} className="border-r border-b md:border-b-0 border-gray-200 dark:border-gray-700 last:border-r-0">
                    <ProductCard product={product} flashSale={true} onQuickViewClick={handleQuickView} />
                </div>
                ))}
            </div>
            </div>
        </section>
      )}

      {/* All Categories Products */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Explore Our Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {regularProducts.map((product) => (
            <ProductCard key={product.id} product={product} onQuickViewClick={handleQuickView} />
          ))}
        </div>
      </section>
      <QuickViewModal product={quickViewProduct} onClose={closeQuickView} />
    </div>
  );
};

export default HomePage;
