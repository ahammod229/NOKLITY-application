
import React, { useState, useMemo } from 'react';
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
    <div className="border-b py-4">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left font-semibold text-gray-800 hover:text-noklity-red">
        <span>{title}</span>
        <Icon name={isOpen ? 'chevronUp' : 'chevronDown'} className="w-5 h-5" />
      </button>
      {isOpen && <div className="mt-4 space-y-2 text-sm">{children}</div>}
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

  return (
    <div>
      <nav className="text-sm mb-4" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <Icon name="chevronRight" className="h-4 w-4 mx-2 text-gray-400" />
          </li>
          <li>
            <span className="text-gray-700 font-medium">Search</span>
          </li>
        </ol>
      </nav>

      {query ? (
        <>
          <h1 className="text-3xl font-bold mb-6 border-b pb-4">
            Search Results for: <span className="text-noklity-red">"{query}"</span>
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1 bg-white p-4 rounded-lg shadow-sm h-fit">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={clearFilters} className="text-sm text-noklity-red hover:underline">Clear All</button>
              </div>
              
              <FilterSection title="Category">
                {CATEGORIES.map(category => (
                  <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-noklity-red focus:ring-noklity-red"
                      checked={filters.categories.includes(category.id)}
                      onChange={() => handleCheckboxChange('categories', category.id)} />
                    <span>{category.name}</span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Price Range">
                <div className="flex items-center space-x-2">
                  <input type="text" placeholder="Min" value={filters.minPrice} onChange={e => handlePriceChange(e, 'min')} className="w-full p-2 border rounded-md text-sm" />
                  <span>-</span>
                  <input type="text" placeholder="Max" value={filters.maxPrice} onChange={e => handlePriceChange(e, 'max')} className="w-full p-2 border rounded-md text-sm" />
                </div>
              </FilterSection>

              <FilterSection title="Brand">
                {brands.map(brand => (
                   <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-noklity-red focus:ring-noklity-red"
                      checked={filters.brands.includes(brand)}
                      onChange={() => handleCheckboxChange('brands', brand)} />
                    <span>{brand}</span>
                  </label>
                ))}
              </FilterSection>
              
              <FilterSection title="Rating">
                  {RATINGS.map(star => (
                      <button key={star} onClick={() => handleRatingChange(star)}
                          className={`flex items-center p-2 rounded-md w-full text-left ${filters.rating === star ? 'bg-yellow-100' : 'hover:bg-gray-100'}`}>
                          <StarRating rating={star} />
                          <span className="ml-2 text-gray-600">& up</span>
                      </button>
                  ))}
              </FilterSection>
            </aside>

            {/* Results */}
            <main className="lg:col-span-3">
              {filteredResults.length > 0 ? (
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredResults.map(product => (
                    <ProductCard key={product.id} product={product} highlight={query || ''} onQuickViewClick={handleQuickView} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold">No products found</h2>
                  <p className="text-gray-600 mt-2">Try adjusting your filters or search for something else.</p>
                </div>
              )}
            </main>
          </div>
          <QuickViewModal product={quickViewProduct} onClose={closeQuickView} />
        </>
      ) : (
         <div className="text-center py-10">
            <h2 className="text-2xl font-bold">Please enter a search term</h2>
            <p className="text-gray-600 mt-2">Use the search bar in the header to find products.</p>
         </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
