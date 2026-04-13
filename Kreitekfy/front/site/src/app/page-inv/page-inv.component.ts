import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CancionService } from '../auth/service/cancion.service';
import { AudioPlayerState, AudioService } from '../audio/audio.service';
import { Cancion } from '../common/cancion';

@Component({
  selector: 'app-page-inv',
  templateUrl: './page-inv.component.html',
  styleUrls: ['./page-inv.component.css']
})
export class PageInvComponent implements OnInit, OnDestroy {
  readonly ratingOptions = [1, 2, 3, 4];
  cancion: Cancion | undefined;
  playerState: AudioPlayerState;

  private readonly subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private cancionService: CancionService,
    private audioService: AudioService
  ) {
    this.playerState = this.audioService.getSnapshot();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.audioService.playerState$.subscribe(state => {
        this.playerState = state;
      })
    );

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cancionService.getCancionById(Number(id)).subscribe(
        (data: Cancion) => {
          this.cancion = data;
        },
        (error) => {
          console.error('Error al obtener los detalles de la canciÃ³n:', error);
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async reproducirCancion(): Promise<void> {
    if (!this.cancion) {
      return;
    }

    if (this.isCurrentTrack) {
      await this.audioService.togglePlayback();
      return;
    }

    const didStartNewTrack = await this.audioService.playTrack(this.cancion);
    if (didStartNewTrack) {
      this.registerPlay();
    }
  }

  valorarCancion(puntuacion: number): void {
    if (this.cancion && this.cancion.id) {
      this.cancionService.valorarCancion(this.cancion.id, puntuacion).subscribe(
        () => {
          if (this.cancion) {
            this.cancion.puntuacion = puntuacion;
          }
        },
        (error) => {
          console.error('Error al valorar la canciÃ³n:', error);
        }
      );
    }
  }

  trackByRating(_: number, rating: number): number {
    return rating;
  }

  skipForward(): void {
    void this.adjustPlayback(10);
  }

  skipBackward(): void {
    void this.adjustPlayback(-10);
  }

  seekPlayback(event: Event): void {
    if (!this.isCurrentTrack) {
      return;
    }

    const nextTime = Number((event.target as HTMLInputElement).value);
    this.audioService.seekTo(nextTime);
  }

  get isCurrentTrack(): boolean {
    return this.audioService.isCurrentTrack(this.cancion);
  }

  get isPlayingCurrentTrack(): boolean {
    return this.isCurrentTrack && this.playerState.isPlaying;
  }

  get playerProgressPercent(): number {
    return this.isCurrentTrack ? this.playerState.progress : 0;
  }

  get playerCurrentTime(): number {
    return this.isCurrentTrack ? this.playerState.currentTime : 0;
  }

  get playerDuration(): number {
    if (this.isCurrentTrack && this.playerState.duration > 0) {
      return this.playerState.duration;
    }

    return this.cancion ? this.parseDuration(this.cancion.duracion) : 0;
  }

  get playerCurrentTimeLabel(): string {
    return this.formatTime(this.playerCurrentTime);
  }

  get playerDurationLabel(): string {
    return this.formatTime(this.playerDuration);
  }

  get playerStatusLabel(): string {
    if (this.isPlayingCurrentTrack) {
      return 'En reproduccion';
    }

    if (this.isCurrentTrack) {
      return 'En pausa';
    }

    return 'Lista para reproducir';
  }

  get playbackActionLabel(): string {
    return this.isPlayingCurrentTrack ? 'Pausar' : 'Reproducir';
  }

  get popularityPercent(): number {
    if (!this.cancion) {
      return 0;
    }

    return Math.min(100, Math.max(15, Math.round(this.cancion.reproducciones / 30)));
  }

  private async adjustPlayback(deltaSeconds: number): Promise<void> {
    const isReady = await this.ensureCurrentTrack();
    if (isReady) {
      this.audioService.skipBy(deltaSeconds);
    }
  }

  private async ensureCurrentTrack(): Promise<boolean> {
    if (!this.cancion) {
      return false;
    }

    if (this.isCurrentTrack) {
      return true;
    }

    const didStartNewTrack = await this.audioService.playTrack(this.cancion);
    if (didStartNewTrack) {
      this.registerPlay();
    }

    return this.audioService.isCurrentTrack(this.cancion);
  }

  private registerPlay(): void {
    if (!this.cancion?.id) {
      return;
    }

    this.cancionService.reproducirCancion(this.cancion.id).subscribe(
      () => {
        if (this.cancion) {
          this.cancion.reproducciones++;
        }
      },
      (error) => {
        console.error('Error al reproducir la canciÃ³n:', error);
      }
    );
  }

  private parseDuration(duration: string | undefined): number {
    if (!duration) {
      return 0;
    }

    const [minutes = '0', seconds = '0'] = duration.split(':');
    return (Number(minutes) * 60) + Number(seconds);
  }

  private formatTime(totalSeconds: number): string {
    const safeSeconds = Number.isFinite(totalSeconds) ? Math.max(0, Math.floor(totalSeconds)) : 0;
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
