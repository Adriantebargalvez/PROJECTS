import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../language.service';
import { LocalizedText } from '../watch';
import { WatchAssemblyComponent } from '../watch-assembly/watch-assembly.component';

interface JournalArticle {
  kicker: LocalizedText;
  title: LocalizedText;
  excerpt: LocalizedText;
  imageUrl: string;
}

interface Particle {
  id: number;
  style: Record<string, string>;
}

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    style: {
      '--x': `${10 + Math.random() * 80}%`,
      '--y': `${10 + Math.random() * 80}%`,
      '--size': `${2 + Math.random() * 3}px`,
      '--delay': `${(Math.random() * 6).toFixed(2)}s`,
      '--dur': `${4 + Math.random() * 5}s`,
    },
  }));
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, WatchAssemblyComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly language = inject(LanguageService);
  readonly particles = makeParticles(22);

  readonly articles: JournalArticle[] = [
    {
      kicker: { es: 'Materiales', en: 'Materials' },
      title: { es: 'Por que el titanio cambio la relojeria diaria', en: 'Why titanium changed daily watchmaking' },
      excerpt: {
        es: 'Ligero, tecnico y silenciosamente lujoso: una guia para entender la nueva caja deportiva.',
        en: 'Light, technical and quietly luxurious: a guide to the new sport case.',
      },
      imageUrl: '/assets/watches/atlas-tourbillon.webp',
    },
    {
      kicker: { es: 'Mecanica', en: 'Mechanics' },
      title: { es: 'El placer invisible de un calibre bien acabado', en: 'The invisible pleasure of a well-finished caliber' },
      excerpt: {
        es: 'Anglage, puentes, masa oscilante y proporcion: detalles que separan objeto y pieza de coleccion.',
        en: 'Anglage, bridges, rotor and proportion: details that separate object from collectible.',
      },
      imageUrl: '/assets/watches/polar-skeleton.webp',
    },
    {
      kicker: { es: 'Cuidado', en: 'Care' },
      title: { es: 'Como guardar un reloj cuando no se lleva', en: 'How to store a watch when it is off the wrist' },
      excerpt: {
        es: 'Humedad, luz, magnetismo y correas: pequenos habitos que conservan valor y presencia.',
        en: 'Humidity, light, magnetism and straps: small habits that preserve value and presence.',
      },
      imageUrl: '/assets/watches/nocturne-ultrathin.webp',
    },
  ];

  localize(text: LocalizedText): string {
    return this.language.localize(text);
  }
}
