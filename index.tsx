import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ReviewProvider } from './context/ReviewContext';
import { OrderProvider } from './context/OrderContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <WishlistProvider>
        <ReviewProvider>
          <OrderProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </OrderProvider>
        </ReviewProvider>
      </WishlistProvider>
    </HashRouter>
  </React.StrictMode>
);