
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../types';
import ProductCard from '../components/ProductCard';
import { Icon } from '../components/Icon';
import StarRating from '../components/StarRating';
import QuickViewModal from '../components/QuickViewModal';
import type { Product } from '../constants';

const RATINGS = [4, 3, 2, 1];

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left font-semibold text-gray-800 dark:text-white hover:text-noklity-red dark:hover:text-noklity-red">
        <span>{title}</span>
        <Icon name={isOpen ? 'chevronUp' : 'chevronDown'} className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </button>
      {isOpen && <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">{children}</div>}
    </div>
  );
};

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const { products } = useProducts();
  
  // Calculate unique brands dynamically from current products list
  const brands = useMemo(() => {
      return [...new Set(products.map(p => p.brand).filter((b): b is string => !!b))].sort();
  }, [products]);

  const [filters, setFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    minPrice: '',
    maxPrice: '',
    rating: 0,
  });
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
      setCurrentPage(1); // Reset page on new search or filter change
  }, [query, filters]);

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const searchResults = useMemo(() => {
    return query
      ? products.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase())
        )
      : [];
  }, [query, products]);

  const filteredResults = useMemo(() => {
    let results = searchResults;

    if (filters.categories.length > 0) {
      results = results.filter(p => filters.categories.includes(p.categoryId));
    }

    if (filters.brands.length > 0) {
      results = results.filter(p => p.brand && filters.brands.includes(p.brand));
    }

    if (filters.minPrice) {
      results = results.filter(p => p.price >= Number(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      results = results.filter(p => p.price <= Number(filters.maxPrice));
    }

    if (filters.rating > 0) {
      results = results.filter(p => p.rating && p.rating.stars >= filters.rating);
    }

    return results;
  }, [searchResults, filters]);

  const handleCheckboxChange = (filterKey: 'categories' | 'brands', value: string) => {
    setFilters(prev => {
        const currentValues = prev[filterKey] as string[];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(item => item !== value)
            : [...currentValues, value];
        return { ...prev, [filterKey]: newValues };
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = e.target.value;
    // Allow only numbers
    if (/^\d*$/.test(value)) {
        setFilters(prev => ({
            ...prev,
            [type === 'min' ? 'minPrice' : 'maxPrice']: value
        }));
    }
  };

  const handleRatingChange = (rating: number) => {
      setFilters(prev => ({
          ...prev,
          rating: prev.rating === rating ? 0 : rating,
      }));
  };

  const clearFilters = () => {
      setFilters({
          categories: [],
          brands: [],
          minPrice: '',
          maxPrice: '',
          rating: 0,
      });
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div>
      <nav className="text-sm mb-4" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">Home</Link>
            <Icon name="chevronRight" className="h-4 w-4 mx-2 text-gray-400 dark:text-gray-500" />
          </li>
          <li>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Search</span>
          </li>
        </ol>
      </nav>

      {query ? (
        <>
          <h1 className="text-3xl font-bold mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 text-gray-900 dark:text-white">
            Search Results for: <span className="text-noklity-red">"{query}"</span>
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm h-fit border border-gray-100 dark:border-gray-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Filters</h2>
                <button onClick={clearFilters} className="text-sm text-noklity-red hover:underline">Clear All</button>
              </div>
              
              <FilterSection title="Category">
                {CATEGORIES.map(category => (
                  <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-noklity-red focus:ring-noklity-red bg-white dark:bg-gray-700"
                      checked={filters.categories.includes(category.id)}
                      onChange={() => handleCheckboxChange('categories', category.id)} />
                    <span>{category.name}</span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Price Range">
                <div className="flex items-center space-x-2">
                  <input type="text" placeholder="Min" value={filters.minPrice} onChange={e => handlePriceChange(e, 'min')} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <span className="text-gray-500 dark:text-gray-400">-</span>
                  <input type="text" placeholder="Max" value={filters.maxPrice} onChange={e => handlePriceChange(e, 'max')} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </FilterSection>

              <FilterSection title="Brand">
                {brands.map(brand => (
                   <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-noklity-red focus:ring-noklity-red bg-white dark:bg-gray-700"
                      checked={filters.brands.includes(brand)}
                      onChange={() => handleCheckboxChange('brands', brand)} />
                    <span>{brand}</span>
                  </label>
                ))}
              </FilterSection>
              
              <FilterSection title="Rating">
                  {RATINGS.map(star => (
                      <button key={star} onClick={() => handleRatingChange(star)}
                          className={`flex items-center p-2 rounded-md w-full text-left transition-colors ${filters.rating === star ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                          <StarRating rating={star} />
                          <span className="ml-2 text-gray-600 dark:text-gray-300">& up</span>
                      </button>
                  ))}
              </FilterSection>
            </aside>

            {/* Results */}
            <main className="lg:col-span-3">
              {filteredResults.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                    {paginatedResults.map(product => (
                        <ProductCard key={product.id} product={product} highlight={query || ''} onQuickViewClick={handleQuickView} />
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
                <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">No products found</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Try adjusting your filters or search for something else.</p>
                </div>
              )}
            </main>
          </div>
          <QuickViewModal product={quickViewProduct} onClose={closeQuickView} />
        </>
      ) : (
         <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Please enter a search term</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Use the search bar in the header to find products.</p>
         </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
