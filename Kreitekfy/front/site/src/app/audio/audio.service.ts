import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cancion } from '../common/cancion';
import { AUDIO_CATALOG_SEED } from './audio-catalog.data';

export type PlaybackMode = 'random' | 'fixed' | 'playlist-ordered' | 'playlist-random';
export type PlaylistPlaybackMode = 'ordered' | 'random';

export interface InstrumentalTrack {
  id: number;
  titulo: string;
  artista: string;
  audioUrl: string;
  duracion: string;
  album?: string;
  estilo?: string;
  imagen?: string;
  reproducciones?: number;
  puntuacion?: number;
}

export interface Playlist {
  id: number;
  nombre: string;
  canciones: InstrumentalTrack[];
}

export interface AudioPlayerState {
  track: Cancion | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  isReady: boolean;
  mode: PlaybackMode;
  playlistId: number | null;
  playlistName: string | null;
  errorMessage: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AudioService implements OnDestroy {
  private readonly audio = new Audio();
  private readonly artworkUrl = 'assets/img/apps.10546.13571498826857201.6603a5e2-631f-4f29-9b08-f96589723808-removebg-preview.png';
  private readonly defaultVolume = 0.72;
  private baseTrackLibrary: InstrumentalTrack[] = [];
  private readonly trackLibrarySubject = new BehaviorSubject<InstrumentalTrack[]>([]);
  private readonly playlistsSubject = new BehaviorSubject<Playlist[]>([]);
  private readonly initialState: AudioPlayerState = {
    track: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    progress: 0,
    isReady: false,
    mode: 'random',
    playlistId: null,
    playlistName: null,
    errorMessage: null
  };
  private readonly playerStateSubject = new BehaviorSubject<AudioPlayerState>(this.initialState);

  readonly playerState$: Observable<AudioPlayerState> = this.playerStateSubject.asObservable();
  readonly playlists$: Observable<Playlist[]> = this.playlistsSubject.asObservable();
  readonly trackLibrary$: Observable<InstrumentalTrack[]> = this.trackLibrarySubject.asObservable();

  private nextPlaylistId = 1;
  private randomQueue: number[] = [];
  private lastRandomTrackId: number | null = null;

  private readonly syncStateHandler = () => this.syncState();
  private readonly endHandler = () => {
    void this.handleTrackEnded();
  };
  private readonly errorHandler = () => this.handleNativeAudioError();

  constructor() {
    this.baseTrackLibrary = this.buildBaseTrackLibrary();
    this.trackLibrarySubject.next([...this.baseTrackLibrary]);
    this.audio.preload = 'auto';
    this.audio.volume = this.defaultVolume;
    this.audio.muted = false;
    this.audio.setAttribute('playsinline', 'true');
    this.audio.setAttribute('webkit-playsinline', 'true');

    ['loadedmetadata', 'durationchange', 'timeupdate', 'play', 'pause', 'seeking', 'seeked'].forEach(eventName => {
      this.audio.addEventListener(eventName, this.syncStateHandler);
    });
    this.audio.addEventListener('ended', this.endHandler);
    this.audio.addEventListener('error', this.errorHandler);

    this.loadTrackDurations(this.baseTrackLibrary);
  }

  ngOnDestroy(): void {
    ['loadedmetadata', 'durationchange', 'timeupdate', 'play', 'pause', 'seeking', 'seeked'].forEach(eventName => {
      this.audio.removeEventListener(eventName, this.syncStateHandler);
    });
    this.audio.removeEventListener('ended', this.endHandler);
    this.audio.removeEventListener('error', this.errorHandler);
  }

  getSnapshot(): AudioPlayerState {
    return this.playerStateSubject.value;
  }

  searchTracks(title = '', artist = ''): InstrumentalTrack[] {
    const normalizedTitle = this.normalizeSearchTerm(title);
    const normalizedArtist = this.normalizeSearchTerm(artist);

    return this.trackLibrarySubject.value.filter(track => {
      const matchesTitle = !normalizedTitle || this.normalizeSearchTerm(track.titulo).includes(normalizedTitle);
      const matchesArtist = !normalizedArtist || this.normalizeSearchTerm(track.artista).includes(normalizedArtist);

      return matchesTitle && matchesArtist;
    });
  }

  syncCatalogSongs(canciones: Cancion[]): void {
    const catalogTracks = canciones.map((cancion, index) => this.mapCatalogSongToTrack(cancion, index));
    const dedupedTracks = Array.from(
      new Map(catalogTracks.map(track => [track.id, track])).values()
    );
    const nextLibrary = dedupedTracks.length ? dedupedTracks : [...this.baseTrackLibrary];

    this.trackLibrarySubject.next(nextLibrary);
    this.syncPlaylistsWithLibrary(nextLibrary);
    this.syncCurrentTrackWithLibrary(nextLibrary);
    this.randomQueue = this.randomQueue.filter(trackId => nextLibrary.some(track => track.id === trackId));
    this.loadTrackDurations(nextLibrary);
  }

  isCurrentTrack(track: Cancion | InstrumentalTrack | null | undefined): boolean {
    const currentTrack = this.playerStateSubject.value.track;
    if (!track || !currentTrack) {
      return false;
    }

    if (track.id && currentTrack.id) {
      return track.id === currentTrack.id;
    }

    return track.titulo === currentTrack.titulo && track.artista === currentTrack.artista;
  }

  createPlaylist(nombre: string): Playlist | null {
    const trimmedName = nombre.trim();
    if (!trimmedName) {
      return null;
    }

    const playlist: Playlist = {
      id: this.nextPlaylistId++,
      nombre: trimmedName,
      canciones: []
    };

    this.playlistsSubject.next([...this.playlistsSubject.value, playlist]);
    return playlist;
  }

  removePlaylist(playlistId: number): void {
    const nextPlaylists = this.playlistsSubject.value.filter(playlist => playlist.id !== playlistId);
    this.playlistsSubject.next(nextPlaylists);

    if (this.playerStateSubject.value.playlistId === playlistId) {
      this.pushState({
        mode: 'fixed',
        playlistId: null,
        playlistName: null
      });
    }
  }

  addTrackToPlaylist(playlistId: number, trackId: number): void {
    const track = this.getTrackById(trackId);
    if (!track) {
      return;
    }

    this.playlistsSubject.next(
      this.playlistsSubject.value.map(playlist => {
        if (playlist.id !== playlistId) {
          return playlist;
        }

        if (playlist.canciones.some(item => item.id === trackId)) {
          return playlist;
        }

        return {
          ...playlist,
          canciones: [...playlist.canciones, track]
        };
      })
    );
  }

  removeTrackFromPlaylist(playlistId: number, trackId: number): void {
    this.playlistsSubject.next(
      this.playlistsSubject.value.map(playlist => {
        if (playlist.id !== playlistId) {
          return playlist;
        }

        return {
          ...playlist,
          canciones: playlist.canciones.filter(track => track.id !== trackId)
        };
      })
    );

    const activeState = this.playerStateSubject.value;
    const activePlaylist = this.getPlaylistById(playlistId);
    if (activeState.playlistId === playlistId && activePlaylist && !activePlaylist.canciones.length) {
      this.stop();
    }
  }

  async playLibraryTrack(trackId: number): Promise<boolean> {
    const track = this.getTrackById(trackId);
    if (!track) {
      return false;
    }

    return this.startPlayback(this.mapTrackToSong(track), 'fixed');
  }

  async playTrack(track: Cancion): Promise<boolean> {
    const playbackTrack = this.prepareRequestedTrack(track);
    return this.startPlayback(playbackTrack, 'fixed');
  }

  async playRandomTrack(): Promise<boolean> {
    const nextTrack = this.getNextRandomTrack();
    if (!nextTrack) {
      return false;
    }

    this.lastRandomTrackId = nextTrack.id;
    return this.startPlayback(this.mapTrackToSong(nextTrack), 'random');
  }

  async playPlaylist(playlistId: number, mode: PlaylistPlaybackMode): Promise<boolean> {
    const playlist = this.getPlaylistById(playlistId);
    if (!playlist || !playlist.canciones.length) {
      return false;
    }

    const nextTrack = mode === 'ordered'
      ? playlist.canciones[0]
      : this.getRandomTrackFromCollection(playlist.canciones, null);

    return this.startPlayback(
      this.mapTrackToSong(nextTrack),
      mode === 'ordered' ? 'playlist-ordered' : 'playlist-random',
      playlist
    );
  }

  async toggleRandomPlayback(): Promise<boolean | void> {
    const { track, mode } = this.playerStateSubject.value;

    if (!track || mode !== 'random') {
      return this.playRandomTrack();
    }

    return this.toggleCurrentTrack();
  }

  async togglePlayback(): Promise<boolean | void> {
    if (!this.playerStateSubject.value.track) {
      return this.playRandomTrack();
    }

    return this.toggleCurrentTrack();
  }

  private pause(): void {
    this.audio.pause();
    this.syncState();
  }

  private async resume(): Promise<void> {
    const currentTrack = this.playerStateSubject.value.track;
    if (!currentTrack) {
      return;
    }

    if (!this.audio.src) {
      this.audio.src = currentTrack.previewUrl ?? '';
      this.audio.load();
    }

    if (this.hasReachedTrackEnd()) {
      this.audio.currentTime = 0;
    }

    this.pushState({ errorMessage: null });

    try {
      await this.audio.play();
      this.syncState();
    } catch (error) {
      console.error('Audio resume failed', error);
      this.setPlaybackError(error);
      this.syncState();
    }
  }

  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio.removeAttribute('src');
    this.audio.load();
    this.playerStateSubject.next(this.initialState);
  }

