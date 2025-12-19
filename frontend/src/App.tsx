import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CartPage } from './pages/CartPage';
import { AdminPage } from './pages/AdminPage';
import { OrdersPage } from './pages/OrdersPage';
import { LoginPage } from './pages/LoginPage';
import Navbar from './components/Navbar';
import { CartProvider } from './context/CartContext';

function App() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');
  const isAuthenticated = !!token;
  const isAdmin = userEmail === 'admin@example.com';

  useEffect(() => {
    if (isAuthenticated) {
      fetch('http://localhost:8000/api/v1/products/')
        .then(res => res.json())
        .then(data => setProducts(Array.isArray(data) ? data : data.items || []));
      fetch('http://localhost:8000/api/v1/categories/')
        .then(res => res.json())
        .then(data => setCategories(Array.isArray(data) ? data : []));
    }
  }, [isAuthenticated]);

  const filteredProducts = selectedCategoryId 
    ? products.filter(p => p.category_id === selectedCategoryId)
    : products;

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
          {isAuthenticated && <Navbar />}
          
          <main className={isAuthenticated ? "max-w-7xl mx-auto px-6 py-12" : ""}>
            <Routes>
              {!isAuthenticated ? (
                <>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </>
              ) : (
                <>
                  <Route path="/" element={
                    isAdmin ? <Navigate to="/admin" replace /> : (
                    <div className="animate-in fade-in duration-700">
                      <div className="mb-10">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                          Наш <span className="text-blue-600">Ассортимент</span>
                        </h2>
                        <div className="h-1.5 w-20 bg-black mt-2 rounded-full"></div>
                      </div>

                      <div className="flex gap-4 overflow-x-auto pb-10 no-scrollbar">
                        <button 
                          onClick={() => setSelectedCategoryId(null)}
                          className={`px-10 py-4 rounded-[1.8rem] font-black uppercase italic tracking-tighter text-sm transition-all shadow-sm flex-shrink-0 ${
                            selectedCategoryId === null 
                              ? 'bg-black text-white scale-105 shadow-xl shadow-gray-200' 
                              : 'bg-gray-50 text-gray-400 border border-gray-100 hover:text-black hover:bg-white'
                          }`}
                        >
                          ВСЕ ТОВАРЫ
                        </button>
                        
                        {categories.map(cat => (
                          <button 
                            key={cat.id}
                            onClick={() => setSelectedCategoryId(cat.id)}
                            className={`px-10 py-4 rounded-[1.8rem] font-black uppercase italic tracking-tighter text-sm transition-all shadow-sm flex-shrink-0 whitespace-nowrap ${
                              selectedCategoryId === cat.id 
                                ? 'bg-blue-600 text-white scale-105 shadow-xl shadow-blue-100' 
                                : 'bg-gray-50 text-gray-400 border border-gray-100 hover:text-black hover:bg-white'
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                      <CatalogPage products={filteredProducts} />
                    </div>
                  )} />

                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/admin" element={isAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              )}
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;