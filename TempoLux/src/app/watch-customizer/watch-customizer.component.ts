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
    const watch: Watch = {
      id: Date.now(),
      slug: `custom-${Date.now()}`,
      imageUrl: this.previewPhoto().imageUrl,
      price: this.price(),
      currency: 'EUR',
      name: this.previewPhoto().name,
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
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0xff) + amount);
    const b = Math.min(255, (num & 0xff) + amount);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }
}
