
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../types';
import type { Product, Category } from '../constants';

const HighlightedText: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
  if (!highlight.trim()) {
    return <>{text}</>;
  }

  const highlightTerms = highlight
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (highlightTerms.length === 0) {
    return <>{text}</>;
  }

  const escapedTerms = highlightTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        if (highlightTerms.includes(part.toLowerCase())) {
          return <strong key={i} className="font-bold">{part}</strong>;
        }
        return part;
      })}
    </>
  );
};

type Suggestion =
  | { type: 'product'; data: Product }
  | { type: 'category'; data: Category };

const Header: React.FC = () => {
  const { getCartItemCount } = useCart();
  const { getWishlistItemCount } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { products } = useProducts(); // Use dynamic products
  const cartItemCount = getCartItemCount();
  const wishlistItemCount = getWishlistItemCount();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const desktopSearchContainerRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();

    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(lowerCaseQuery)
    ).slice(0, 5);

    const filteredCategories = CATEGORIES.filter(category =>
      category.name.toLowerCase().includes(lowerCaseQuery)
    ).slice(0, 2);

    const newSuggestions: Suggestion[] = [
      ...filteredProducts.map(p => ({ type: 'product' as const, data: p })),
      ...filteredCategories.map(c => ({ type: 'category' as const, data: c })),
    ];

    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0);
  }, [searchQuery, products]);

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // If the focus is moving to an element outside the search container, hide suggestions.
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setShowSuggestions(false);
    }
  };

  const navItems = [
    { icon: 'heart' as const, label: 'Wishlist', href: '/wishlist', badge: wishlistItemCount > 0 ? wishlistItemCount : undefined },
    { icon: 'cart' as const, label: 'Cart', href: '/cart', badge: cartItemCount > 0 ? cartItemCount : undefined },
    { icon: 'shoppingBag' as const, label: 'Orders', href: isAuthenticated ? '/account' : '/login' },
    { icon: 'help' as const, label: 'Help', href: '/help' },
    { icon: 'user' as const, label: isAuthenticated ? 'My Account' : 'Login', href: isAuthenticated ? '/account' : '/login' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.blur();
  };

  const productSuggestions = suggestions.filter(s => s.type === 'product');
  const categorySuggestions = suggestions.filter(s => s.type === 'category');

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar - DESKTOP ONLY */}
        <div className="hidden md:flex justify-between items-center py-2 border-b border-gray-200 text-xs text-gray-500">
          <div></div>
          <div className="flex items-center space-x-2">
            {isAuthenticated && user && (
              <span className="text-gray-700">Welcome, <b>{user.name}</b></span>
            )}
          </div>
        </div>

        {/* Main header - MOBILE */}
        <div className="md:hidden py-2">
            <div className="flex items-center gap-2">
                <Link to={isAuthenticated ? "/account" : "/login"} className="text-gray-600 hover:text-noklity-red p-1 flex-shrink-0" aria-label="Account">
                    <Icon name="user" className="w-7 h-7" />
                </Link>
                <div ref={mobileSearchContainerRef} onBlur={handleBlur} className="flex-1 relative">
                    <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                        <div className="relative flex-grow">
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                            placeholder="mosquito bat circuit"
                            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-100"
                            autoComplete="off"
                          />
                          {searchQuery && (
                            <button type="button" onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800" aria-label="Clear search">
                                <Icon name="x" className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        <button type="submit" className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-md">
                            Search
                        </button>
                    </form>
                    {showSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
                           <ul>
                            {productSuggestions.map(suggestion => {
                                if (suggestion.type !== 'product') return null;
                                return (
                                <li key={`product-${suggestion.data.id}`}>
                                    <Link
                                    to={`/product/${suggestion.data.id}`}
                                    onClick={handleSuggestionClick}
                                    className="flex items-center p-3 hover:bg-gray-100 transition-colors duration-200"
                                    >
                                    <img src={suggestion.data.imageUrl} alt={suggestion.data.name} className="w-12 h-12 object-contain mr-4 rounded" loading="lazy" decoding="async" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-800">
                                        <HighlightedText text={suggestion.data.name} highlight={searchQuery} />
                                        </p>
                                        <p className="text-sm font-semibold text-orange-500">৳{suggestion.data.price.toLocaleString()}</p>
                                    </div>
                                    </Link>
                                </li>
                                );
                            })}
                            {productSuggestions.length > 0 && categorySuggestions.length > 0 && (
                                <li className="border-t mx-3 my-1"></li>
                            )}
                            {categorySuggestions.map(suggestion => (
                                <li key={`category-${suggestion.data.id}`}>
                                <Link
                                    to={`/category/${suggestion.data.id}`}
                                    onClick={handleSuggestionClick}
                                    className="flex items-center p-3 hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <Icon name="tag" className="w-8 h-8 text-gray-400 mr-4 flex-shrink-0" />
                                    <div className="flex-1">
                                    <p className="text-sm text-gray-800">
                                        <HighlightedText text={suggestion.data.name} highlight={searchQuery} />
                                    </p>
                                    <span className="text-xs bg-gray-200 text-gray-600 font-medium px-2 py-0.5 rounded-full">Category</span>
                                    </div>
                                </Link>
                                </li>
                            ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>


        {/* Main header - DESKTOP */}
        <div className="hidden md:flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <img src="https://i.ibb.co/p3wACj8/noklity-logo.png" alt="NOKLITY" className="h-8 w-auto" />
          </Link>

          <div ref={desktopSearchContainerRef} onBlur={handleBlur} className="flex-1 max-w-xl mx-8 relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search for products..."
                className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-noklity-red"
                autoComplete="off"
              />
              {searchQuery && (
                  <button type="button" onClick={handleClearSearch} className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800" aria-label="Clear search">
                      <Icon name="x" className="w-4 h-4" />
                  </button>
              )}
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2" aria-label="Search">
                <Icon name="search" className="w-5 h-5 text-gray-400 hover:text-noklity-red" />
              </button>
            </form>
            {showSuggestions && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
                <ul>
                  {productSuggestions.map(suggestion => {
                    if (suggestion.type !== 'product') return null;
                    return (
                      <li key={`product-${suggestion.data.id}`}>
                        <Link
                          to={`/product/${suggestion.data.id}`}
                          onClick={handleSuggestionClick}
                          className="flex items-center p-3 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <img src={suggestion.data.imageUrl} alt={suggestion.data.name} className="w-12 h-12 object-contain mr-4 rounded" loading="lazy" decoding="async" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">
                              <HighlightedText text={suggestion.data.name} highlight={searchQuery} />
                            </p>
                            <p className="text-sm font-semibold text-orange-500">৳{suggestion.data.price.toLocaleString()}</p>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                  {productSuggestions.length > 0 && categorySuggestions.length > 0 && (
                     <li className="border-t mx-3 my-1"></li>
                  )}
                  {categorySuggestions.map(suggestion => (
                     <li key={`category-${suggestion.data.id}`}>
                       <Link
                        to={`/category/${suggestion.data.id}`}
                        onClick={handleSuggestionClick}
                        className="flex items-center p-3 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Icon name="tag" className="w-8 h-8 text-gray-400 mr-4 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">
                            <HighlightedText text={suggestion.data.name} highlight={searchQuery} />
                          </p>
                          <span className="text-xs bg-gray-200 text-gray-600 font-medium px-2 py-0.5 rounded-full">Category</span>
                        </div>
                      </Link>
                     </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <nav>
            <ul className="flex items-center space-x-6">
              {navItems.map((item) => (
                <li key={item.label + item.href}>
                  <Link to={item.href} className="flex flex-col items-center text-gray-600 hover:text-noklity-red relative">
                    <Icon name={item.icon} className="w-6 h-6 mb-1" />
                    <span className="text-xs">{item.label}</span>
                     {item.badge && (
                      <span className="absolute -top-2 -right-2 bg-noklity-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
