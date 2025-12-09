import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Icon, IconName } from './Icon';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const MobileNavItem: React.FC<{
  href: string;
  icon: IconName;
  label: string;
  badge?: number | string;
}> = ({ href, icon, label, badge }) => {
  const activeLinkClass = 'text-orange-500';
  const inactiveLinkClass = 'text-gray-500';

  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center w-full h-full relative ${
          isActive ? activeLinkClass : inactiveLinkClass
        }`
      }
    >
      <Icon name={icon} className="w-6 h-6" />
      <span className="text-xs mt-1">{label}</span>
      {badge && (
        <span className="absolute top-0 right-1/2 -mr-5 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
          {badge}
        </span>
      )}
    </NavLink>
  );
};

interface MobileNavProps {
  setIsChatbotOpen: (isOpen: boolean) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ setIsChatbotOpen }) => {
  const { getCartItemCount } = useCart();
  const { getWishlistItemCount } = useWishlist();
  const cartItemCount = getCartItemCount();
  const wishlistItemCount = getWishlistItemCount();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center z-40">
      <div className="w-full">
        <MobileNavItem href="/" icon="home" label="Home" />
      </div>
      <div className="w-full">
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="flex flex-col items-center justify-center w-full h-full relative text-gray-500 hover:text-orange-500 transition-colors"
          aria-label="Open AI Chat"
        >
          <Icon name="chat" className="w-6 h-6" />
          <span className="text-xs mt-1">Chat</span>
        </button>
      </div>
      <div className="w-full flex justify-center">
         <Link to="/wishlist" className="-mt-6">
            <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center border-t-2 border-gray-200">
                <div className="relative w-14 h-14 bg-noklity-red rounded-full flex flex-col items-center justify-center text-white shadow-md">
                    <Icon name="heart" className="w-7 h-7" />
                    {wishlistItemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-white text-noklity-red text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-noklity-red">
                            {wishlistItemCount}
                        </span>
                    )}
                </div>
            </div>
        </Link>
      </div>
      <div className="w-full">
         <MobileNavItem href="/cart" icon="cart" label="Cart" badge={cartItemCount > 0 ? cartItemCount : undefined} />
      </div>
      <div className="w-full">
         <MobileNavItem href="/account" icon="shoppingBag" label="Orders" />
      </div>
    </nav>
  );
};

export default MobileNav;
