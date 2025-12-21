
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../types';
import ProductCard from '../components/ProductCard';
import type { Product } from '../constants';
import QuickViewModal from '../components/QuickViewModal';
import { Icon } from '../components/Icon';

const ProductListPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { products: allProducts } = useProducts();
  
  const category = CATEGORIES.find(c => c.id === categoryId);
  const products: Product[] = allProducts.filter(p => p.categoryId === categoryId);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Adjust items per page

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when category changes
  }, [categoryId]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!category) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold dark:text-white">Category not found</h2>
        <Link to="/" className="text-noklity-red hover:underline mt-4 inline-block">Go back to Home</Link>
      </div>
    );
  }

  return (
    <div>
       <nav className="text-sm mb-4" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">Home</Link>
            <svg className="fill-current w-3 h-3 mx-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
          </li>
          <li>
            <span className="text-gray-700 dark:text-gray-300 font-medium">{category.name}</span>
          </li>
        </ol>
      </nav>
      <div className="flex justify-between items-end mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{category.name}</h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">{products.length} Products</span>
      </div>
      
      {products.length > 0 ? (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedProducts.map(product => (
                <ProductCard key={product.id} product={product} onQuickViewClick={handleQuickView} />
            ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-10 gap-2">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md border ${currentPage === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed dark:border-gray-700 dark:text-gray-600' : 'border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                    >
                        <Icon name="chevronLeft" className="w-5 h-5" />
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`w-10 h-10 rounded-md font-medium transition-colors ${currentPage === i + 1 ? 'bg-noklity-red text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md border ${currentPage === totalPages ? 'border-gray-200 text-gray-400 cursor-not-allowed dark:border-gray-700 dark:text-gray-600' : 'border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                    >
                        <Icon name="chevronRight" className="w-5 h-5" />
                    </button>
                </div>
            )}
        </>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No products found in this category.</p>
      )}
       <QuickViewModal product={quickViewProduct} onClose={closeQuickView} />
    </div>
  );
};

export default ProductListPage;
