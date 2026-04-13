import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AudioPlayerState, AudioService } from '../audio.service';

@Component({
  selector: 'app-mini-player',
  templateUrl: './mini-player.component.html',
  styleUrls: ['./mini-player.component.css']
})
export class MiniPlayerComponent {
  readonly playerState$: Observable<AudioPlayerState> = this.audioService.playerState$;

  constructor(private audioService: AudioService) { }

  getPlaybackContext(state: AudioPlayerState): string {
    if (state.mode === 'playlist-ordered') {
      return `${state.playlistName ?? 'Playlist'} / en orden`;
    }

    if (state.mode === 'playlist-random') {
      return `${state.playlistName ?? 'Playlist'} / aleatorio`;
    }

    if (state.mode === 'random') {
      return 'Reproduccion aleatoria';
    }

    return 'Seleccion actual';
  }

  togglePlayback(): void {
    void this.audioService.togglePlayback();
  }

  skipForward(): void {
    this.audioService.skipBy(10);
  }

  skipBackward(): void {
    this.audioService.skipBy(-10);
  }

  seekPlayback(event: Event): void {
    const nextTime = Number((event.target as HTMLInputElement).value);
    this.audioService.seekTo(nextTime);
  }

  formatTime(totalSeconds: number): string {
    const safeSeconds = Number.isFinite(totalSeconds) ? Math.max(0, Math.floor(totalSeconds)) : 0;
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
