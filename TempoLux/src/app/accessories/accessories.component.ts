import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../cart.service';
import { LanguageService } from '../language.service';
import { Watch } from '../watch';

export type AccessoryCategory = 'strap' | 'hands' | 'battery';

export interface AccessoryVariant {
  color: string;
  label: { es: string; en: string };
}

export interface AccessoryItem {
  id: string;
  category: AccessoryCategory;
  name: { es: string; en: string };
  description: { es: string; en: string };
  material: 'leather' | 'metal' | 'nylon' | 'electronic';
  variants: AccessoryVariant[];
  price: number;
  compatible: { es: string; en: string };
}

export const ACCESSORIES: AccessoryItem[] = [
  // ── Correas / Straps ──────────────────────────────
  {
    id: 'leather-classic',
    category: 'strap',
    name: { es: 'Cuero Clásico', en: 'Classic Leather' },
    description: {
      es: 'Piel vacuna de curtido vegetal, acabado satinado. Compatible con todos los modelos de 20 mm.',
      en: 'Vegetable-tanned cowhide, satin finish. Compatible with all 20 mm models.',
    },
    material: 'leather',
    variants: [
      { color: '#1c1a18', label: { es: 'Negro', en: 'Black' } },
      { color: '#6b3020', label: { es: 'Marrón', en: 'Brown' } },
      { color: '#5c1020', label: { es: 'Burdeos', en: 'Burgundy' } },
      { color: '#e8e0d0', label: { es: 'Crema', en: 'Cream' } },
    ],
    price: 120,
    compatible: { es: 'Todos los modelos', en: 'All models' },
  },
  {
    id: 'leather-alligator',
    category: 'strap',
    name: { es: 'Cuero Aligátor', en: 'Alligator Leather' },
    description: {
      es: 'Piel de aligátor genuina. Escamas naturales, cosido a mano, cierre de oro vermeil.',
      en: 'Genuine alligator skin. Natural scales, hand-stitched, vermeil gold clasp.',
    },
    material: 'leather',
    variants: [
      { color: '#1a2818', label: { es: 'Verde Bosque', en: 'Forest Green' } },
      { color: '#1c1a18', label: { es: 'Negro Noche', en: 'Midnight Black' } },
      { color: '#4a1a10', label: { es: 'Cognac', en: 'Cognac' } },
    ],
    price: 380,
    compatible: { es: 'Todos los modelos', en: 'All models' },
  },
  {
    id: 'bracelet-oyster',
    category: 'strap',
    name: { es: 'Armis Oyster', en: 'Oyster Bracelet' },
    description: {
      es: 'Eslabones de tres piezas en acero 904L. Centro pulido, laterales cepillados.',
      en: '3-piece links in 904L steel. Polished center, brushed sides.',
    },
    material: 'metal',
    variants: [
      { color: '#b8c4d0', label: { es: 'Acero', en: 'Steel' } },
      { color: '#c8a035', label: { es: 'Oro 18K', en: '18K Gold' } },
      { color: '#b07060', label: { es: 'Oro Rosa 18K', en: '18K Rose Gold' } },
    ],
    price: 280,
    compatible: { es: 'Modelos deportivos', en: 'Sport models' },
  },
  {
    id: 'bracelet-mesh',
    category: 'strap',
    name: { es: 'Malla Milán', en: 'Milan Mesh' },
    description: {
      es: 'Malla de acero de 0,4 mm trenzado a mano. Cierre magnético de doble seguridad.',
      en: '0.4 mm hand-braided steel mesh. Double-security magnetic clasp.',
    },
    material: 'metal',
    variants: [
      { color: '#c0c0c0', label: { es: 'Plata', en: 'Silver' } },
      { color: '#d4a835', label: { es: 'Dorado', en: 'Gold' } },
      { color: '#1e3258', label: { es: 'Naval Azul', en: 'Navy Blue' } },
    ],
    price: 220,
    compatible: { es: 'Todos los modelos', en: 'All models' },
  },
  {
    id: 'nato-nylon',
    category: 'strap',
    name: { es: 'NATO Nylon', en: 'NATO Nylon' },
    description: {
      es: 'Nylon balístico de 20 mm, doble pasador. Estilo militar, lavable a mano.',
      en: '20 mm ballistic nylon, double keeper. Military style, hand washable.',
    },
    material: 'nylon',
    variants: [
      { color: '#1c1c1c', label: { es: 'Negro', en: 'Black' } },
      { color: '#1e3258', label: { es: 'Azul Marino', en: 'Navy' } },
      { color: '#2a3d28', label: { es: 'Verde Oliva', en: 'Olive' } },
      { color: '#8b4513', label: { es: 'Canela', en: 'Tan' } },
    ],
    price: 65,
    compatible: { es: 'Todos los modelos', en: 'All models' },
  },

  // ── Agujas / Hands ────────────────────────────────
  {
    id: 'hands-classic',
    category: 'hands',
    name: { es: 'Agujas Clásicas', en: 'Classic Hands' },
    description: {
      es: 'Juego de 3 agujas (horas, minutos, segundos). Lubricación de precisión incluida.',
      en: 'Set of 3 hands (hours, minutes, seconds). Precision lubrication included.',
    },
    material: 'metal',
    variants: [
      { color: '#d0d8e0', label: { es: 'Rodio', en: 'Rhodium' } },
      { color: '#d4a835', label: { es: 'Oro Amarillo', en: 'Yellow Gold' } },
      { color: '#c07868', label: { es: 'Oro Rosa', en: 'Rose Gold' } },
      { color: '#202020', label: { es: 'Negro PVD', en: 'Black PVD' } },
    ],
    price: 220,
    compatible: { es: 'Todos los modelos', en: 'All models' },
  },
  {
    id: 'hands-skeleton',
    category: 'hands',
    name: { es: 'Agujas Esqueleto', en: 'Skeleton Hands' },
    description: {
      es: 'Agujas caladas con relleno de laca de color. Diseño openworked de alta relojería.',
      en: 'Openworked hands with colored lacquer fill. High watchmaking openworked design.',
    },
    material: 'metal',
    variants: [
      { color: '#808888', label: { es: 'Acero Pulido', en: 'Polished Steel' } },
      { color: '#d4a835', label: { es: 'Dorado', en: 'Gold' } },
      { color: '#c07868', label: { es: 'Oro Rosa', en: 'Rose Gold' } },
    ],
    price: 450,
    compatible: { es: 'Modelos de alta relojería', en: 'High watchmaking models' },
  },
  {
    id: 'hands-dauphine',
    category: 'hands',
    name: { es: 'Agujas Dauphine', en: 'Dauphine Hands' },
    description: {
      es: 'Perfil Dauphine en tres dimensiones. Acabado combinado facetado y satinado.',
      en: '3D Dauphine profile. Combined faceted and satin finish.',
    },
    material: 'metal',
    variants: [
      { color: '#d0d8e0', label: { es: 'Plata', en: 'Silver' } },
      { color: '#d4a835', label: { es: 'Oro', en: 'Gold' } },
      { color: '#202020', label: { es: 'Negro PVD', en: 'Black PVD' } },
    ],
    price: 310,
    compatible: { es: 'Modelos clásicos y dress', en: 'Classic and dress models' },
  },

  // ── Baterías / Batteries ──────────────────────────
  {
    id: 'battery-silver-oxide',
    category: 'battery',
    name: { es: 'Óxido de Plata SR920SW', en: 'Silver Oxide SR920SW' },
    description: {
      es: 'Batería de óxido de plata de alto rendimiento. Voltaje estable 1,55 V. Duración estimada 3 años.',
      en: 'High-performance silver oxide battery. Stable 1.55 V voltage. Estimated life 3 years.',
    },
    material: 'electronic',
    variants: [{ color: '#c8c8c8', label: { es: 'Estándar', en: 'Standard' } }],
    price: 18,
    compatible: { es: 'Modelos de cuarzo', en: 'Quartz models' },
  },
  {
    id: 'battery-lithium',
    category: 'battery',
    name: { es: 'Litio de Alto Rendimiento', en: 'High-Performance Lithium' },
    description: {
      es: 'Celda de litio CR2016 para relojes multifunción. Temperatura extrema —20 °C a +60 °C.',
      en: 'CR2016 lithium cell for multifunction watches. Extreme temp −20 °C to +60 °C.',
    },
    material: 'electronic',
    variants: [{ color: '#4060a0', label: { es: 'Litio', en: 'Lithium' } }],
    price: 28,
    compatible: { es: 'Modelos multifunción', en: 'Multifunction models' },
  },
  {
    id: 'battery-capacitor',
    category: 'battery',
    name: { es: 'Capacitor Recargable', en: 'Rechargeable Capacitor' },
    description: {
      es: 'Supercapacitor para relojes solar y kinético. Recarga completa en 8 h de luz natural.',
      en: 'Supercapacitor for solar and kinetic watches. Full charge in 8 h of natural light.',
    },
    material: 'electronic',
    variants: [{ color: '#206040', label: { es: 'Eco Green', en: 'Eco Green' } }],
    price: 45,
    compatible: { es: 'Solar y cinético', en: 'Solar and kinetic' },
  },
  {
    id: 'battery-titanium',
    category: 'battery',
    name: { es: 'Reserva Titanio', en: 'Titanium Reserve' },
    description: {
      es: 'Batería premium de aleación titanio. 5 años de reserva de marcha. 100 % libre de mercurio.',
      en: 'Premium titanium alloy battery. 5-year power reserve. 100 % mercury-free.',
    },
    material: 'electronic',
    variants: [{ color: '#708090', label: { es: 'Titanio', en: 'Titanium' } }],
    price: 38,
    compatible: { es: 'Todos los modelos', en: 'All models' },
  },
];

