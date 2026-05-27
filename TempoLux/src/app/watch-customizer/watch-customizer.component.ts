import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../cart.service';
import { LanguageService } from '../language.service';
import { Watch } from '../watch';

interface StrapOption {
  id: string;
  label: { es: string; en: string };
  color: string;
  priceAdd: number;
}

interface CaseOption {
  id: string;
  label: { es: string; en: string };
  base: string;
  highlight: string;
  shadow: string;
  bezel: string;
  priceAdd: number;
}

interface DialOption {
  id: string;
  label: { es: string; en: string };
  color: string;
  textColor: string;
  priceAdd: number;
}

interface HandsOption {
  id: string;
  label: { es: string; en: string };
  color: string;
  priceAdd: number;
}

interface GemstoneOption {
  id: string;
  label: { es: string; en: string };
  color: string;
  glow: string;
  priceAdd: number;
}

interface MarkerPoint {
  x: number;
  y: number;
  angle: number;
}

interface PreviewPhoto {
  imageUrl: string;
  name: { es: string; en: string };
}

const CX = 140;
const CY = 220;
const BASE_CUSTOM_PRICE = 16500;

export const STRAP_OPTIONS: StrapOption[] = [
  { id: 'steel-oyster', label: { es: 'Acero Oyster', en: 'Steel Oyster' }, color: '#b8c4d0', priceAdd: 0 },
  { id: 'black-leather', label: { es: 'Cuero Negro', en: 'Black Leather' }, color: '#1c1a18', priceAdd: 0 },
  { id: 'brown-leather', label: { es: 'Cuero Marrón', en: 'Brown Leather' }, color: '#6b3020', priceAdd: 200 },
  { id: 'navy', label: { es: 'Malla Naval', en: 'Navy Mesh' }, color: '#1e3258', priceAdd: 350 },
  { id: 'hunter-green', label: { es: 'Verde Caza', en: 'Hunter Green' }, color: '#2a3d28', priceAdd: 200 },
  { id: 'ivory', label: { es: 'Marfil', en: 'Ivory' }, color: '#e8e0d0', priceAdd: 300 },
  { id: 'rose-metal', label: { es: 'Metal Oro Rosa', en: 'Rose Gold Metal' }, color: '#b07060', priceAdd: 800 },
];

export const CASE_OPTIONS: CaseOption[] = [
  { id: 'silver', label: { es: 'Plata Pulida', en: 'Polished Silver' }, base: '#c0c8d0', highlight: '#eaf0f8', shadow: '#808890', bezel: '#a8b2bc', priceAdd: 0 },
  { id: 'steel', label: { es: 'Acero Cepillado', en: 'Brushed Steel' }, base: '#8898a8', highlight: '#b0c2d4', shadow: '#586878', bezel: '#7088a0', priceAdd: 500 },
  { id: 'yellow-gold', label: { es: 'Oro Amarillo 18K', en: '18K Yellow Gold' }, base: '#c8a035', highlight: '#f0cc60', shadow: '#906010', bezel: '#b08020', priceAdd: 4500 },
  { id: 'rose-gold', label: { es: 'Oro Rosa 18K', en: '18K Rose Gold' }, base: '#c07868', highlight: '#e89878', shadow: '#905040', bezel: '#a86050', priceAdd: 4200 },
  { id: 'pvd-black', label: { es: 'Negro PVD', en: 'PVD Black' }, base: '#282828', highlight: '#484848', shadow: '#080808', bezel: '#181818', priceAdd: 800 },
];

export const DIAL_OPTIONS: DialOption[] = [
  { id: 'white', label: { es: 'Esmalte Blanco', en: 'White Enamel' }, color: '#f5f0e8', textColor: '#1a1a1a', priceAdd: 0 },
  { id: 'midnight', label: { es: 'Negro Medianoche', en: 'Midnight Black' }, color: '#0d0c10', textColor: '#e8e8e8', priceAdd: 200 },
  { id: 'royal-blue', label: { es: 'Azul Royal', en: 'Royal Blue' }, color: '#0e2045', textColor: '#d0dff8', priceAdd: 400 },
  { id: 'champagne', label: { es: 'Champán', en: 'Champagne' }, color: '#d8c890', textColor: '#302010', priceAdd: 300 },
  { id: 'slate', label: { es: 'Gris Pizarra', en: 'Slate Grey' }, color: '#3a4555', textColor: '#c8d8e8', priceAdd: 350 },
];

