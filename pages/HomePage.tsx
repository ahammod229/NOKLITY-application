import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// FIX: Imported PRODUCTS constant from `types.ts` where it is defined.
import { PRODUCTS } from '../types';
import ProductCard from '../components/ProductCard';
import { Icon } from '../components/Icon';
import QuickViewModal from '../components/QuickViewModal';
import type { Product } from '../constants';

const HomePage: React.FC = () => {
  const flashSaleProducts = PRODUCTS.filter(p => p.originalPrice);
  const regularProducts = PRODUCTS.filter(p => !p.originalPrice);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };


  const mainCategoriesData = [
    { id: 'electronics', name: 'Electronic Products', icon: 'desktop' as const },
    { id: 'tyres', name: 'Tyre & Tube', icon: 'tyre' as const },
    { id: 'spare-parts', name: 'Spare Parts', icon: 'gear' as const },
    { id: 'tools', name: 'Tools & DIY', icon: 'wrench' as const },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gray-100 rounded-lg overflow-hidden min-h-[450px] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-left-top z-0"
          style={{ backgroundImage: "url('https://i.ibb.co/F8kQcM1/batteries-bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100/10 via-gray-100/80 to-gray-100/95"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 grid md:grid-cols-2">
            <div className="md:col-start-2 text-center md:text-left">
                <div className="bg-white/60 backdrop-blur-sm p-8 rounded-lg inline-block">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Genuine Electronic Parts</h1>
                    <p className="text-lg text-gray-700 mb-8">High-quality components for your needs</p>
                    <Link to="/category/electronics" className="inline-block bg-noklity-red text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg transition-all duration-300">
                        Shop Now
                    </Link>
                </div>
            </div>
        </div>
      </section>

      {/* Main Categories Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {mainCategoriesData.map((category) => (
            <Link key={category.id} to={`/category/${category.id}`} className="block group text-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-center items-center mb-4 text-gray-700 group-hover:text-noklity-red transition-colors duration-300">
                <Icon name={category.icon} className="h-12 w-12" />
              </div>
              <p className="font-semibold text-gray-800">{category.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale */}
      <section>
        <div className="flex justify-between items-center mb-4">
            <div>
                <h2 className="text-2xl font-semibold text-gray-800">Flash Sale</h2>
                <div className="mt-2">
                    <span className="bg-white border border-orange-500 text-orange-500 text-sm font-semibold px-4 py-1.5 rounded-md">On Sale Now</span>
                </div>
            </div>
            <Link to="#" className="text-sm font-semibold text-orange-600 border border-orange-500 px-4 py-2 rounded-md hover:bg-orange-50 transition-colors">
                SHOP ALL PRODUCTS
            </Link>
        </div>
        <div className="border-t border-b border-gray-200 bg-white">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {flashSaleProducts.map((product) => (
              <div key={product.id} className="border-r border-gray-200 last:border-r-0">
                  <ProductCard product={product} flashSale={true} onQuickViewClick={handleQuickView} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Categories Products */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Explore Our Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
