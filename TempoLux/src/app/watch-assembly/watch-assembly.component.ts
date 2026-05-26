import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../language.service';

const PIECES = [
  { key: 'strap',   className: 'piece-strap',   offset: '0, -110px, 0',   rotation: -12 },
  { key: 'case',    className: 'piece-case',     offset: '-120px, 0, 0',   rotation: 18  },
  { key: 'dial',    className: 'piece-dial',     offset: '120px, 0, 0',    rotation: -20 },
  { key: 'markers', className: 'piece-markers',  offset: '0, 110px, 0',    rotation: 25  },
  { key: 'hands',   className: 'piece-hands',    offset: '-80px, 80px, 0', rotation: -35 },
  { key: 'crown',   className: 'piece-crown',    offset: '90px, -25px, 0', rotation: 14  },
] as const;

export const PARTICLE_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

@Component({
  selector: 'app-watch-assembly',
  imports: [CommonModule],
  templateUrl: './watch-assembly.component.html',
  styleUrl: './watch-assembly.component.css',
})
export class WatchAssemblyComponent implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private frameId = 0;

  readonly language = inject(LanguageService);
  readonly pieces = PIECES;
  readonly progress = signal(0);
  readonly particleAngles = PARTICLE_ANGLES;

  readonly showParticles = computed(() => this.completeOpacity() > 0.55);

  ngAfterViewInit(): void {
    this.startLoop();
  }

  ngOnDestroy(): void {
    window.cancelAnimationFrame(this.frameId);
  }

  pieceOpacity(index: number): number {
    return this.pieceAmount(index);
  }

  pieceFilter(index: number): string {
    const amount = this.pieceAmount(index);
    if (amount >= 1) return 'contrast(1.08) saturate(0.98)';
    const blur = (1 - amount) * 9;
    return `contrast(1.08) saturate(0.94) blur(${blur}px)`;
  }

  pieceTransform(index: number, offset: string, rotation: number): string {
    const amount = this.pieceAmount(index);
    if (amount >= 1) return 'translate3d(0,0,0) scale(1) rotate(0deg)';
    const rot = rotation * (1 - amount);
    const scale = 0.86 + amount * 0.14;
    return `translate3d(${offset}) scale(${scale}) rotate(${rot}deg)`;
  }

  pieceShadow(index: number): string {
    const amount = this.pieceAmount(index);
    if (amount < 0.95) return '';
    const fade = Math.min(1, (amount - 0.95) / 0.05);
    const alpha = Math.round(fade * 80).toString(16).padStart(2, '0');
    return `drop-shadow(0 0 22px #d8b76f${alpha})`;
  }

  completeOpacity(): number {
    return Math.min(1, Math.max(0, (this.progress() - 0.82) / 0.14));
  }

  particleStyle(angleIndex: number): Record<string, string> {
    const angle = PARTICLE_ANGLES[angleIndex];
    const rad = (angle * Math.PI) / 180;
    const dist = 70 + (angleIndex % 3) * 22;
    const dx = Math.sin(rad) * dist;
    const dy = -Math.cos(rad) * dist;
    const delay = (angleIndex * 0.06).toFixed(2);
    return {
      '--dx': `${dx}px`,
      '--dy': `${dy}px`,
      '--delay': `${delay}s`,
    };
  }

  private startLoop(): void {
    const tick = () => {
      this.updateProgress();
      this.frameId = window.requestAnimationFrame(tick);
    };
    this.frameId = window.requestAnimationFrame(tick);
  }

  private updateProgress(): void {
    const section = this.host.nativeElement.querySelector('[data-assembly-section]') as HTMLElement | null;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
    this.progress.set(Math.min(1, Math.max(0, -rect.top / distance)));
  }

  private pieceAmount(index: number): number {
    const start = index * 0.13;
    return Math.min(1, Math.max(0, (this.progress() - start) / 0.17));
  }
}