  closePlayer(): void {
    this.stop();
  }

  skipBy(seconds: number): void {
    const duration = this.getResolvedDuration();
    if (!duration) {
      return;
    }

    this.audio.currentTime = this.clamp(this.audio.currentTime + seconds, 0, duration);
    this.syncState();
  }

  seekTo(seconds: number): void {
    const duration = this.getResolvedDuration();
    if (!duration) {
      return;
    }

    this.audio.currentTime = this.clamp(seconds, 0, duration);
    this.syncState();
  }

  private async toggleCurrentTrack(): Promise<boolean | void> {
    if (this.audio.paused) {
      await this.resume();
      return false;
    }

    this.pause();
    return false;
  }

  private async startPlayback(track: Cancion, mode: PlaybackMode, playlist?: Playlist): Promise<boolean> {
    const isSameTrack = this.isCurrentTrack(track);

    if (!track.previewUrl) {
      this.pushState({
        track,
        isPlaying: false,
        isReady: false,
        errorMessage: 'Esta pista no tiene un archivo de audio disponible.'
      });
      return false;
    }

    if (!isSameTrack) {
      this.audio.pause();
      this.audio.src = track.previewUrl;
      this.audio.load();
      this.audio.currentTime = 0;
      this.pushState({
        track,
        currentTime: 0,
        duration: this.parseDuration(track.duracion),
        progress: 0,
        isPlaying: false,
        isReady: false,
        mode,
        playlistId: playlist?.id ?? null,
        playlistName: playlist?.nombre ?? null,
        errorMessage: null
      });
    } else {
      this.pushState({
        mode,
        playlistId: playlist?.id ?? null,
        playlistName: playlist?.nombre ?? null,
        errorMessage: null
      });
    }

    if (this.hasReachedTrackEnd()) {
      this.audio.currentTime = 0;
    }

    try {
      await this.audio.play();
      this.syncState(undefined, mode, playlist);
      return !isSameTrack;
    } catch (error) {
      console.error('Audio playback failed', error);
      this.setPlaybackError(error, track);
      this.syncState(undefined, mode, playlist);
      return false;
    }
  }

