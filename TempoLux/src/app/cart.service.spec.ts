import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Watch } from './watch';

const baseWatch: Watch = {
  id: 10,
  slug: 'custom-oyster-silver',
  imageUrl: '/assets/watches/obsidian-moonphase.webp',
  price: 16500,
  currency: 'EUR',
  name: { es: 'Reloj personalizado', en: 'Custom watch' },
  description: { es: 'Configuracion a medida.', en: 'Bespoke configuration.' },
  materials: { es: ['Acero'], en: ['Steel'] },
};

describe('CartService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('increments quantity instead of adding another row for the same product slug', () => {
    const service = TestBed.inject(CartService);

    service.add(baseWatch);
    service.add({ ...baseWatch, id: 999 });

    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(2);
    expect(service.count()).toBe(2);
  });
});
