import { IProduct } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: IProduct[];
  columns?: 3 | 4;
}

export default function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  return (
    <div className={`grid grid-cols-2 ${columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10`}>
      {products.map((product, i) => (
        <div key={product._id} className="reveal" style={{ '--i': i % 8 } as React.CSSProperties}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
