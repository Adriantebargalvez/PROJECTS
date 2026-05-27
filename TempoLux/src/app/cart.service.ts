import { Injectable, computed, signal } from '@angular/core';
import { Watch } from './watch';

export interface CartItem {
  watch: Watch;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  // Cargamos el carrito guardado en localStorage para que no se pierda al recargar la página
  readonly items = signal<CartItem[]>(this.loadCart());
  readonly count = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));
  readonly total = computed(() => this.items().reduce((acc, item) => acc + item.watch.price * item.quantity, 0));
  readonly isOpen = signal(false);

  private loadCart(): CartItem[] {
    try {
      const saved = localStorage.getItem('tempolux-cart');
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      // Si el JSON está corrupto simplemente arrancamos con el carrito vacío
      return [];
    }
  }

  private saveCart(): void {
    localStorage.setItem('tempolux-cart', JSON.stringify(this.items()));
  }

  add(watch: Watch): void {
    const current = this.items();
    const idx = current.findIndex(i => i.watch.slug === watch.slug || i.watch.id === watch.id);
    if (idx >= 0) {
      // Ya está en el carrito: actualizamos sus datos visuales e incrementamos cantidad.
      const updated = [...current];
      updated[idx] = { watch, quantity: updated[idx].quantity + 1 };
      this.items.set(updated);
    } else {
      this.items.set([...current, { watch, quantity: 1 }]);
    }
    this.saveCart();
    this.isOpen.set(true);
  }

  remove(watchId: number): void {
    this.items.set(this.items().filter(i => i.watch.id !== watchId));
    this.saveCart();
  }

  update(watchId: number, qty: number): void {
    if (qty <= 0) {
      this.remove(watchId);
      return;
    }
    this.items.set(this.items().map(i => i.watch.id === watchId ? { ...i, quantity: qty } : i));
    this.saveCart();
  }

  clear(): void {
    this.items.set([]);
    this.saveCart();
  }

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
