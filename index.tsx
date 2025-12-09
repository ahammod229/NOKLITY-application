
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ReviewProvider } from './context/ReviewContext';
import { OrderProvider } from './context/OrderContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <ProductProvider>
          <WishlistProvider>
            <ReviewProvider>
              <OrderProvider>
                <CartProvider>
                  <App />
                </CartProvider>
              </OrderProvider>
            </ReviewProvider>
          </WishlistProvider>
        </ProductProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
