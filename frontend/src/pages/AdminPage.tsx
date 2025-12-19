import React, { useState, useEffect } from 'react';
import { 
  Plus, Loader2, Trash2, Edit3, FolderPlus, 
  X, ShoppingBag, CheckCircle, Clock, Truck, AlertCircle
} from 'lucide-react'; 
import AddProductModal from "../components/Modal";

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'categories'>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(savedUser);
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'products' ? 'products' : 
                       activeTab === 'orders' ? 'orders' : 'categories';
      const res = await fetch(`http://localhost:8000/api/v1/${endpoint}/`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (activeTab === 'products') setProducts(data);
        if (activeTab === 'orders') setOrders(data);
        if (activeTab === 'categories') setCategories(data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingCategory 
      ? `http://localhost:8000/api/v1/categories/${editingCategory.id}`
      : 'http://localhost:8000/api/v1/categories/';
    try {
      const res = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name: newCategoryName })
      });
      if (res.ok) {
        setNewCategoryName(''); setEditingCategory(null);
        setIsCategoryModalOpen(false); fetchData();
      }
    } catch (err) { alert('Ошибка сохранения'); }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/orders/${orderId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchData();
    } catch (err) { alert('Ошибка статуса'); }
  };

  const handleDelete = async (type: string, id: number) => {
    if (!window.confirm('Удалить этот элемент?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/${type}/${id}`, { 
        method: 'DELETE', headers: getHeaders() 
      });
      if (res.ok) fetchData();
    } catch (err) { alert('Ошибка при удалении'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-12 px-6 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="text-center md:text-left">
            <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-1 ${user?.is_admin ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {user?.is_admin ? 'ADMIN ACCESS' : 'CLIENT'}
            </span>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Управление Магазином</h1>
          </div>
          
          <div className="flex bg-gray-100 p-1.5 rounded-2xl">
            {(['products', 'orders', 'categories'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl font-black uppercase text-xs transition-all ${
                  activeTab === tab ? 'bg-white shadow-md text-blue-600 scale-105' : 'text-gray-400 hover:text-black'
                }`}
              >
                {tab === 'products' ? 'Товары' : tab === 'orders' ? 'Заказы' : 'Категории'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
        ) : (
          <div className="animate-in fade-in duration-400 slide-in-from-bottom-2">
            
            {/* ТОВАРЫ */}
            {activeTab === 'products' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <button 
                  onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} 
                  className="aspect-[4/5] border-4 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all bg-white group"
                >
                  <Plus size={48} className="group-hover:scale-110 transition-transform" />
                  <span className="font-black text-xs uppercase tracking-widest">Новый товар</span>
                </button>

                {products.map(p => (
                  <div key={p.id} className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-gray-100 flex flex-col group transition-all hover:shadow-xl">
                     <div className="relative mb-5 overflow-hidden rounded-3xl">
                        <img src={p.image_url} alt="" className="w-full aspect-square object-cover" />
                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="bg-white/90 backdrop-blur p-3 rounded-2xl text-blue-600 shadow-xl hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={18} /></button>
                           <button onClick={() => handleDelete('products', p.id)} className="bg-white/90 backdrop-blur p-3 rounded-2xl text-red-500 shadow-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                        </div>
                     </div>
                     <h4 className="font-black text-lg uppercase italic truncate leading-tight mb-1">{p.name}</h4>
                     <p className="text-gray-400 text-xs font-medium line-clamp-2 min-h-[2.5rem] leading-snug mb-4">{p.description}</p>
                     <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
                        <span className="text-blue-600 font-black text-2xl">{p.price} ₴</span>
                        <span className="text-[10px] font-black bg-gray-50 px-3 py-1.5 rounded-full text-gray-400 border uppercase">Сток: {p.stock_quantity}</span>
                     </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                      <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 shadow-sm"><ShoppingBag size={28} /></div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                           <span className="text-xs font-black text-gray-300">ЗАКАЗ #{order.id}</span>
                           <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="text-[10px] font-black uppercase bg-blue-50 text-blue-600 border rounded-lg px-2 py-1 outline-none cursor-pointer"
                           >
                              <option value="pending">⏳ Ожидание</option>
                              <option value="shipped">🚀 В пути</option>
                              <option value="delivered">✅ Готов</option>
                           </select>
                        </div>
                        <h3 className="font-black text-xl uppercase italic">{order.customer_name}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                        <span className="font-black text-blue-600 text-2xl">{order.total_amount} ₴</span>
                        <button onClick={() => handleDelete('orders', order.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={22} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'categories' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <button onClick={() => { setEditingCategory(null); setNewCategoryName(''); setIsCategoryModalOpen(true); }} className="p-8 border-4 border-dashed border-gray-200 rounded-[2.5rem] flex items-center justify-center gap-4 text-gray-400 hover:text-blue-600 bg-white transition-all font-black uppercase text-lg">
                  <FolderPlus size={28} /> Добавить категорию
                </button>
                {categories.map(cat => (
                  <div key={cat.id} className="bg-white p-6 rounded-[2.5rem] flex justify-between items-center shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-5">
                      <span className="w-12 h-12 flex items-center justify-center bg-gray-50 text-blue-600 rounded-2xl font-black text-lg">#{cat.id}</span>
                      <span className="font-black uppercase text-xl italic tracking-tight">{cat.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingCategory(cat); setNewCategoryName(cat.name); setIsCategoryModalOpen(true); }} className="p-4 bg-gray-50 text-gray-300 hover:text-blue-500 rounded-2xl transition-all"><Edit3 size={20} /></button>
                      <button onClick={() => handleDelete('categories', cat.id)} className="p-4 bg-gray-50 text-gray-300 hover:text-red-500 rounded-2xl transition-all"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <AddProductModal 
          onClose={() => { setIsModalOpen(false); setEditingProduct(null); fetchData(); }} 
          initialData={editingProduct} 
        />
      )}

      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl">
            <h3 className="text-2xl font-black uppercase italic mb-8">{editingCategory ? 'Изменить' : 'Новая'} категория</h3>
            <form onSubmit={handleCategorySubmit} className="space-y-6">
              <input 
                autoFocus type="text" 
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-2xl p-5 text-lg font-bold outline-none transition-all shadow-inner"
                placeholder="Название..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg uppercase italic hover:bg-black transition-all shadow-xl shadow-blue-200">
                {editingCategory ? 'Обновить' : 'Создать'} ⚡
              </button>
              <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="w-full text-gray-400 font-bold uppercase text-xs text-center mt-2">Отмена</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};