export const HANDS_OPTIONS: HandsOption[] = [
  { id: 'rhodium', label: { es: 'Rodio', en: 'Rhodium' }, color: '#d0d8e0', priceAdd: 0 },
  { id: 'yellow-gold', label: { es: 'Oro Amarillo', en: 'Yellow Gold' }, color: '#d4a835', priceAdd: 600 },
  { id: 'black-pvd', label: { es: 'Negro PVD', en: 'Black PVD' }, color: '#202020', priceAdd: 300 },
  { id: 'rose-gold', label: { es: 'Oro Rosa', en: 'Rose Gold' }, color: '#c07868', priceAdd: 600 },
];

export const GEMSTONE_OPTIONS: GemstoneOption[] = [
  { id: 'none', label: { es: 'Sin piedras', en: 'No stones' }, color: 'transparent', glow: 'transparent', priceAdd: 0 },
  { id: 'diamond', label: { es: 'Diamantes', en: 'Diamonds' }, color: '#e8f4ff', glow: 'rgba(200,225,255,0.9)', priceAdd: 3000 },
  { id: 'ruby', label: { es: 'Rubíes', en: 'Rubies' }, color: '#c0001a', glow: 'rgba(210,0,40,0.8)', priceAdd: 2500 },
  { id: 'sapphire', label: { es: 'Zafiros', en: 'Sapphires' }, color: '#0a30c0', glow: 'rgba(30,100,255,0.8)', priceAdd: 2200 },
  { id: 'emerald', label: { es: 'Esmeraldas', en: 'Emeralds' }, color: '#006630', glow: 'rgba(0,150,70,0.8)', priceAdd: 2800 },
];

const REAL_PREVIEW_PHOTOS: Record<string, PreviewPhoto> = {
  obsidian: {
    imageUrl: '/assets/watches/obsidian-moonphase.webp',
    name: { es: 'Fase Lunar Obsidiana', en: 'Obsidian Moonphase' },
  },
  aurora: {
    imageUrl: '/assets/watches/aurora-regulator.webp',
    name: { es: 'Regulador Aurora', en: 'Aurora Regulator' },
  },
  mariner: {
    imageUrl: '/assets/watches/mariner-perpetual.webp',
    name: { es: 'Mariner Perpetual', en: 'Mariner Perpetual' },
  },
  solstice: {
    imageUrl: '/assets/watches/solstice-chrono.webp',
    name: { es: 'Crono Solstice', en: 'Solstice Chrono' },
  },
  atlas: {
    imageUrl: '/assets/watches/atlas-tourbillon.webp',
    name: { es: 'Atlas Tourbillon', en: 'Atlas Tourbillon' },
  },
  polar: {
    imageUrl: '/assets/watches/polar-skeleton.webp',
    name: { es: 'Polar Skeleton', en: 'Polar Skeleton' },
  },
};

@Component({
  selector: 'app-watch-customizer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './watch-customizer.component.html',
  styleUrl: './watch-customizer.component.css',
})
export class WatchCustomizerComponent implements OnInit, OnDestroy {
  private clockInterval?: ReturnType<typeof setInterval>;
  private pulseTimeout?: ReturnType<typeof setTimeout>;
  private firstPulse = true;
  private readonly cart = inject(CartService);
  readonly language = inject(LanguageService);

  readonly watchPulse = signal(false);

  constructor() {
    effect(() => {
      // Track every customizable option — triggers on any change
      void [this.activeStrap(), this.activeCase(), this.activeDial(), this.activeHands(), this.activeGemstone()];
      if (this.firstPulse) { this.firstPulse = false; return; }
      clearTimeout(this.pulseTimeout);
      this.watchPulse.set(true);
      this.pulseTimeout = setTimeout(() => this.watchPulse.set(false), 700);
    });
  }

  readonly strapOptions = STRAP_OPTIONS;
  readonly caseOptions = CASE_OPTIONS;
  readonly dialOptions = DIAL_OPTIONS;
  readonly handsOptions = HANDS_OPTIONS;
  readonly gemstoneOptions = GEMSTONE_OPTIONS;

  readonly selectedStrap = signal(0);
  readonly selectedCase = signal(0);
  readonly selectedDial = signal(0);
  readonly selectedHands = signal(0);
  readonly selectedGemstone = signal(0);

  readonly hours = signal(0);
  readonly minutes = signal(0);
  readonly seconds = signal(0);
  readonly addedToCart = signal(false);

