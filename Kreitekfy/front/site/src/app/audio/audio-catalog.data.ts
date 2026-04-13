export interface AudioCatalogSeed {
  id: number;
  titulo: string;
  artista: string;
  audioUrl: string;
}

export const AUDIO_CATALOG_SEED: AudioCatalogSeed[] = [
  {
    id: 2001,
    titulo: 'Soft Horizons',
    artista: 'Nastelbom',
    audioUrl: 'assets/audio/nastelbom-instrumental-instrumental-music-501717.mp3'
  },
  {
    id: 2002,
    titulo: 'Quiet Pages',
    artista: 'Nastelbom',
    audioUrl: 'assets/audio/nastelbom-instrumental-music-501712.mp3'
  },
  {
    id: 2003,
    titulo: 'Solar Drift',
    artista: 'Solarflex',
    audioUrl: 'assets/audio/solarflex-instrumental-495647.mp3'
  },
  {
    id: 2004,
    titulo: 'Mountain Stillness',
    artista: 'The Mountain',
    audioUrl: 'assets/audio/the_mountain-instrumental-513154.mp3'
  },
  {
    id: 2005,
    titulo: 'Summit Echoes',
    artista: 'The Mountain',
    audioUrl: 'assets/audio/the_mountain-instrumental-instrumental-music-508025.mp3'
  }
];
