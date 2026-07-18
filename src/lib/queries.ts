import { createClient } from '@/lib/supabase/client';
import { mapCategory, mapOrder, mapProduct } from '@/lib/mappers';
import type { ICategory, IOrder, IProduct, PaginatedResult } from '@/types';

export async function getCategories(): Promise<ICategory[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw new Error(error.message);
  return data.map(mapCategory);
}

interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function getProducts({
  page = 1,
  limit = 12,
  search = '',
  categorySlug = '',
  sortField = 'created_at',
  sortOrder = 'desc',
}: GetProductsParams): Promise<PaginatedResult<IProduct>> {
  const supabase = createClient();

  let query = supabase.from('products').select('*, categories(*)', { count: 'exact' });

  if (search.trim()) {
    query = query.textSearch('search_vector', search.trim(), { type: 'plain', config: 'simple' });
  }

  if (categorySlug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();
    query = query.eq('category_id', category?.id ?? '00000000-0000-0000-0000-000000000000');
  }

  const columnMap: Record<string, string> = {
    createdAt: 'created_at',
    price: 'price',
    rating: 'rating',
    sold: 'sold',
  };
  const column = columnMap[sortField] ?? 'created_at';

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query
    .order(column, { ascending: sortOrder === 'asc' })
    .range(from, to);

  if (error) throw new Error(error.message);

  const total = count ?? 0;
  return {
    data: data.map(mapProduct),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getOrders({
  page = 1,
  limit = 10,
}: { page?: number; limit?: number } = {}): Promise<PaginatedResult<IOrder>> {
  const supabase = createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // RLS scopes this to the caller's own orders unless they're an admin.
  const { data, error, count } = await supabase
    .from('orders')
    .select('*, order_items(*), profiles(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  const total = count ?? 0;
  return {
    data: data.map(mapOrder),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getProductBySlug(slug: string): Promise<IProduct | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapProduct(data) : null;
}

export async function getRelatedProducts(categoryId: string, excludeProductId: string, limit = 4): Promise<IProduct[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('category_id', categoryId)
    .neq('id', excludeProductId)
    .limit(limit);
  if (error) throw new Error(error.message);
  return data.map(mapProduct);
}
