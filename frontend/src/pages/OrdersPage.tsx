import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Loader2, 
  ShoppingBag, 
  Calendar,
  MapPin,
  CreditCard
} from 'lucide-react';

export const OrdersPage = () => {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'В обробці', 
          color: 'text-amber-500 bg-amber-50', 
          icon: <Clock size={20} />,
          borderColor: 'border-amber-100'
        };
      case 'shipped':
        return { 
          label: 'Відправлено', 
          color: 'text-blue-500 bg-blue-50', 
          icon: <Truck size={20} />,
          borderColor: 'border-blue-100'
        };
      case 'delivered':
        return { 
          label: 'Доставлено', 
          color: 'text-green-500 bg-green-50', 
          icon: <CheckCircle2 size={20} />,
          borderColor: 'border-green-100'
        };
      case 'cancelled':
        return { 
          label: 'Скасовано', 
          color: 'text-red-500 bg-red-50', 
          icon: <XCircle size={20} />,
          borderColor: 'border-red-100'
        };
      default:
        return { 
          label: 'Очікування', 
          color: 'text-gray-500 bg-gray-50', 
          icon: <Package size={20} />,
          borderColor: 'border-gray-100'
        };
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setLoading(true);
    setSearched(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:8000/api/v1/orders/`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Помилка доступу');

      const data = await response.json();
      const allOrders = Array.isArray(data) ? data : (data.items || []);
      const myOrders = allOrders.filter((order: any) => 
        order.customer_phone?.includes(phone) || 
        order.customer_email?.toLowerCase().includes(phone.toLowerCase())
      );
      
      setOrders(myOrders);
    } catch (err) {
      console.error("Помилка при пошуку замовлень:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-4">
          Мои <span className="text-blue-600">Заказы</span>
        </h1>
        <p className="text-gray-400 font-medium uppercase tracking-widest text-sm">
        Введите телефонный номер для отслеживания статуса
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-16">
        <div className="relative group">
          <input
            type="text"
            placeholder="Например: +380..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-white border-2 border-gray-100 rounded-[2.5rem] py-6 px-10 text-xl font-bold outline-none focus:border-blue-600 focus:shadow-2xl focus:shadow-blue-100 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 top-3 bottom-3 bg-black hover:bg-blue-600 text-white px-10 rounded-[2rem] font-black uppercase italic transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
            Поиск
          </button>
        </div>
      </form>

      <div className="space-y-8">
        {!searched && (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-400 font-bold uppercase italic">Ваши заказы появятся здесь</p>
          </div>
        )}

        {searched && orders.length === 0 && !loading && (
          <div className="text-center py-20 bg-red-50 rounded-[3rem] border-2 border-red-100">
            <XCircle className="mx-auto text-red-300 mb-4" size={64} />
            <p className="text-red-500 font-black uppercase italic">Заказов не найдено</p>
            <p className="text-red-400 text-sm mt-2">Проверьте правильность номера</p>
          </div>
        )}

        {orders.map((order) => {
          const status = getStatusDetails(order.status);
          return (
            <div 
              key={order.id} 
              className={`bg-white border-2 ${status.borderColor} p-8 rounded-[3rem] shadow-sm hover:shadow-xl transition-all animate-in fade-in slide-in-from-bottom-4 duration-500`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-gray-50 pb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-black text-black italic tracking-tighter uppercase">
                      Заказ #{order.id}
                    </span>
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-black uppercase text-[10px] ${status.color}`}>
                      {status.icon}
                      {status.label}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-gray-400 text-sm font-bold uppercase italic">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14}/> {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Невідомо'}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Итого к оплате</p>
                  <p className="text-4xl font-black italic text-blue-600">{order.total_amount} ₴</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Адрес доставки</p>
                      <p className="font-bold text-gray-800">{order.delivery_address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Способ оплаты</p>
                      <p className="font-bold text-gray-800">При получении</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-[2rem] p-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Данные получателя</p>
                  <div className="space-y-2">
                    <p className="font-bold uppercase italic text-sm">{order.customer_name}</p>
                    <p className="font-medium text-gray-500 text-sm">{order.customer_phone}</p>
                    <p className="font-medium text-gray-500 text-sm">{order.customer_email}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};