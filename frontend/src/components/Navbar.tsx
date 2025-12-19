import React from 'react';
import { 
  ShoppingCartIcon, 
  ClipboardDocumentListIcon, 
  ShieldCheckIcon, 
  ArrowRightOnRectangleIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('token');
  
  const isAdmin = userEmail === 'admin@example.com'; 
  const isAuthenticated = !!token;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          <Link to="/" className="flex-shrink-0 group">
            <span className="text-4xl font-black text-blue-600 tracking-tighter italic uppercase transition-transform group-hover:scale-105 block">
              STORE<span className="text-black">.</span>
            </span>
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-400 hover:text-black font-black text-xs uppercase tracking-widest transition-colors">
              Каталог
            </Link>

            {!isAdmin && isAuthenticated && (
              <Link to="/orders" className="text-gray-400 hover:text-black font-black text-xs uppercase tracking-widest transition-colors">
                Замовлення
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin" className="text-blue-600 font-black text-xs uppercase tracking-widest hover:text-black transition-all">
                Адмінка
              </Link>
            )}

            {!isAdmin && (
              <Link to="/cart" className="relative p-4 bg-gray-50 rounded-[1.2rem] hover:bg-black group transition-all">
                <ShoppingCartIcon className="h-6 w-6 text-black group-hover:text-white" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-4 border-white">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated && (
              <div className="flex items-center gap-5 pl-8 border-l border-gray-100">
                <div className="hidden sm:block text-right">
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-0.5">
                    {isAdmin ? 'ADMIN' : 'CLIENT'}
                  </p>
                  <p className="text-sm font-black text-black uppercase italic">
                    {userName || 'User'}
                  </p>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="p-4 bg-red-50 text-red-500 rounded-[1.2rem] hover:bg-red-500 hover:text-white transition-all"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;