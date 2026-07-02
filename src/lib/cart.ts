import { apiService, Cart } from "@/services/api";

const STORAGE_KEY = "futurefoods.guestCart";
const CART_EVENT = "futurefoods:cart-changed";

export type CartProductInput = {
  _id: string;
  name: string;
  imageUrl?: string;
  pricePaise: number;
  slug?: string;
};

type StoredCartItem = {
  _id: string;
  name: string;
  imageUrl: string;
  pricePaise: number;
  slug?: string;
  quantity: number;
};

function readStoredItems(): StoredCartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredItems(items: StoredCartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function getLocalCart(): Cart {
  const items = readStoredItems().map((it) => ({
    _id: it._id,
    product: {
      _id: it._id,
      name: it.name,
      imageUrl: it.imageUrl,
      pricePaise: it.pricePaise,
    },
    quantity: it.quantity,
  }));
  return { _id: "guest-cart", user: "guest", items } as Cart;
}

export function getCartCount(): number {
  return readStoredItems().reduce((total, it) => total + it.quantity, 0);
}

export function addToCart(product: CartProductInput, quantity = 1) {
  const items = readStoredItems();
  const index = items.findIndex((it) => it._id === product._id);
  if (index >= 0) {
    items[index].quantity += quantity;
  } else {
    items.push({
      _id: product._id,
      name: product.name,
      imageUrl: product.imageUrl || "",
      pricePaise: product.pricePaise,
      slug: product.slug,
      quantity,
    });
  }
  writeStoredItems(items);
}

export function updateCartItem(productId: string, quantity: number) {
  const items = readStoredItems();
  const index = items.findIndex((it) => it._id === productId);
  if (index < 0) return;
  if (quantity < 1) {
    items.splice(index, 1);
  } else {
    items[index].quantity = quantity;
  }
  writeStoredItems(items);
}

export function removeCartItem(productId: string) {
  writeStoredItems(readStoredItems().filter((it) => it._id !== productId));
}

export function clearCart() {
  writeStoredItems([]);
}

export function subscribeCart(callback: () => void) {
  const handler = () => callback();
  window.addEventListener(CART_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CART_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export async function syncCartToServer() {
  const items = readStoredItems();
  try {
    await apiService.clearCart();
  } catch {}
  for (const it of items) {
    await apiService.addToCart(it._id, it.quantity);
  }
}
