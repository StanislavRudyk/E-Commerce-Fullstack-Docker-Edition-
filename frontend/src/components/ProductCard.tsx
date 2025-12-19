import React, { useState } from 'react';
import { ShoppingCartIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';

const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const safeImage = product.image_url || `https://placehold.co/600x600/f3f4f6/a1a1aa?text=${encodeURIComponent(product.name)}`;

  return (
    <div className="group bg-white rounded-[2.5rem] p-6 flex flex-col transition-all duration-500 hover:shadow-2xl border border-gray-100 relative overflow-hidden">
      <div className="aspect-square flex items-center justify-center mb-6 overflow-hidden bg-gray-50 rounded-[2rem] relative">
        <img 
          src={safeImage} 
          alt={product.name} 
          className="object-cover h-full w-full transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="flex flex-col flex-1 px-1">
        <h3 className="text-xl font-black text-black mb-2 leading-tight uppercase italic tracking-tighter truncate">
          {product.name}
        </h3>
        <p className="text-gray-400 text-xs font-medium line-clamp-2 mb-6 leading-relaxed">
          {product.description || "Премиальное качество для вашего комфорта."}
        </p>
        
        <div className="mt-auto flex justify-between items-center pt-5 border-t border-gray-50">
          <span className="text-2xl font-black text-blue-600 italic">
            {product.price} ₴
          </span>
          <button 
            onClick={handleAdd}
            className="bg-black hover:bg-blue-600 text-white px-6 py-4 rounded-2xl flex items-center gap-2 transition-all active:scale-95 font-black text-[10px] uppercase tracking-widest shadow-xl"
          >
            КУПИТЬ +
          </button>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] bg-black text-white px-10 py-5 rounded-[2rem] font-black uppercase italic text-xs animate-in slide-in-from-bottom-5 fade-in duration-300 shadow-2xl flex items-center gap-4 border border-white/10">
          <CheckIcon className="w-5 h-5 text-green-500" />
          Добавлено в корзину
        </div>
      )}
    </div>
  );
};

export default ProductCard;