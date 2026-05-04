import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  image?: string;
  description?: string;
}

interface CartStore {
  items: CartItem[];
  restaurantId: string | null;
  
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,

      addItem: (item) => {
        const { items, restaurantId } = get();
        
        // Check if adding from different restaurant
        if (restaurantId && restaurantId !== item.restaurantId) {
          const confirmed = window.confirm(
            'Your cart contains items from another restaurant. Do you want to clear it and add this item?'
          );
          if (!confirmed) return;
          
          set({ items: [], restaurantId: null });
        }

        // Check if item already exists
        const existingItem = items.find((i) => i.id === item.id);
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
          toast.success(`${item.name} quantity updated`);
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }],
            restaurantId: item.restaurantId,
          });
          toast.success(`${item.name} added to cart`);
        }
      },

      removeItem: (id) => {
        const { items } = get();
        const item = items.find((i) => i.id === id);
        
        set({
          items: items.filter((i) => i.id !== id),
          restaurantId: items.length === 1 ? null : get().restaurantId,
        });
        
        if (item) {
          toast.success(`${item.name} removed from cart`);
        }
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => {
        set({ items: [], restaurantId: null });
        toast.success('Cart cleared');
      },

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
