import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import Navbar from './Navbar';

const Catalog = () => {
  const [products, setProducts] = useState([]);

{products.map((product) => (
  <ProductCard 
    key={product.id} 
    product={product} 
    onAddToCart={(p) => console.log('Клик по товару:', p.name)} 
  />
))}

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/products/')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setProducts(data);
        else setProducts([demoProduct]);
      })
      .catch(() => setProducts([demoProduct]));
  }, []);

  const handleAddToCart = (product) => {
    alert(`Добавлено в корзину: ${product.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-black text-center mb-12">Каталог товаров</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;