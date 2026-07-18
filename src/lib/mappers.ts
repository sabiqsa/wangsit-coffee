import type { Database } from '@/types/supabase';
import type { IAddress, ICategory, IOrder, IOrderItem, IProduct, IProductVariant, IUser } from '@/types';

type CategoryRow = Database['public']['Tables']['categories']['Row'];
type ProductRow = Database['public']['Tables']['products']['Row'];
type OrderRow = Database['public']['Tables']['orders']['Row'];
type OrderItemRow = Database['public']['Tables']['order_items']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export function mapProfile(row: ProfileRow): IUser {
  return {
    _id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as IUser['role'],
    address: (row.addresses as IAddress[] | null) ?? [],
    createdAt: row.created_at,
  };
}

export function mapCategory(row: CategoryRow): ICategory {
  return { _id: row.id, name: row.name, slug: row.slug, image: row.image };
}

export function mapProduct(
  row: ProductRow & { categories?: CategoryRow | null }
): IProduct {
  return {
    _id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: Number(row.price),
    stock: row.stock,
    category: row.categories ? mapCategory(row.categories) : row.category_id,
    images: row.images ?? [],
    variants: (row.variants as IProductVariant[] | null) ?? [],
    rating: Number(row.rating),
    sold: row.sold,
  };
}

export function mapOrderItem(row: OrderItemRow): IOrderItem {
  return {
    product: row.product_id ?? '',
    name: row.name,
    image: row.image,
    price: Number(row.price),
    quantity: row.quantity,
    variant: (row.variant as IProductVariant | null) ?? undefined,
  };
}

export function mapOrder(
  row: OrderRow & { order_items?: OrderItemRow[]; profiles?: ProfileRow | null }
): IOrder {
  return {
    _id: row.id,
    userId: row.profiles ? mapProfile(row.profiles) : row.user_id,
    items: (row.order_items ?? []).map(mapOrderItem),
    totalPrice: Number(row.total_price),
    status: row.status as IOrder['status'],
    paymentMethod: row.payment_method as IOrder['paymentMethod'],
    midtransTransactionId: row.midtrans_transaction_id ?? undefined,
    shippingAddress: row.shipping_address as unknown as IOrder['shippingAddress'],
    createdAt: row.created_at,
  };
}
