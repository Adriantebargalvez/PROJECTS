import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AudioPlayerState, AudioService } from './audio/audio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly playerState$: Observable<AudioPlayerState>;

  constructor(
    public router: Router,
    private audioService: AudioService
  ) {
    this.playerState$ = this.audioService.playerState$;
  }

  get isAuthRoute(): boolean {
    return this.router.url.startsWith('/login') || this.router.url.startsWith('/register');
  }
}
