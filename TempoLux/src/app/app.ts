import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartDrawerComponent } from './cart-drawer/cart-drawer.component';
import { CartService } from './cart.service';
import { LanguageService } from './language.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, CartDrawerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly language = inject(LanguageService);
  readonly cart = inject(CartService);
}
