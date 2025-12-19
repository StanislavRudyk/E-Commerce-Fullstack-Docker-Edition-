import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-40 flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <div className="bg-gray-50 p-10 rounded-[3rem] mb-8">
          <ShoppingBag size={80} className="text-gray-200" />
        </div>
        <h2 className="text-4xl font-black mb-4 uppercase italic tracking-tighter">Корзина пуста</h2>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-10">Пора добавить туда что-то крутое</p>
        <Link to="/" className="bg-black text-white px-12 py-5 rounded-[2rem] font-black uppercase italic hover:bg-blue-600 transition-all shadow-2xl">
          К ПОКУПКАМ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-black">
          ВАША <span className="text-blue-600">КОРЗИНА</span>
        </h1>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Проверьте выбранные товары перед оплатой</p>
      </div>

      <div className="space-y-6 mb-12">
        {cartItems.map((item: any) => (
          <div key={item.id} className="flex flex-col md:flex-row items-center justify-between p-8 bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-md transition-all gap-8">
            <div className="flex items-center gap-8 w-full">
              <div className="w-32 h-32 bg-gray-50 rounded-[2rem] overflow-hidden flex-shrink-0 border border-gray-50">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center italic text-[10px] font-black text-gray-300">NO IMAGE</div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-black text-2xl uppercase italic leading-tight mb-1">{item.name}</h3>
                <p className="text-blue-600 font-black text-xl">{item.price.toLocaleString()} ₴</p>
              </div>
            </div>

            <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center bg-gray-50 rounded-[1.5rem] p-2 border border-gray-100">
                <button onClick={() => updateQuantity(item.id, -1)} className="p-3 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-400 hover:text-black">
                  <Minus size={20} strokeWidth={3} />
                </button>
                <span className="px-6 font-black text-lg">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="p-3 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-400 hover:text-black">
                  <Plus size={20} strokeWidth={3} />
                </button>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="p-5 text-red-500 hover:bg-red-50 rounded-[1.5rem] transition-all">
                <Trash2 size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-black text-white p-10 rounded-[3.5rem] flex flex-col md:flex-row justify-between items-center shadow-2xl shadow-blue-200 gap-8">
        <div>
          <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-2">ИТОГО К ОПЛАТЕ</p>
          <p className="text-5xl font-black italic tracking-tighter">{totalPrice.toLocaleString()} <span className="text-blue-500">₴</span></p>
        </div>
        <Link to="/checkout" className="group bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black text-xl uppercase italic hover:bg-white hover:text-black transition-all flex items-center gap-4">
          ОФОРМИТЬ <ArrowRight className="group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    </div>
  );
};