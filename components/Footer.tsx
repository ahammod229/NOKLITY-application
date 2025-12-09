

import React from 'react';
import { Link } from 'react-router-dom';

const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
    <li>
        <Link to={to} className="text-gray-400 hover:text-white transition-colors duration-200">{children}</Link>
    </li>
);

const Footer: React.FC = () => {
  return (
    <footer className="hidden md:block bg-zinc-800 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
                <FooterLink to="/about">About Us</FooterLink>
                <FooterLink to="/">Shop</FooterLink>
                <FooterLink to="/contact">Customer Service</FooterLink>
                <FooterLink to="#">Press & Advertisers</FooterLink>
                <FooterLink to="/privacy">Aegreass lean is</FooterLink>
            </ul>
          </div>

          {/* Column 2: Empty for spacing as in design */}
           <div></div>

          {/* Column 3: Payment Methods */}
          <div className='col-span-2'>
            <h3 className="font-bold text-lg mb-4 uppercase">We Accept Payment Methods</h3>
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded-md h-12 w-28 flex items-center justify-center">
                <img src="https://i.ibb.co/Q8Q1mFp/bkash.png" alt="bKash" className="h-10 object-contain" />
              </div>
              <div className="bg-white p-2 rounded-md h-12 w-28 flex items-center justify-center">
                 <img src="https://i.ibb.co/CVCmC25/nagad.png" alt="Nagad" className="h-10 object-contain" />
              </div>
              <div className="bg-white p-2 rounded-md h-12 w-28 flex items-center justify-center text-blue-800 font-extrabold">
                <span className="text-2xl">🏛️ BANK</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} ICO AIAREET Aiyete resorned.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;