  private async handleTrackEnded(): Promise<void> {
    const { mode, playlistId, track } = this.playerStateSubject.value;

    if (mode === 'random') {
      await this.playRandomTrack();
      return;
    }

    if (mode === 'playlist-ordered' && playlistId) {
      const playlist = this.getPlaylistById(playlistId);
      if (!playlist || !track) {
        this.syncState(false);
        return;
      }

      const currentIndex = playlist.canciones.findIndex(item => item.id === track.id);
      const nextTrack = currentIndex >= 0 ? playlist.canciones[currentIndex + 1] : undefined;

      if (!nextTrack) {
        this.syncState(false);
        return;
      }

      await this.startPlayback(this.mapTrackToSong(nextTrack), 'playlist-ordered', playlist);
      return;
    }

    if (mode === 'playlist-random' && playlistId) {
      const playlist = this.getPlaylistById(playlistId);
      if (!playlist || !playlist.canciones.length) {
        this.syncState(false);
        return;
      }

      const nextTrack = this.getRandomTrackFromCollection(playlist.canciones, track?.id ?? null);
      await this.startPlayback(this.mapTrackToSong(nextTrack), 'playlist-random', playlist);
      return;
    }

    this.syncState(false);
  }

  private syncState(
    forceReady = this.audio.readyState >= 1,
    mode = this.playerStateSubject.value.mode,
    playlist = this.playerStateSubject.value.playlistId
      ? this.getPlaylistById(this.playerStateSubject.value.playlistId)
      : undefined
  ): void {
    const currentTrack = this.playerStateSubject.value.track;
    const duration = this.getResolvedDuration(currentTrack);
    const currentTime = this.clamp(this.audio.currentTime || 0, 0, duration || 0);
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    this.pushState({
      currentTime,
      duration,
      progress,
      isPlaying: !this.audio.paused,
      isReady: !!currentTrack && forceReady,
      mode,
      playlistId: playlist?.id ?? null,
      playlistName: playlist?.nombre ?? null
    });
  }