  readonly activeStrap = computed(() => STRAP_OPTIONS[this.selectedStrap()]);
  readonly activeCase = computed(() => CASE_OPTIONS[this.selectedCase()]);
  readonly activeDial = computed(() => DIAL_OPTIONS[this.selectedDial()]);
  readonly activeHands = computed(() => HANDS_OPTIONS[this.selectedHands()]);
  readonly activeGemstone = computed(() => GEMSTONE_OPTIONS[this.selectedGemstone()]);
  readonly previewPhoto = computed(() => this.resolvePreviewPhoto());
  readonly previewTags = computed(() => [
    this.optionLabel(this.activeStrap().label),
    this.optionLabel(this.activeCase().label),
    this.optionLabel(this.activeDial().label),
  ]);

  readonly price = computed(() =>
    BASE_CUSTOM_PRICE
    + this.activeStrap().priceAdd
    + this.activeCase().priceAdd
    + this.activeDial().priceAdd
    + this.activeHands().priceAdd
    + this.activeGemstone().priceAdd
  );

  readonly hourAngle = computed(() => this.hours() * 30 + this.minutes() * 0.5);
  readonly minuteAngle = computed(() => this.minutes() * 6 + this.seconds() * 0.1);
  readonly secondAngle = computed(() => this.seconds() * 6);

  readonly hourRotate = computed(() => `rotate(${this.hourAngle()}, ${CX}, ${CY})`);
  readonly minuteRotate = computed(() => `rotate(${this.minuteAngle()}, ${CX}, ${CY})`);
  readonly secondRotate = computed(() => `rotate(${this.secondAngle()}, ${CX}, ${CY})`);

  readonly hourMarkers: MarkerPoint[] = Array.from({ length: 12 }, (_, i) => {
    const angle = i * 30;
    const rad = (angle * Math.PI) / 180;
    const r = 66;
    return { x: CX + r * Math.sin(rad), y: CY - r * Math.cos(rad), angle };
  });

  readonly minuteTicks: MarkerPoint[] = Array.from({ length: 60 }, (_, i) => {
    if (i % 5 === 0) return null;
    const angle = i * 6;
    const rad = (angle * Math.PI) / 180;
    const r = 72;
    return { x: CX + r * Math.sin(rad), y: CY - r * Math.cos(rad), angle };
  }).filter((x): x is MarkerPoint => x !== null);

  /** 60 graduation ticks on the rotating bezel ring */
  readonly bezelTicks: { x1: number; y1: number; x2: number; y2: number; isMajor: boolean }[] =
    Array.from({ length: 60 }, (_, i) => {
      const angle = i * 6;
      const rad = (angle * Math.PI) / 180;
      const rOuter = 89;
      const rInner = i % 5 === 0 ? 84 : 87;
      return {
        x1: CX + rOuter * Math.sin(rad),
        y1: CY - rOuter * Math.cos(rad),
        x2: CX + rInner * Math.sin(rad),
        y2: CY - rInner * Math.cos(rad),
        isMajor: i % 5 === 0,
      };
    });

  /** Y-start positions for each Oyster bracelet link row (top strap) */
  readonly braceletTopRows = Array.from({ length: 8 }, (_, i) => 6 + i * 15);
  /** Y-start positions for each Oyster bracelet link row (bottom strap) */
  readonly braceletBotRows = Array.from({ length: 8 }, (_, i) => 316 + i * 15);

  get currentDay(): string {
    return new Date().getDate().toString().padStart(2, '0');
  }

  get strapLinkBase(): string {
    return this.activeStrap().color;
  }

  get strapLinkHighlight(): string {
    return this.lightenColor(this.activeStrap().color, 55);
  }

  get strapLinkShadow(): string {
    const hex = this.activeStrap().color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.max(0, (num >> 16) - 55);
    const g = Math.max(0, ((num >> 8) & 0xff) - 55);
    const b = Math.max(0, (num & 0xff) - 55);
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  }

  get dialHighlight(): string {
    return this.lightenColor(this.activeDial().color, 28);
  }

