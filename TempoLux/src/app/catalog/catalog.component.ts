import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ContactPanelComponent } from '../contact-panel/contact-panel.component';
import { CartService } from '../cart.service';
import { LanguageService } from '../language.service';
import { Watch } from '../watch';
import { WatchCatalogService } from '../watch-catalog.service';

@Component({
  selector: 'app-catalog',
  imports: [CommonModule, ContactPanelComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
})
export class CatalogComponent implements OnInit, OnDestroy {
  private readonly catalogService = inject(WatchCatalogService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  readonly language = inject(LanguageService);
  readonly watches = signal<Watch[]>([]);
  readonly selectedWatch = signal<Watch | null>(null);
  readonly isLoading = signal(true);
  readonly hasError = signal(false);
  readonly justAdded = signal<number | null>(null);

  // Guardamos la referencia del timeout para cancelarlo si el componente se destruye antes
  private justAddedTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    // Pedimos el catálogo al arrancar — shareReplay en el servicio garantiza una sola petición HTTP
    this.catalogService.getWatches().subscribe({
      next: (watches) => {
        this.watches.set(watches);
        this.selectedWatch.set(watches[0] ?? null);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    // Evita que el callback del timeout intente actualizar una señal de un componente ya destruido
    clearTimeout(this.justAddedTimeout);
  }

  selectWatch(watch: Watch): void {
    this.selectedWatch.set(watch);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Añade el reloj al carrito y lleva directamente al checkout
  buyNow(watch: Watch): void {
    this.cartService.add(watch);
    this.router.navigate(['/checkout']);
  }

  addToCart(watch: Watch): void {
    this.cartService.add(watch);
    this.justAdded.set(watch.id);
    // Mostramos el feedback “añadido” 1.8 s; cancelamos cualquier timeout previo para no acumularlos
    clearTimeout(this.justAddedTimeout);
    this.justAddedTimeout = setTimeout(() => this.justAdded.set(null), 1800);
  }

  watchMaterials(watch: Watch): string[] {
    return watch.materials[this.language.language()];
  }
}
