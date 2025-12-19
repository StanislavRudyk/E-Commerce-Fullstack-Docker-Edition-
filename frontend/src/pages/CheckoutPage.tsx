import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, CreditCard } from 'lucide-react';

export const CheckoutPage = () => {
  const { cartItems, totalPrice, setCartItems } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const savedName = localStorage.getItem('userName') || '';
  const savedEmail = localStorage.getItem('userEmail') || '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    const formData = new FormData(e.currentTarget);
    
    const orderData = {
      customer_name: formData.get('name') as string,
      customer_email: formData.get('email') as string,
      customer_phone: formData.get('phone') as string,
      delivery_address: formData.get('address') as string,
      total_amount: Number(totalPrice), 
      items: cartItems.map((item: any) => ({
        product_id: Number(item.id), 
        quantity: Number(item.quantity),
        unit_price: Number(item.price)
      }))
    };

    try {
      const response = await fetch('http://localhost:8000/api/v1/orders/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setIsSuccess(true);
        setCartItems([]);
      } else {
        const errorDetail = await response.json();
        alert(errorDetail.detail || "Помилка при створенні замовлення");
      }
    } catch (err) {
      alert("Сервер не відповідає");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="bg-green-100 p-6 rounded-full text-green-600 mb-6">
          <CheckCircle2 size={80} />
        </div>
        <h1 className="text-4xl font-black uppercase italic mb-4">Замовлення прийнято!</h1>
        <button onClick={() => navigate('/')} className="bg-black text-white px-10 py-4 rounded-2xl font-black uppercase italic">
          На головну
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 py-10 px-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="text-4xl font-black uppercase italic mb-10">Оформлення</h1>
        <input name="name" defaultValue={savedName} required className="w-full px-6 py-4 rounded-2xl border" placeholder="Ім'я" />
        <input name="email" type="email" defaultValue={savedEmail} required className="w-full px-6 py-4 rounded-2xl border" placeholder="Email" />
        <input name="phone" type="tel" required className="w-full px-6 py-4 rounded-2xl border" placeholder="Телефон" />
        <textarea name="address" required className="w-full px-6 py-4 rounded-2xl border h-32" placeholder="Адреса"></textarea>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black uppercase italic">
          {loading ? <Loader2 className="animate-spin" /> : "Підтвердити замовлення"}
        </button>
      </form>
      <div className="bg-gray-50 rounded-[3rem] p-10 border">
        <h2 className="text-2xl font-black uppercase italic mb-8">Ваш кошик</h2>
        {cartItems.map((item: any) => (
          <div key={item.id} className="flex justify-between font-bold mb-4">
            <span>{item.name} x {item.quantity}</span>
            <span>{item.price * item.quantity} грн</span>
          </div>
        ))}
        <div className="border-t pt-4 text-2xl font-black flex justify-between">
          <span>Разом</span>
          <span className="text-blue-600">{totalPrice} грн</span>
        </div>
      </div>
    </div>
  );
};