@Component({
  selector: 'app-accessories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './accessories.component.html',
  styleUrl: './accessories.component.css',
})
export class AccessoriesComponent {
  private readonly cart = inject(CartService);
  readonly language = inject(LanguageService);

  readonly accessories = ACCESSORIES;
  readonly activeCategory = signal<AccessoryCategory | 'all'>('all');
  readonly justAdded = signal<string | null>(null);

  // Per-item selected variant index
  private readonly selectedVariants = new Map<string, number>();

  readonly straps  = ACCESSORIES.filter(a => a.category === 'strap');
  readonly hands   = ACCESSORIES.filter(a => a.category === 'hands');
  readonly batteries = ACCESSORIES.filter(a => a.category === 'battery');

  getSelectedVariant(item: AccessoryItem): number {
    return this.selectedVariants.get(item.id) ?? 0;
  }

  setVariant(item: AccessoryItem, index: number): void {
    this.selectedVariants.set(item.id, index);
  }

  getActiveVariant(item: AccessoryItem): AccessoryVariant {
    return item.variants[this.getSelectedVariant(item)];
  }

  formatPrice(amount: number): string {
    return new Intl.NumberFormat(this.language.language() === 'es' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  addToCart(item: AccessoryItem): void {
    const variant = this.getActiveVariant(item);
    const watch: Watch = {
      id: Date.now(),
      slug: `acc-${item.id}-${variant.color}`,
      imageUrl: '/assets/watches/obsidian-moonphase.webp',
      price: item.price,
      currency: 'EUR',
      name: item.name,
      description: {
        es: `${item.name.es} — ${variant.label.es}. ${item.description.es}`,
        en: `${item.name.en} — ${variant.label.en}. ${item.description.en}`,
      },
      materials: {
        es: [variant.label.es, this.materialLabel('es', item.material)],
        en: [variant.label.en, this.materialLabel('en', item.material)],
      },
    };
    this.cart.add(watch);
    this.justAdded.set(item.id + '-' + this.getSelectedVariant(item));
    setTimeout(() => this.justAdded.set(null), 1800);
  }

  isJustAdded(item: AccessoryItem): boolean {
    return this.justAdded() === item.id + '-' + this.getSelectedVariant(item);
  }

  private materialLabel(lang: 'es' | 'en', material: string): string {
    const map: Record<string, { es: string; en: string }> = {
      leather:    { es: 'Piel genuina', en: 'Genuine leather' },
      metal:      { es: 'Metal pulido', en: 'Polished metal' },
      nylon:      { es: 'Nylon balístico', en: 'Ballistic nylon' },
      electronic: { es: 'Electrónica de precisión', en: 'Precision electronics' },
    };
    return map[material]?.[lang] ?? material;
  }
}
