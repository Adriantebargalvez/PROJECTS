import { Routes } from '@angular/router';

// Lazy-loading: cada ruta carga su chunk sólo cuando el usuario la visita.
// Esto reduce considerablemente el bundle inicial que el navegador descarga al entrar.
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    title: 'TempoLux',
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./catalog/catalog.component').then(m => m.CatalogComponent),
    title: 'Catalogo | TempoLux',
  },
  {
    path: 'personalizar',
    loadComponent: () =>
      import('./watch-customizer/watch-customizer.component').then(m => m.WatchCustomizerComponent),
    title: 'Diseña tu reloj | TempoLux',
  },
  {
    path: 'accesorios',
    loadComponent: () =>
      import('./accessories/accessories.component').then(m => m.AccessoriesComponent),
    title: 'Accesorios | TempoLux',
  },
  {
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent),
    title: 'Checkout | TempoLux',
  },
  {
    // Ruta comodín: cualquier URL desconocida redirige a la portada
    path: '**',
    redirectTo: '',
  },
];
