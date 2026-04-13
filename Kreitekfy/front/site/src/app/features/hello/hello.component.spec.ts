import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/auth/service/auth.service';
import { CancionService } from 'src/app/auth/service/cancion.service';
import { AudioService } from 'src/app/audio/audio.service';

import { HelloComponent } from './hello.component';

describe('HelloComponent', () => {
  let component: HelloComponent;
  let fixture: ComponentFixture<HelloComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let cancionServiceSpy: jasmine.SpyObj<CancionService>;
  let audioServiceSpy: jasmine.SpyObj<AudioService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn', 'getToken']);
    authServiceSpy.isLoggedIn.and.returnValue(false);
    cancionServiceSpy = jasmine.createSpyObj<CancionService>('CancionService', ['getAll']);
    cancionServiceSpy.getAll.and.returnValue(of({
      content: [],
      number: 0,
      size: 8,
      first: true,
      last: true,
      totalPages: 0,
      totalElements: 0
    }));
    audioServiceSpy = jasmine.createSpyObj<AudioService>('AudioService', [
      'getSnapshot',
      'searchTracks',
      'togglePlayback',
      'toggleRandomPlayback',
      'playLibraryTrack',
      'createPlaylist',
      'removePlaylist',
      'addTrackToPlaylist',
      'removeTrackFromPlaylist',
      'playPlaylist'
    ], {
      trackLibrary$: of([]),
      playlists$: of([]),
      playerState$: of({
        track: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        progress: 0,
        isReady: false,
        mode: 'random',
        playlistId: null,
        playlistName: null
      })
    });
    audioServiceSpy.searchTracks.and.returnValue([]);
    audioServiceSpy.getSnapshot.and.returnValue({
      track: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      progress: 0,
      isReady: false,
      mode: 'random',
      playlistId: null,
      playlistName: null
    });

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [HelloComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CancionService, useValue: cancionServiceSpy },
        { provide: AudioService, useValue: audioServiceSpy }
      ]
    });
    fixture = TestBed.createComponent(HelloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
