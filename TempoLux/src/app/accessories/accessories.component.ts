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
    const variantIndex = this.getSelectedVariant(item);
    const slug = `acc-${item.id}-${variantIndex}`;
    const watch: Watch = {
      id: this.stableNumericId(slug),
      slug,
      imageUrl: this.accessoryImageUrl(item, variant),
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
    this.justAdded.set(item.id + '-' + variantIndex);
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

  private accessoryImageUrl(item: AccessoryItem, variant: AccessoryVariant): string {
    const svg = item.category === 'battery'
      ? this.batterySvg(item, variant)
      : item.category === 'hands'
        ? this.handsSvg(item, variant)
        : this.strapSvg(item, variant);

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  private strapSvg(item: AccessoryItem, variant: AccessoryVariant): string {
    const color = variant.color;
    const material = item.material;

    if (material === 'metal') {
      const rows = [0, 1, 2]
        .map(row => {
          const y = 12 + row * 24;
          return `
            <rect x="12" y="${y}" width="18" height="18" rx="1.5" fill="${color}" opacity="0.72"/>
            <rect x="12" y="${y}" width="18" height="5" rx="1" fill="rgba(255,255,255,0.2)"/>
            <rect x="30" y="${y}" width="2" height="18" fill="rgba(0,0,0,0.78)"/>
            <rect x="32" y="${y}" width="56" height="18" rx="1.5" fill="${color}"/>
            <rect x="32" y="${y}" width="56" height="6" rx="1" fill="rgba(255,255,255,0.34)"/>
            <rect x="88" y="${y}" width="2" height="18" fill="rgba(0,0,0,0.78)"/>
            <rect x="90" y="${y}" width="18" height="18" rx="1.5" fill="${color}" opacity="0.72"/>
            <rect x="90" y="${y}" width="18" height="5" rx="1" fill="rgba(255,255,255,0.2)"/>`;
        })
        .join('');

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 96">
        <rect width="120" height="96" fill="#090807"/>
        ${rows}
        <rect x="8" y="8" width="6" height="80" fill="rgba(0,0,0,0.48)"/>
        <rect x="106" y="8" width="6" height="80" fill="rgba(0,0,0,0.38)"/>
      </svg>`;
    }

    if (material === 'nylon') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 96">
        <rect width="120" height="96" fill="#090807"/>
        <rect x="14" y="18" width="92" height="60" rx="5" fill="${color}"/>
        <g stroke="rgba(0,0,0,0.18)" stroke-width="1.2">
          <line x1="14" y1="26" x2="106" y2="26"/><line x1="14" y1="34" x2="106" y2="34"/>
          <line x1="14" y1="42" x2="106" y2="42"/><line x1="14" y1="50" x2="106" y2="50"/>
          <line x1="14" y1="58" x2="106" y2="58"/><line x1="14" y1="66" x2="106" y2="66"/>
        </g>
        <rect x="14" y="34" width="92" height="10" fill="rgba(0,0,0,0.32)"/>
        <rect x="14" y="56" width="92" height="10" fill="rgba(0,0,0,0.32)"/>
        <rect x="14" y="18" width="92" height="5" rx="2" fill="rgba(255,255,255,0.16)"/>
      </svg>`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 96">
      <defs>
        <linearGradient id="curve" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#000" stop-opacity="0.55"/>
          <stop offset="22%" stop-color="#fff" stop-opacity="0.06"/>
          <stop offset="52%" stop-color="#fff" stop-opacity="0.18"/>
          <stop offset="82%" stop-color="#000" stop-opacity="0.06"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.50"/>
        </linearGradient>
      </defs>
      <rect width="120" height="96" fill="#090807"/>
      <rect x="14" y="18" width="92" height="60" rx="7" fill="${color}"/>
      <rect x="14" y="18" width="92" height="60" rx="7" fill="url(#curve)"/>
      <line x1="27" y1="24" x2="27" y2="72" stroke="rgba(255,255,255,0.32)" stroke-width="1.2" stroke-dasharray="5 4" stroke-linecap="round"/>
      <line x1="93" y1="24" x2="93" y2="72" stroke="rgba(255,255,255,0.32)" stroke-width="1.2" stroke-dasharray="5 4" stroke-linecap="round" stroke-dashoffset="4"/>
      <rect x="14" y="18" width="92" height="4" rx="2" fill="rgba(255,255,255,0.15)"/>
      <rect x="14" y="74" width="92" height="4" rx="2" fill="rgba(0,0,0,0.22)"/>
    </svg>`;
  }

  private handsSvg(item: AccessoryItem, variant: AccessoryVariant): string {
    const color = variant.color;
    const openwork = item.id.includes('skeleton');
    const dauphine = item.id.includes('dauphine');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" fill="#090807"/>
      <circle cx="60" cy="60" r="45" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2"/>
      ${Array.from({ length: 12 }, (_, i) => `<rect x="58.5" y="17" width="3" height="8" rx="1" fill="${color}" opacity="0.56" transform="rotate(${i * 30} 60 60)"/>`).join('')}
      ${openwork
        ? `<path d="M60 28 L65 58 L60 70 L55 58 Z" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>
           <path d="M60 13 L63 58 L60 72 L57 58 Z" fill="none" stroke="${color}" stroke-width="2.4" stroke-linejoin="round"/>`
        : dauphine
          ? `<polygon points="60,25 66,59 60,72 54,59" fill="${color}"/><polygon points="60,14 64,58 60,72 56,58" fill="${color}"/>`
          : `<polygon points="60,28 64,58 60,70 56,58" fill="${color}"/><polygon points="60,13 63,58 60,72 57,58" fill="${color}"/>`}
      <line x1="60" y1="16" x2="60" y2="77" stroke="#d8b76f" stroke-width="1.4" stroke-linecap="round"/>
      <circle cx="60" cy="60" r="5" fill="${color}"/>
      <circle cx="60" cy="60" r="2.7" fill="rgba(255,255,255,0.35)"/>
    </svg>`;
  }

  private batterySvg(item: AccessoryItem, variant: AccessoryVariant): string {
    const color = variant.color;
    const label = item.name.en.replace(/&/g, '&amp;').slice(0, 18);

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 96">
      <defs>
        <radialGradient id="face" cx="34%" cy="28%" r="68%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.78)"/>
          <stop offset="42%" stop-color="rgba(255,255,255,0.08)"/>
          <stop offset="100%" stop-color="rgba(0,0,0,0.45)"/>
        </radialGradient>
        <linearGradient id="rim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(0,0,0,0.58)"/>
          <stop offset="14%" stop-color="rgba(255,255,255,0.20)"/>
          <stop offset="86%" stop-color="rgba(255,255,255,0.20)"/>
          <stop offset="100%" stop-color="rgba(0,0,0,0.52)"/>
        </linearGradient>
      </defs>
      <rect width="120" height="96" fill="#090807"/>
      <path d="M18,35 L18,58 A42,13 0 0,0 102,58 L102,35" fill="${color}"/>
      <path d="M18,35 L18,58 A42,13 0 0,0 102,58 L102,35" fill="url(#rim)"/>
      <ellipse cx="60" cy="35" rx="42" ry="13" fill="${color}"/>
      <ellipse cx="60" cy="35" rx="42" ry="13" fill="url(#face)"/>
      <ellipse cx="60" cy="35" rx="31" ry="8" fill="none" stroke="rgba(0,0,0,0.22)" stroke-width="1.1"/>
      <text x="60" y="38" text-anchor="middle" font-family="Arial, sans-serif" font-size="7" font-weight="700" fill="rgba(0,0,0,0.52)">${label}</text>
      <line x1="18" y1="47" x2="102" y2="47" stroke="rgba(0,0,0,0.28)" stroke-width="1.4"/>
      <ellipse cx="60" cy="58" rx="42" ry="13" fill="none" stroke="${color}" stroke-width="1" opacity="0.55"/>
    </svg>`;
  }

  private stableNumericId(value: string): number {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = Math.imul(31, hash) + value.charCodeAt(i) | 0;
    }

    return 2_000_000_000 + Math.abs(hash);
  }
}
