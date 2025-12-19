import React from 'react';
import ProductCard from '../components/ProductCard';

interface CatalogPageProps {
  products: any[];
}

const CatalogPage = ({ products }: CatalogPageProps) => {
  return (
    <div className="animate-in fade-in duration-700 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] block mb-3">NEW COLLECTION 2025</span>
          <h1 className="text-6xl font-black italic uppercase tracking-tighter text-black leading-none">
            КАТАЛОГ <span className="text-gray-200">ТОВАРОВ</span>
          </h1>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[4rem] border border-gray-100 shadow-inner">
            <p className="text-3xl font-black text-gray-200 uppercase italic tracking-tighter">
              В этой категории пока пусто
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;