import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CancionService } from 'src/app/auth/service/cancion.service';
import { Cancion } from 'src/app/common/cancion';
import { PageResponse } from 'src/app/common/page-response';
import { environment } from 'src/environments/environment';
import {
  AudioPlayerState,
  AudioService,
  InstrumentalTrack,
  Playlist,
  PlaylistPlaybackMode
} from '../../audio/audio.service';
import { AuthService } from '../../auth/service/auth.service';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.scss']
})
export class HelloComponent implements OnInit, OnDestroy {
  readonly pageSize = 8;
  readonly sort = 'titulo,asc';
  readonly catalogPreviewSize = 6;
  readonly catalogPreviewStep = 6;

  message = 'Tu biblioteca esta lista para continuar.';
  canciones: Cancion[] = [];
  trackLibrary: InstrumentalTrack[] = [];
  playlists: Playlist[] = [];
  page = 0;
  first = true;
  last = false;
  totalPages = 0;
  totalElements = 0;
  isLoading = false;

  nombreFilter = '';
  artistaFilter = '';
  albumFilter = '';
  estiloFilter = '';
  catalogTitleFilter = '';
  catalogArtistFilter = '';
  visibleCatalogCount = this.catalogPreviewSize;
  newPlaylistName = '';
  selectedPlaylistId: number | null = null;
  playerState: AudioPlayerState;

  private readonly subscriptions = new Subscription();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
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
    this.subscriptions.add(
      this.audioService.trackLibrary$.subscribe(trackLibrary => {
        this.trackLibrary = trackLibrary;
      })
    );
    this.subscriptions.add(
      this.audioService.playlists$.subscribe(playlists => {
        this.playlists = playlists;

        if (!playlists.length) {
          this.selectedPlaylistId = null;
          return;
        }

        const selectedPlaylistStillExists = this.selectedPlaylistId !== null
          && playlists.some(playlist => playlist.id === this.selectedPlaylistId);

        if (!selectedPlaylistStillExists) {
          this.selectedPlaylistId = playlists[0].id;
        }
      })
    );

    if (!this.isAuthenticated()) {
      return;
    }

    this.initializeAuthenticatedView();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  get playerActionLabel(): string {
    if (!this.playerState.track || this.playerState.mode !== 'random') {
      return 'Iniciar reproduccion';
    }

    return this.playerState.isPlaying ? 'Pausar reproduccion' : 'Reanudar reproduccion';
  }

  get playerActionIcon(): string {
    return this.playerState.track && this.playerState.mode === 'random' && this.playerState.isPlaying
      ? 'bi-pause-fill'
      : 'bi-play-fill';
  }

  get playerActionDescription(): string {
    if (!this.playerState.track) {
      return `${this.trackLibrary.length} pistas disponibles para una reproduccion aleatoria continua`;
    }

    if (this.playerState.mode === 'random') {
      return `Reproduccion aleatoria activa: ${this.playerState.track.titulo}`;
    }

    if (this.playerState.mode === 'playlist-ordered') {
      return `${this.playerState.playlistName ?? 'Playlist'} en orden: ${this.playerState.track.titulo}`;
    }

    if (this.playerState.mode === 'playlist-random') {
      return `${this.playerState.playlistName ?? 'Playlist'} en modo aleatorio: ${this.playerState.track.titulo}`;
    }

    return `Seleccion actual: ${this.playerState.track.titulo}`;
  }

  get activeFiltersCount(): number {
    return [this.nombreFilter, this.artistaFilter, this.albumFilter, this.estiloFilter]
      .filter(value => value.trim().length > 0)
      .length;
  }

  get currentPage(): number {
    return this.page + 1;
  }

  get pageProgress(): number {
    if (!this.totalPages) {
      return 0;
    }

    return Math.round((this.currentPage / this.totalPages) * 100);
  }

  get hasSongs(): boolean {
    return this.canciones.length > 0;
  }

  get featuredSong(): Cancion | undefined {
    return this.canciones[0];
  }

  get highlightedSongs(): Cancion[] {
    return this.canciones.slice(0, 3);
  }

  get featuredGenres(): string[] {
    return [...new Set(this.canciones.map(cancion => cancion.estilo).filter(Boolean))].slice(0, 5);
  }

  get filteredTrackLibrary(): InstrumentalTrack[] {
    return this.audioService.searchTracks(this.catalogTitleFilter, this.catalogArtistFilter);
  }

  get hasCatalogFilters(): boolean {
    return !!this.catalogTitleFilter.trim() || !!this.catalogArtistFilter.trim();
  }

  get filteredTrackCount(): number {
    return this.filteredTrackLibrary.length;
  }

  get visibleTrackLibrary(): InstrumentalTrack[] {
    return this.filteredTrackLibrary.slice(0, this.visibleCatalogCount);
  }

  get remainingTrackCount(): number {
    return Math.max(0, this.filteredTrackCount - this.visibleTrackLibrary.length);
  }

  get canShowMoreTracks(): boolean {
    return this.remainingTrackCount > 0;
  }

  get canShowLessTracks(): boolean {
    return this.filteredTrackCount > this.catalogPreviewSize && this.visibleCatalogCount > this.catalogPreviewSize;
  }

  trackBySongId(_: number, cancion: Cancion): number | string {
    return cancion.id ?? cancion.titulo;
  }

  trackByLibraryTrackId(_: number, track: InstrumentalTrack): number {
    return track.id;
  }

  trackByPlaylistId(_: number, playlist: Playlist): number {
    return playlist.id;
  }

