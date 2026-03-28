import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const CART_STORAGE_KEY = 'bookstore_cart';

/** Saved whenever the user adds to cart; used by Continue shopping. */
export const CONTINUE_SNAPSHOT_KEY = 'bookstore_continue_snapshot';

export type ListSnapshot = {
  category: string;
  pageNum: number;
  pageSize: number;
  sortOrder: 'asc' | 'desc';
};

export type CartBook = {
  bookId: number;
  title: string;
  author: string;
  price: number;
};

export type CartItem = CartBook & { quantity: number };

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function saveSnapshot(snapshot: ListSnapshot) {
  sessionStorage.setItem(CONTINUE_SNAPSHOT_KEY, JSON.stringify(snapshot));
}

type CartContextValue = {
  items: CartItem[];
  addToCart: (book: CartBook, listSnapshot: ListSnapshot) => void;
  setLineQuantity: (bookId: number, quantity: number) => void;
  totalItemCount: number;
  cartTotal: number;
  lineSubtotal: (item: CartItem) => number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());

  const addToCart = useCallback(
    (book: CartBook, listSnapshot: ListSnapshot) => {
      saveSnapshot(listSnapshot);
      setItems((prev) => {
        const existing = prev.find((i) => i.bookId === book.bookId);
        let next: CartItem[];
        if (existing) {
          next = prev.map((i) =>
            i.bookId === book.bookId ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          next = [...prev, { ...book, quantity: 1 }];
        }
        saveCartToStorage(next);
        return next;
      });
    },
    []
  );

  const setLineQuantity = useCallback((bookId: number, quantity: number) => {
    setItems((prev) => {
      const q = Math.max(0, Math.floor(quantity));
      let next: CartItem[];
      if (q === 0) {
        next = prev.filter((i) => i.bookId !== bookId);
      } else {
        next = prev.map((i) =>
          i.bookId === bookId ? { ...i, quantity: q } : i
        );
      }
      saveCartToStorage(next);
      return next;
    });
  }, []);

  const lineSubtotal = useCallback((item: CartItem) => {
    return item.price * item.quantity;
  }, []);

  const totalItemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const cartTotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addToCart,
      setLineQuantity,
      totalItemCount,
      cartTotal,
      lineSubtotal,
    }),
    [items, addToCart, setLineQuantity, totalItemCount, cartTotal, lineSubtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
