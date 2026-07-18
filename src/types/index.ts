export interface IAddress {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  address: IAddress[];
  createdAt: string;
}

export interface IProductVariant {
  size?: string;
  strength?: string;
  price?: number;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: string | ICategory;
  images: string[];
  variants: IProductVariant[];
  rating: number;
  sold: number;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface IOrderItem {
  product: string | IProduct;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: IProductVariant;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'midtrans' | 'qris';

export interface IOrder {
  _id: string;
  userId: string | IUser;
  items: IOrderItem[];
  totalPrice: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  midtransTransactionId?: string;
  shippingAddress: IAddress;
  createdAt: string;
}

export interface CartItem {
  product: IProduct;
  quantity: number;
  variant?: IProductVariant;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
