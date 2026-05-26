import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { App } from './app';
import { routes } from './app.routes';
import { Watch } from './watch';
import { WatchCatalogService } from './watch-catalog.service';
import { provideRouter } from '@angular/router';

// Datos mock del catálogo — deben coincidir con los nombres actuales del backend
const watches: Watch[] = [
  {
    id: 1,
    slug: 'aurora-regulator',
    imageUrl: '/assets/watches/aurora-regulator.webp',
    price: 12800,
    currency: 'EUR',
    name: {
      es: 'Aurora Diver',
      en: 'Aurora Diver',
    },
    description: {
      es: 'Reloj de buceo de precision.',
      en: 'Precision diver watch.',
    },
    materials: {
      es: ['Acero 316L', 'Cristal de zafiro'],
      en: ['316L steel', 'Sapphire crystal'],
    },
  },
  {
    id: 2,
    slug: 'atlas-tourbillon',
    imageUrl: '/assets/watches/atlas-tourbillon.webp',
    price: 42000,
    currency: 'EUR',
    name: {
      es: 'Explorer Atlas',
      en: 'Atlas Explorer',
    },
    description: {
      es: 'Reloj explorador esfera negra.',
      en: 'Black dial explorer watch.',
    },
    materials: {
      es: ['Acero 904L'],
      en: ['904L steel'],
    },
  },
];

describe('App routing shell', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
        {
          provide: WatchCatalogService,
          useValue: {
            getWatches: () => of(watches),
          },
        },
      ],
    }).compileComponents();
  });

  it('should render the TempoLux logo and home journal without catalog cards', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('TempoLux');
    expect(compiled.textContent).toContain('Blog editorial');
    expect(compiled.querySelector('article.watch-card')).toBeNull();
  });

  it('should expose a catalog route link from the home shell', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const catalogLink = compiled.querySelector<HTMLAnchorElement>('a[href="/catalogo"]');
    expect(catalogLink?.textContent).toContain('Catálogo');
  });

  it('should render watches on the catalog route and switch to English', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/catalogo');
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance.language.setLanguage('en');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Exclusive watches available');
    expect(compiled.textContent).toContain('Aurora Diver'); // nombre actual del primer reloj
    expect(compiled.querySelectorAll('article.watch-card').length).toBe(2);
  });
});
