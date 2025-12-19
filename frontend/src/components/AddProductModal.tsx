import React, { useState } from 'react';
import { X, Package, DollarSign, Image as ImageIcon, Loader2 } from 'lucide-react';

export const AddProductModal = ({ onClose }: { onClose: () => void }) => {
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);

    const productData = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')), 
      stock_quantity: Number(formData.get('stock')), 
      image_url: formData.get('image') as string || "",
      description: formData.get('desc') as string || "",
      category_id: 1 
    };

    try {
      const response = await fetch('http://localhost:8000/api/v1/products/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert("Товар успешно добавлен!");
        onClose();
        window.location.reload(); 
      } else {
        const err = await response.json();
        alert("Ошибка бэкенда: " + JSON.stringify(err.detail));
      }
    } catch (error) {
      alert("Нет связи с бэкендом (проверь Docker/Terminal)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 relative shadow-2xl">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-black">
          <X size={28} />
        </button>
        <h2 className="text-3xl font-black mb-8 text-gray-900">Новый товар</h2>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="relative">
            <Package className="absolute left-4 top-4 text-gray-400" size={20} />
            <input name="name" required className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 text-black" placeholder="Название товара" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <DollarSign className="absolute left-4 top-4 text-gray-400" size={20} />
              <input name="price" type="number" required className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none text-black" placeholder="Цена" />
            </div>
            <input name="stock" type="number" required className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none text-black" placeholder="Кол-во" />
          </div>
          <div className="relative">
            <ImageIcon className="absolute left-4 top-4 text-gray-400" size={20} />
            <input name="image" className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none text-black" placeholder="URL изображения" />
          </div>
          <textarea name="desc" className="w-full p-6 rounded-2xl border border-gray-100 bg-gray-50 outline-none h-32 text-black" placeholder="Описание товара"></textarea>
          
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all flex justify-center">
            {loading ? <Loader2 className="animate-spin" /> : 'СОХРАНИТЬ ТОВАР'}
          </button>
        </form>
      </div>
    </div>
  );
};