  private handleNativeAudioError(): void {
    const mediaError = this.audio.error;
    let message = 'No se ha podido cargar el audio de esta pista.';

    switch (mediaError?.code) {
      case MediaError.MEDIA_ERR_ABORTED:
        message = 'La reproduccion se ha cancelado antes de completarse.';
        break;
      case MediaError.MEDIA_ERR_NETWORK:
        message = 'Ha fallado la carga del audio. Revisa tu conexion e intentalo de nuevo.';
        break;
      case MediaError.MEDIA_ERR_DECODE:
        message = 'El archivo de audio no se ha podido reproducir en este dispositivo.';
        break;
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        message = 'Este navegador no puede reproducir el formato de audio de esta pista.';
        break;
      default:
        break;
    }

    this.pushState({
      isPlaying: false,
      isReady: false,
      errorMessage: message
    });
  }

  private pushState(partialState: Partial<AudioPlayerState>): void {
    this.playerStateSubject.next({
      ...this.playerStateSubject.value,
      ...partialState
    });
  }

  private getTrackById(trackId: number): InstrumentalTrack | undefined {
    return this.trackLibrarySubject.value.find(track => track.id === trackId);
  }

  private getPlaylistById(playlistId: number): Playlist | undefined {
    return this.playlistsSubject.value.find(playlist => playlist.id === playlistId);
  }

  private prepareRequestedTrack(track: Cancion): Cancion {
    if (track.previewUrl) {
      return {
        ...track,
        previewUrl: track.previewUrl
      };
    }

    const exactMatch = this.findExactTrackMatch(track);
    if (exactMatch) {
      return {
        ...track,
        duracion: exactMatch.duracion,
        previewUrl: exactMatch.audioUrl
      };
    }

    const fallbackTrack = this.getFallbackAudioSource(track);
    return {
      ...track,
      duracion: track.duracion || fallbackTrack.duracion,
      previewUrl: fallbackTrack.audioUrl
    };
  }

  private mapTrackToSong(track: InstrumentalTrack): Cancion {
    return {
      id: track.id,
      titulo: track.titulo,
      artista: track.artista,
      estilo: track.estilo ?? 'Instrumental',
      imagen: track.imagen ?? this.artworkUrl,
      album: track.album ?? 'Coleccion editorial',
      duracion: track.duracion,
      reproducciones: track.reproducciones ?? 0,
      puntuacion: track.puntuacion ?? 4,
      previewUrl: track.audioUrl
    };
  }

