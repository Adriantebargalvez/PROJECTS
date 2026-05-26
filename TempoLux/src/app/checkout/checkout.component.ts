import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../cart.service';
import { LanguageService } from '../language.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  readonly cart = inject(CartService);
  readonly language = inject(LanguageService);

  readonly isProcessing = signal(false);
  readonly isSuccess = signal(false);
  readonly orderNumber = signal('');

  cardNumber = '';
  cardExpiry = '';

  get subtotal(): number {
    return this.cart.total();
  }

  get tax(): number {
    return Math.round(this.subtotal * 0.21);
  }

  get shipping(): number {
    return 0;
  }

  get orderTotal(): number {
    return this.subtotal + this.tax;
  }

  formatPrice(amount: number): string {
    return new Intl.NumberFormat(this.language.language() === 'es' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/\D/g, '').slice(0, 16);
    this.cardNumber = raw.replace(/(.{4})/g, '$1 ').trim();
    input.value = this.cardNumber;
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/\D/g, '').slice(0, 4);
    this.cardExpiry = raw.length >= 3 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw;
    input.value = this.cardExpiry;
  }

  placeOrder(): void {
    this.isProcessing.set(true);
    setTimeout(() => {
      this.isProcessing.set(false);
      this.isSuccess.set(true);
      this.orderNumber.set('TL-' + Math.floor(100000 + Math.random() * 900000));
      this.cart.clear();
    }, 2200);
  }
}
