import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { LanguageService } from '../language.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.css',
})
export class CartDrawerComponent {
  readonly cart = inject(CartService);
  readonly language = inject(LanguageService);
  private readonly router = inject(Router);

  formatPrice(price: number): string {
    return new Intl.NumberFormat(this.language.language() === 'es' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  }

  goToCheckout(): void {
    this.cart.close();
    this.router.navigate(['/checkout']);
  }
}
