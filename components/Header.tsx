import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { PRODUCTS } from '../types';
import type { Product } from '../constants';

const HighlightedText: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
  if (!highlight.trim()) {
    return <>{text}</>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <strong key={i} className="font-bold">{part}</strong>
        ) : (
          part
        )
      )}
    </>
  );
};

const Header: React.FC = () => {
  const { getCartItemCount } = useCart();
  const { getWishlistItemCount } = useWishlist();
  const cartItemCount = getCartItemCount();
  const wishlistItemCount = getWishlistItemCount();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = PRODUCTS.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 7);

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { icon: 'heart' as const, label: 'Wishlist', href: '/wishlist', badge: wishlistItemCount > 0 ? wishlistItemCount : undefined },
    { icon: 'cart' as const, label: 'Cart', href: '/cart', badge: cartItemCount > 0 ? cartItemCount : undefined },
    { icon: 'shoppingBag' as const, label: 'Orders', href: '/account' },
    { icon: 'help' as const, label: 'Help', href: '/help' },
    { icon: 'user' as const, label: 'Account', href: '/login' },
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

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex justify-between items-center py-2 border-b border-gray-200 text-xs text-gray-500">
          <div></div>
          <div className="flex items-center space-x-2">
          </div>
        </div>

        {/* Main header */}
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M0 0 H25 L0 25 V0 Z" fill="#E50044"/>
                <path d="M40 40 V15 L15 40 H40 Z" fill="#111827"/>
            </svg>
            <span className="font-bold text-3xl text-gray-800 tracking-tight">NOKLITY</span>
          </Link>

          <div ref={searchContainerRef} className="flex-1 max-w-xl mx-8 relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search for products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-noklity-red"
                autoComplete="off"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2" aria-label="Search">
                <Icon name="search" className="w-5 h-5 text-gray-400 hover:text-noklity-red" />
              </button>
            </form>
            {showSuggestions && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
                <ul>
                  {suggestions.map(product => (
                    <li key={product.id}>
                      <Link
                        to={`/product/${product.id}`}
                        onClick={handleSuggestionClick}
                        className="flex items-center p-3 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-contain mr-4 rounded" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">
                            <HighlightedText text={product.name} highlight={searchQuery} />
                          </p>
                          <p className="text-sm font-semibold text-orange-500">৳{product.price.toLocaleString()}</p>
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