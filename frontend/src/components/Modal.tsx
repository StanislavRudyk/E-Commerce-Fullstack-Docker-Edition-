import React, { useState, useEffect } from 'react';
import { X, Package, Tag, Layers, DollarSign, Image as ImageIcon } from 'lucide-react';

interface ModalProps {
  onClose: () => void;
  initialData?: any; 
}

const Modal: React.FC<ModalProps> = ({ onClose, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    image_url: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price?.toString() || '',
        stock_quantity: initialData.stock_quantity?.toString() || '',
        category_id: initialData.category_id?.toString() || '',
        image_url: initialData.image_url || ''
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    const isEdit = !!initialData;
    const url = isEdit 
      ? `http://localhost:8000/api/v1/products/${initialData.id}` 
      : 'http://localhost:8000/api/v1/products/';
    
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        category_id: parseInt(formData.category_id) || 0,
        image_url: formData.image_url || ""
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        onClose();
        window.location.reload(); 
      } else {
        console.error("Ошибка бэкенда:", result);
        const errorMsg = Array.isArray(result.detail) 
          ? result.detail[0].msg 
          : result.detail || "Неизвестная ошибка сервера";
        alert(`Ошибка: ${errorMsg}`);
      }
    } catch (err) {
      console.error("Сетевая ошибка:", err);
      alert('Сетевая ошибка: Бэкенд недоступен или CORS заблокирован из-за ошибки 500 на сервере.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-[3.5rem] p-12 shadow-2xl relative border border-gray-100">
        
        <button 
          onClick={onClose} 
          className="absolute top-10 right-10 text-gray-300 hover:text-red-500 hover:rotate-90 transition-all duration-300"
        >
          <X size={36} strokeWidth={3} />
        </button>
        <div className="mb-10">
          <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
            {initialData ? 'Изменить' : 'Новый'} <span className="text-blue-600 font-black">Товар</span>
          </h3>
          <div className="h-2 w-20 bg-blue-600 mt-3 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Package className="absolute left-5 top-5 text-gray-300" size={20} />
            <input 
              required
              type="text" 
              placeholder="Название товара"
              className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-2xl p-5 pl-14 text-sm font-bold outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <textarea 
            placeholder="Описание товара"
            className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-2xl p-5 text-sm font-bold outline-none transition-all h-32 resize-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />

          <div className="grid grid-cols-2 gap-5">
            <div className="relative">
              <DollarSign className="absolute left-5 top-5 text-gray-300" size={20} />
              <input 
                required
                type="number" 
                step="0.01"
                placeholder="Цена (₴)"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-2xl p-5 pl-14 text-sm font-bold outline-none transition-all"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="relative">
              <Tag className="absolute left-5 top-5 text-gray-300" size={20} />
              <input 
                required
                type="number" 
                placeholder="Сток"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-2xl p-5 pl-14 text-sm font-bold outline-none transition-all"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <Layers className="absolute left-5 top-5 text-gray-300" size={20} />
              <input 
                required
                type="number" 
                placeholder="ID категории"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-2xl p-5 pl-14 text-sm font-bold outline-none transition-all"
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              />
            </div>
            <div className="relative">
              <ImageIcon className="absolute left-5 top-5 text-gray-300" size={20} />
              <input 
                type="text" 
                placeholder="URL изображения"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-2xl p-5 pl-14 text-sm font-bold outline-none transition-all"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl uppercase italic hover:bg-black transition-all shadow-2xl shadow-blue-100 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Синхронизация...' : initialData ? 'Обновить товар ⚡' : 'Добавить на витрину 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;