  private mapCatalogSongToTrack(cancion: Cancion, index: number): InstrumentalTrack {
    const fallbackTrack = this.getFallbackAudioSource(cancion);

    return {
      id: cancion.id ?? (10000 + index),
      titulo: cancion.titulo,
      artista: cancion.artista,
      audioUrl: cancion.previewUrl ?? fallbackTrack.audioUrl,
      duracion: cancion.duracion || fallbackTrack.duracion,
      album: cancion.album,
      estilo: cancion.estilo,
      imagen: cancion.imagen,
      reproducciones: cancion.reproducciones,
      puntuacion: cancion.puntuacion
    };
  }

  private findExactTrackMatch(track: Cancion): InstrumentalTrack | undefined {
    return this.trackLibrarySubject.value.find(item => {
      if (track.id && item.id === track.id) {
        return true;
      }

      return item.titulo === track.titulo && item.artista === track.artista;
    });
  }

  private getFallbackAudioSource(track: Pick<Cancion, 'id' | 'titulo' | 'artista' | 'album'>): InstrumentalTrack {
    const exactBaseMatch = this.baseTrackLibrary.find(source => source.titulo === track.titulo && source.artista === track.artista);
    if (exactBaseMatch) {
      return exactBaseMatch;
    }

    const trackHash = this.hashValue(`${track.id ?? track.titulo}-${track.artista}-${track.album}`);
    return this.baseTrackLibrary[trackHash % this.baseTrackLibrary.length];
  }

  private getNextRandomTrack(): InstrumentalTrack | undefined {
    const library = this.trackLibrarySubject.value;
    if (!library.length) {
      return undefined;
    }

    if (library.length === 1) {
      return library[0];
    }

    if (!this.randomQueue.length) {
      this.refillRandomQueue();
    }

    const nextTrackId = this.randomQueue.shift();
    return nextTrackId ? this.getTrackById(nextTrackId) : library[0];
  }

  private getRandomTrackFromCollection(collection: InstrumentalTrack[], currentTrackId: number | null): InstrumentalTrack {
    if (collection.length <= 1) {
      return collection[0];
    }

    const availableTracks = collection.filter(track => track.id !== currentTrackId);
    const nextIndex = Math.floor(Math.random() * availableTracks.length);

    return availableTracks[nextIndex];
  }

  private buildBaseTrackLibrary(): InstrumentalTrack[] {
    return AUDIO_CATALOG_SEED.map(track => ({
      id: track.id,
      titulo: track.titulo,
      artista: track.artista,
      audioUrl: track.audioUrl,
      duracion: '00:00'
    }));
  }

  private loadTrackDurations(tracks: InstrumentalTrack[]): void {
    tracks
      .filter(track => !track.duracion || track.duracion === '00:00')
      .forEach(track => {
        const probe = new Audio();
        probe.preload = 'metadata';
        probe.src = track.audioUrl;
        probe.onloadedmetadata = () => {
          this.updateTrackEverywhere(track.id, { duracion: this.formatDuration(probe.duration) });
          probe.src = '';
        };
        probe.onerror = () => {
          probe.src = '';
        };
      });
  }

  private updateTrackEverywhere(trackId: number, partialTrack: Partial<InstrumentalTrack>): void {
    this.baseTrackLibrary = this.baseTrackLibrary.map(track => track.id === trackId ? { ...track, ...partialTrack } : track);

    const currentLibrary = this.trackLibrarySubject.value;
    if (currentLibrary.some(track => track.id === trackId)) {
      this.trackLibrarySubject.next(
        currentLibrary.map(track => track.id === trackId ? { ...track, ...partialTrack } : track)
      );
    }

    this.playlistsSubject.next(
      this.playlistsSubject.value.map(playlist => ({
        ...playlist,
        canciones: playlist.canciones.map(track => track.id === trackId ? { ...track, ...partialTrack } : track)
      }))
    );

    if (this.playerStateSubject.value.track?.id === trackId) {
      this.pushState({
        track: {
          ...this.playerStateSubject.value.track,
          duracion: partialTrack.duracion ?? this.playerStateSubject.value.track.duracion,
          previewUrl: partialTrack.audioUrl ?? this.playerStateSubject.value.track.previewUrl,
          imagen: partialTrack.imagen ?? this.playerStateSubject.value.track.imagen,
          album: partialTrack.album ?? this.playerStateSubject.value.track.album,
          estilo: partialTrack.estilo ?? this.playerStateSubject.value.track.estilo,
          reproducciones: partialTrack.reproducciones ?? this.playerStateSubject.value.track.reproducciones,
          puntuacion: partialTrack.puntuacion ?? this.playerStateSubject.value.track.puntuacion
        }
      });
    }
  }