  nextPage(): void {
    if (!this.last) {
      this.page++;
      this.getLista();
    }
  }

  previusPage(): void {
    if (!this.first) {
      this.page--;
      this.getLista();
    }
  }

  searchByFilters(): void {
    this.page = 0;
    this.getLista();
  }

  clearFilters(): void {
    this.nombreFilter = '';
    this.artistaFilter = '';
    this.albumFilter = '';
    this.estiloFilter = '';
    this.page = 0;
    this.getLista();
  }

  clearCatalogFilters(): void {
    this.catalogTitleFilter = '';
    this.catalogArtistFilter = '';
    this.visibleCatalogCount = this.catalogPreviewSize;
  }

  onCatalogSearchChange(): void {
    this.visibleCatalogCount = this.catalogPreviewSize;
  }

  showMoreCatalogTracks(): void {
    this.visibleCatalogCount += this.catalogPreviewStep;
  }

  showLessCatalogTracks(): void {
    this.visibleCatalogCount = this.catalogPreviewSize;
  }

  playRelaxingMix(): void {
    void this.audioService.toggleRandomPlayback();
  }

  accessDemo(): void {
    this.authService.loginAsDemo().subscribe({
      next: (response) => {
        this.authService.saveSession(response.token, response.user);
        this.initializeAuthenticatedView();
      },
      error: (error) => {
        console.error('Demo login failed', error);
        this.authService.startLocalDemoSession();
        this.initializeAuthenticatedView();
      }
    });
  }

  async toggleInstrumentalTrack(track: InstrumentalTrack): Promise<void> {
    if (this.isInstrumentalActive(track.id)) {
      await this.audioService.togglePlayback();
      return;
    }

    await this.audioService.playLibraryTrack(track.id);
  }

  createPlaylist(): void {
    const playlist = this.audioService.createPlaylist(this.newPlaylistName);
    if (!playlist) {
      return;
    }

    this.newPlaylistName = '';
    this.selectedPlaylistId = playlist.id;
  }

  removePlaylist(playlistId: number): void {
    this.audioService.removePlaylist(playlistId);
  }

  addTrackToSelectedPlaylist(trackId: number): void {
    if (this.selectedPlaylistId === null) {
      return;
    }

    this.audioService.addTrackToPlaylist(this.selectedPlaylistId, trackId);
  }

  removeTrackFromPlaylist(playlistId: number, trackId: number): void {
    this.audioService.removeTrackFromPlaylist(playlistId, trackId);
  }

  async togglePlaylistPlayback(playlistId: number, mode: PlaylistPlaybackMode): Promise<void> {
    if (this.isPlaylistActive(playlistId, mode)) {
      await this.audioService.togglePlayback();
      return;
    }

    await this.audioService.playPlaylist(playlistId, mode);
  }

  isInstrumentalActive(trackId: number): boolean {
    return this.playerState.track?.id === trackId;
  }

  isPlaylistActive(playlistId: number, mode: PlaylistPlaybackMode): boolean {
    const expectedMode = mode === 'ordered' ? 'playlist-ordered' : 'playlist-random';
    return this.playerState.playlistId === playlistId && this.playerState.mode === expectedMode;
  }

  getPlaylistStatusText(playlist: Playlist): string {
    if (this.playerState.playlistId !== playlist.id) {
      return `${playlist.canciones.length} pistas disponibles`;
    }

    return this.playerState.mode === 'playlist-random'
      ? 'Playlist activa en modo aleatorio'
      : 'Playlist activa en orden';
  }

  private loadWelcomeMessage(): void {
    const token = this.authService.getToken();

    this.http.get<{ message?: string }>(`${environment.apiUrl}/api/v1/hello`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (response) => {
        this.message = response.message || this.message;
      },
      error: (error) => {
        console.error('Error fetching hello message', error);
      }
    });
  }

  private initializeAuthenticatedView(): void {
    if (this.authService.isDemoSession()) {
      this.message = 'Estas viendo el modo demo con una cuenta de invitado y catalogo local.';
    } else {
      this.loadWelcomeMessage();
    }

    this.syncAudioCatalog();
    this.getLista();
  }

  private syncAudioCatalog(): void {
    this.cancionService.getCatalogoCompleto(this.sort).subscribe({
      next: (songs) => {
        this.audioService.syncCatalogSongs(songs);
      },
      error: (error) => {
        console.error('Error syncing audio catalog', error);
      }
    });
  }

  private getLista(): void {
    if (!this.isAuthenticated()) {
      return;
    }

    this.isLoading = true;

    const filters = this.buildFilters();
    this.cancionService.getAll(this.page, this.pageSize, this.sort, filters).subscribe({
      next: (data: PageResponse<Cancion>) => {
        this.canciones = data.content;
        this.first = data.first;
        this.last = data.last;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError(error);
      }
    });
  }

  private buildFilters(): string | undefined {
    const filters: string[] = [];

    if (this.nombreFilter) {
      filters.push(`titulo:MATCH:${this.nombreFilter}`);
    }
    if (this.artistaFilter) {
      filters.push(`artista:MATCH:${this.artistaFilter}`);
    }
    if (this.albumFilter) {
      filters.push(`album:MATCH:${this.albumFilter}`);
    }
    if (this.estiloFilter) {
      filters.push(`estilo:MATCH:${this.estiloFilter}`);
    }

    return filters.length ? filters.join(',') : undefined;
  }

  private handleError(error: unknown): void {
    console.error(error);
  }
}
