import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, IProduct, IProductVariant } from '@/types';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ product: IProduct; quantity: number; variant?: IProductVariant }>) {
      const { product, quantity, variant } = action.payload;
      const existing = state.items.find(
        (i) => i.product._id === product._id && JSON.stringify(i.variant) === JSON.stringify(variant)
      );
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, quantity, variant });
      }
    },
    removeFromCart(state, action: PayloadAction<{ productId: string; variant?: IProductVariant }>) {
      state.items = state.items.filter(
        (i) =>
          !(i.product._id === action.payload.productId &&
            JSON.stringify(i.variant) === JSON.stringify(action.payload.variant))
      );
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number; variant?: IProductVariant }>
    ) {
      const item = state.items.find(
        (i) =>
          i.product._id === action.payload.productId &&
          JSON.stringify(i.variant) === JSON.stringify(action.payload.variant)
      );
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