  private syncPlaylistsWithLibrary(library: InstrumentalTrack[]): void {
    this.playlistsSubject.next(
      this.playlistsSubject.value.map(playlist => ({
        ...playlist,
        canciones: playlist.canciones.map(track => library.find(item => item.id === track.id) ?? track)
      }))
    );
  }

  private syncCurrentTrackWithLibrary(library: InstrumentalTrack[]): void {
    const currentTrack = this.playerStateSubject.value.track;
    if (!currentTrack?.id) {
      return;
    }

    const matchedTrack = library.find(track => track.id === currentTrack.id);
    if (!matchedTrack) {
      return;
    }

    this.pushState({
      track: this.mapTrackToSong(matchedTrack)
    });
  }

  private formatDuration(duration: number): string {
    const safeSeconds = Number.isFinite(duration) ? Math.max(0, Math.round(duration)) : 0;
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  private parseDuration(duration: string | undefined): number {
    if (!duration) {
      return 0;
    }

    const parts = duration.split(':').map(value => Number(value));
    if (parts.some(value => Number.isNaN(value))) {
      return 0;
    }

    if (parts.length === 3) {
      return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
    }

    const [minutes = 0, seconds = 0] = parts;
    return (minutes * 60) + seconds;
  }

  private getResolvedDuration(track: Cancion | null = this.playerStateSubject.value.track): number {
    if (Number.isFinite(this.audio.duration) && this.audio.duration > 0) {
      return this.audio.duration;
    }

    return track ? this.parseDuration(track.duracion) : 0;
  }

  private refillRandomQueue(): void {
    const shuffledQueue = this.trackLibrarySubject.value.map(track => track.id);

    for (let index = shuffledQueue.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffledQueue[index], shuffledQueue[swapIndex]] = [shuffledQueue[swapIndex], shuffledQueue[index]];
    }

    if (shuffledQueue.length > 1 && shuffledQueue[0] === this.lastRandomTrackId) {
      [shuffledQueue[0], shuffledQueue[1]] = [shuffledQueue[1], shuffledQueue[0]];
    }

    this.randomQueue = shuffledQueue;
  }

  private hasReachedTrackEnd(): boolean {
    const duration = this.getResolvedDuration();
    return duration > 0 && this.audio.currentTime >= duration - 0.25;
  }

  private setPlaybackError(error: unknown, track = this.playerStateSubject.value.track): void {
    let message = 'No se ha podido iniciar el audio en este dispositivo.';

    if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError') {
        message = 'El navegador del movil ha bloqueado el audio. Pulsa Reproducir otra vez y comprueba que el movil no este en silencio.';
      } else if (error.name === 'AbortError') {
        message = 'La reproduccion se ha interrumpido antes de empezar. Intentalo de nuevo.';
      }
    }

    this.pushState({
      track,
      isPlaying: false,
      isReady: false,
      errorMessage: message
    });
  }

  private normalizeSearchTerm(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private hashValue(source: string): number {
    let hash = 0;

    for (let index = 0; index < source.length; index++) {
      hash = ((hash << 5) - hash) + source.charCodeAt(index);
      hash |= 0;
    }

    return Math.abs(hash);
  }

  private clamp(value: number, min: number, max: number): number {
    if (max <= min) {
      return min;
    }

    return Math.min(max, Math.max(min, value));
  }
}
