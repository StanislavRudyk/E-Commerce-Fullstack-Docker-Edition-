import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as CartItem[], totalAmount: 0 },
  reducers: {
    addToCart: (state, action: PayloadAction<any>) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.totalAmount = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    },
    updateQty: (state, action: PayloadAction<{id: number, qty: number}>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) item.quantity = action.payload.qty;
      state.totalAmount = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      state.totalAmount = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    }
  }
});

export const { addToCart, updateQty, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;