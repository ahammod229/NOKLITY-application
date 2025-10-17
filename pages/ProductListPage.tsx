import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// FIX: Imported constants from `types.ts` where they are defined.
import { PRODUCTS, CATEGORIES } from '../types';
import ProductCard from '../components/ProductCard';
// FIX: Imported Product type from `constants.ts` where it is defined.
import type { Product } from '../constants';
import QuickViewModal from '../components/QuickViewModal';

const ProductListPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = CATEGORIES.find(c => c.id === categoryId);
  const products: Product[] = PRODUCTS.filter(p => p.categoryId === categoryId);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };


  if (!category) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Category not found</h2>
        <Link to="/" className="text-noklity-red hover:underline mt-4 inline-block">Go back to Home</Link>
      </div>
    );
  }

  return (
    <div>
       <nav className="text-sm mb-4" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
          </li>
          <li>
            <span className="text-gray-700 font-medium">{category.name}</span>
          </li>
        </ol>
      </nav>
      <h1 className="text-3xl font-bold mb-6 border-b pb-4">{category.name}</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} onQuickViewClick={handleQuickView} />
          ))}
        </div>
      ) : (
        <p>No products found in this category.</p>
      )}
       <QuickViewModal product={quickViewProduct} onClose={closeQuickView} />
    </div>
  );
};

export default ProductListPage;