  get formattedPrice(): string {
    return new Intl.NumberFormat(this.language.language() === 'es' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(this.price());
  }

  formatPriceAdd(amount: number): string {
    if (amount === 0) return this.language.language() === 'es' ? 'Incluido' : 'Included';
    return '+' + new Intl.NumberFormat(this.language.language() === 'es' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  ngOnInit(): void {
    this.updateClock();
    this.clockInterval = setInterval(() => this.updateClock(), 1000);
  }

  ngOnDestroy(): void {
    if (this.clockInterval) clearInterval(this.clockInterval);
    clearTimeout(this.pulseTimeout);
  }

  private updateClock(): void {
    const now = new Date();
    this.hours.set(now.getHours() % 12);
    this.minutes.set(now.getMinutes());
    this.seconds.set(now.getSeconds());
  }

  addToCart(): void {
    const slug = this.customWatchSlug();
    const watch: Watch = {
      id: this.stableNumericId(slug),
      slug,
      imageUrl: this.customWatchImageUrl(),
      price: this.price(),
      currency: 'EUR',
      name: { es: 'Reloj personalizado', en: 'Custom watch' },
      description: {
        es: `Correa ${this.activeStrap().label.es} · Caja ${this.activeCase().label.es} · Esfera ${this.activeDial().label.es} · Agujas ${this.activeHands().label.es}${this.activeGemstone().id !== 'none' ? ' · ' + this.activeGemstone().label.es : ''}`,
        en: `${this.activeStrap().label.en} Strap · ${this.activeCase().label.en} Case · ${this.activeDial().label.en} Dial · ${this.activeHands().label.en} Hands${this.activeGemstone().id !== 'none' ? ' · ' + this.activeGemstone().label.en : ''}`,
      },
      materials: {
        es: [this.activeStrap().label.es, this.activeCase().label.es, this.activeDial().label.es],
        en: [this.activeStrap().label.en, this.activeCase().label.en, this.activeDial().label.en],
      },
    };
    this.cart.add(watch);
    this.addedToCart.set(true);
    setTimeout(() => this.addedToCart.set(false), 2400);
  }

  private customWatchImageUrl(): string {
    const strap = this.activeStrap();
    const watchCase = this.activeCase();
    const dial = this.activeDial();
    const hands = this.activeHands();
    const gemstone = this.activeGemstone();
    const isMetalStrap = strap.id === 'steel-oyster' || strap.id === 'navy' || strap.id === 'rose-metal';
    const hourMarkers = Array.from({ length: 12 }, (_, i) => {
      const angle = i * 30;
      const rad = angle * Math.PI / 180;
      const x = 60 + 31 * Math.sin(rad);
      const y = 82 - 31 * Math.cos(rad);

      if (gemstone.id !== 'none') {
        return `<circle cx="${x}" cy="${y}" r="3.2" fill="${gemstone.color}"/><circle cx="${x - 0.8}" cy="${y - 0.8}" r="1" fill="rgba(255,255,255,0.7)"/>`;
      }

      return `<rect x="${x - 1.2}" y="${y - 4}" width="2.4" height="8" rx="0.8" fill="${hands.color}" transform="rotate(${angle} ${x} ${y})"/>`;
    }).join('');

    const strapSvg = isMetalStrap
      ? `<rect x="43" y="6" width="34" height="62" rx="5" fill="rgba(0,0,0,0.72)"/>${this.thumbnailBraceletRows(10, strap.color)}<rect x="43" y="104" width="34" height="62" rx="5" fill="rgba(0,0,0,0.72)"/>${this.thumbnailBraceletRows(132, strap.color)}`
      : `<rect x="43" y="6" width="34" height="62" rx="6" fill="${strap.color}"/><rect x="43" y="6" width="34" height="62" rx="6" fill="url(#strapCurve)"/><line x1="49" y1="12" x2="49" y2="62" stroke="rgba(255,255,255,0.24)" stroke-width="0.8" stroke-dasharray="3 3"/><line x1="71" y1="12" x2="71" y2="62" stroke="rgba(255,255,255,0.24)" stroke-width="0.8" stroke-dasharray="3 3"/><rect x="43" y="104" width="34" height="62" rx="6" fill="${strap.color}"/><rect x="43" y="104" width="34" height="62" rx="6" fill="url(#strapCurve)"/><line x1="49" y1="110" x2="49" y2="160" stroke="rgba(255,255,255,0.24)" stroke-width="0.8" stroke-dasharray="3 3"/><line x1="71" y1="110" x2="71" y2="160" stroke="rgba(255,255,255,0.24)" stroke-width="0.8" stroke-dasharray="3 3"/>`;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 176">
      <defs>
        <radialGradient id="caseGrad" cx="35%" cy="25%" r="72%">
          <stop offset="0%" stop-color="${watchCase.highlight}"/>
          <stop offset="56%" stop-color="${watchCase.base}"/>
          <stop offset="100%" stop-color="${watchCase.shadow}"/>
        </radialGradient>
        <radialGradient id="dialGrad" cx="38%" cy="28%" r="70%">
          <stop offset="0%" stop-color="${this.lightenColor(dial.color, 28)}"/>
          <stop offset="100%" stop-color="${dial.color}"/>
        </radialGradient>
        <linearGradient id="strapCurve" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#000" stop-opacity="0.55"/>
          <stop offset="50%" stop-color="#fff" stop-opacity="0.13"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.48"/>
        </linearGradient>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="1" dy="5" stdDeviation="5" flood-color="#000" flood-opacity="0.65"/>
        </filter>
      </defs>
      <rect width="120" height="176" fill="#090706"/>
      <ellipse cx="60" cy="88" rx="48" ry="76" fill="rgba(216,183,111,0.08)"/>
      ${strapSvg}
      <rect x="41" y="58" width="38" height="16" rx="4" fill="url(#caseGrad)"/>
      <rect x="41" y="102" width="38" height="16" rx="4" fill="url(#caseGrad)"/>
      <circle cx="60" cy="88" r="45" fill="url(#caseGrad)" filter="url(#shadow)"/>
      <circle cx="60" cy="88" r="40" fill="${dial.color}"/>
      <circle cx="60" cy="88" r="36" fill="url(#caseGrad)"/>
      <circle cx="60" cy="88" r="33" fill="url(#dialGrad)"/>
      ${hourMarkers}
      <text x="60" y="79" text-anchor="middle" fill="${dial.textColor}" fill-opacity="0.9" font-size="5.5" font-family="Georgia, serif" font-weight="700" letter-spacing="1.8">TEMPOLUX</text>
      <rect x="72" y="84" width="10" height="7" rx="1.2" fill="rgba(255,255,255,0.9)" stroke="${watchCase.shadow}" stroke-width="0.4"/>
      <text x="77" y="89.3" text-anchor="middle" font-size="4.2" fill="#15110c" font-family="monospace" font-weight="700">${this.currentDay}</text>
      <polygon points="60,61 62.2,88 60,94 57.8,88" fill="${hands.color}"/>
      <polygon points="60,52 61.4,88 60,96 58.6,88" fill="${hands.color}"/>
      <line x1="60" y1="57" x2="60" y2="101" stroke="#d8b76f" stroke-width="0.9" stroke-linecap="round"/>
      <circle cx="60" cy="88" r="3.3" fill="${watchCase.base}"/>
      <circle cx="60" cy="88" r="1.8" fill="${watchCase.highlight}"/>
      <rect x="103" y="80" width="8" height="16" rx="3" fill="url(#caseGrad)"/>
      <ellipse cx="46" cy="66" rx="6" ry="12" fill="rgba(255,255,255,0.09)" transform="rotate(-20 46 66)"/>
    </svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  private thumbnailBraceletRows(startY: number, color: string): string {
    const highlight = this.lightenColor(color, 55);
    const shadow = this.lightenColor(color, -55);

    return Array.from({ length: 4 }, (_, i) => {
      const y = startY + i * 13;
      return `<rect x="44" y="${y}" width="8" height="11" rx="0.8" fill="${shadow}"/><rect x="52" y="${y}" width="16" height="11" rx="0.8" fill="${highlight}"/><rect x="68" y="${y}" width="8" height="11" rx="0.8" fill="${shadow}"/><rect x="52" y="${y}" width="16" height="3" fill="rgba(255,255,255,0.28)"/>`;
    }).join('');
  }

  private customWatchSlug(): string {
    return [
      'custom',
      this.activeStrap().id,
      this.activeCase().id,
      this.activeDial().id,
      this.activeHands().id,
      this.activeGemstone().id,
    ].join('-');
  }

  private stableNumericId(value: string): number {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = Math.imul(31, hash) + value.charCodeAt(i) | 0;
    }

    return 1_000_000_000 + Math.abs(hash);
  }

  private resolvePreviewPhoto(): PreviewPhoto {
    if (this.activeGemstone().id !== 'none') {
      return REAL_PREVIEW_PHOTOS['polar'];
    }

    if (this.activeCase().id === 'yellow-gold' || this.activeCase().id === 'rose-gold' || this.activeStrap().id === 'rose-metal') {
      return REAL_PREVIEW_PHOTOS['solstice'];
    }

    if (this.activeStrap().id.includes('leather')) {
      return this.activeDial().id === 'white' ? REAL_PREVIEW_PHOTOS['mariner'] : REAL_PREVIEW_PHOTOS['aurora'];
    }

    if (this.activeDial().id === 'slate' || this.activeCase().id === 'pvd-black') {
      return REAL_PREVIEW_PHOTOS['atlas'];
    }

    return REAL_PREVIEW_PHOTOS['obsidian'];
  }

  private optionLabel(label: { es: string; en: string }): string {
    return this.language.language() === 'es' ? label.es : label.en;
  }

  private lightenColor(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
    const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }
}
