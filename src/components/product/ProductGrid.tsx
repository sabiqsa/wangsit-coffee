import { IProduct } from '@/types';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }: { products: IProduct[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
