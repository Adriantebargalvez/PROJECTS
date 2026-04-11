package com.kreitefy.infraestructure.config;

import com.kreitefy.domain.entity.Canciones;
import com.kreitefy.infraestructure.repository.CancionesRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CancionesDataSeeder implements CommandLineRunner {

    private final CancionesRepository cancionesRepository;

    public CancionesDataSeeder(CancionesRepository cancionesRepository) {
        this.cancionesRepository = cancionesRepository;
    }

    @Override
    public void run(String... args) {
        List<Canciones> canciones = List.of(
                buildSong(
                        "Aurora Nocturna",
                        "Luna Varela",
                        "Synthpop",
                        "Neon Skyline",
                        "3:24",
                        1482,
                        4,
                        "https://picsum.photos/seed/aurora-nocturna/640/640"
                ),
                buildSong(
                        "Ritmo en la Ciudad",
                        "Valeria Sol",
                        "Pop",
                        "Luces de Medianoche",
                        "2:58",
                        2140,
                        4,
                        "https://picsum.photos/seed/ritmo-ciudad/640/640"
                ),
                buildSong(
                        "Modo Avion",
                        "Kai Mendoza",
                        "Reggaeton",
                        "Frecuencia Tropical",
                        "3:11",
                        1965,
                        4,
                        "https://picsum.photos/seed/modo-avion/640/640"
                ),
                buildSong(
                        "Electric Bloom",
                        "Mila Rivers",
                        "Electronica",
                        "Signal Hearts",
                        "4:06",
                        1758,
                        3,
                        "https://picsum.photos/seed/electric-bloom/640/640"
                ),
                buildSong(
                        "Cielo de Coral",
                        "Mar Abierto",
                        "Indie Pop",
                        "Horizonte Vivo",
                        "3:43",
                        1320,
                        4,
                        "https://picsum.photos/seed/cielo-coral/640/640"
                ),
                buildSong(
                        "Golden Echo",
                        "Nova Lane",
                        "Dance Pop",
                        "Afterlight",
                        "3:20",
                        2434,
                        4,
                        "https://picsum.photos/seed/golden-echo/640/640"
                ),
                buildSong(
                        "Latidos del Sur",
                        "Sofia Vega",
                        "Latin Pop",
                        "Vibra Serena",
                        "3:05",
                        1648,
                        3,
                        "https://picsum.photos/seed/latidos-del-sur/640/640"
                ),
                buildSong(
                        "Prisma",
                        "Atlas Kids",
                        "Alt Pop",
                        "Color Theory",
                        "2:49",
                        987,
                        3,
                        "https://picsum.photos/seed/prisma-color/640/640"
                ),
                buildSong(
                        "Pulse Runner",
                        "Nico Vale",
                        "House",
                        "After Midnight",
                        "4:12",
                        1894,
                        4,
                        "https://picsum.photos/seed/pulse-runner/640/640"
                ),
                buildSong(
                        "Verano Electrico",
                        "Marea Roja",
                        "Electronica",
                        "Costa Magnetica",
                        "3:31",
                        1566,
                        3,
                        "https://picsum.photos/seed/verano-electrico/640/640"
                ),
                buildSong(
                        "Satellite Love",
                        "Blue Motel",
                        "Pop Rock",
                        "Parallel Hearts",
                        "3:52",
                        1204,
                        4,
                        "https://picsum.photos/seed/satellite-love/640/640"
                ),
                buildSong(
                        "Noche Magenta",
                        "Iris Leone",
                        "Synthwave",
                        "Cosmos Club",
                        "3:38",
                        1712,
                        4,
                        "https://picsum.photos/seed/noche-magenta/640/640"
                ),
                buildSong(
                        "Fuego Atlantic",
                        "Clara Monte",
                        "Latin House",
                        "Marea Solar",
                        "3:16",
                        2088,
                        4,
                        "https://picsum.photos/seed/fuego-atlantic/640/640"
                ),
                buildSong(
                        "Velvet Drive",
                        "Romy Kade",
                        "Electro Pop",
                        "Glow District",
                        "3:44",
                        1456,
                        3,
                        "https://picsum.photos/seed/velvet-drive/640/640"
                ),
                buildSong(
                        "Brisa Digital",
                        "Dario Sun",
                        "Chill Pop",
                        "Pixel Coast",
                        "3:27",
                        1189,
                        4,
                        "https://picsum.photos/seed/brisa-digital/640/640"
                ),
                buildSong(
                        "Midnight Carousel",
                        "The Northern Lights",
                        "Indie Rock",
                        "Blue Avenue",
                        "4:01",
                        1675,
                        4,
                        "https://picsum.photos/seed/midnight-carousel/640/640"
                ),
                buildSong(
                        "Sabor Neon",
                        "Aitana Mar",
                        "Urban Pop",
                        "Club Prisma",
                        "2:57",
                        2210,
                        4,
                        "https://picsum.photos/seed/sabor-neon/640/640"
                ),
                buildSong(
                        "Crystal Motion",
                        "Helix Bloom",
                        "Progressive House",
                        "Skyline Motion",
                        "4:18",
                        1534,
                        3,
                        "https://picsum.photos/seed/crystal-motion/640/640"
                ),
                buildSong(
                        "Palmeras en Marte",
                        "Sol Andromeda",
                        "Synthpop",
                        "Postales del Futuro",
                        "3:33",
                        1842,
                        4,
                        "https://picsum.photos/seed/palmeras-en-marte/640/640"
                ),
                buildSong(
                        "Ruta 94",
                        "Leo Mirage",
                        "Pop Rock",
                        "Kilometro Cero",
                        "3:48",
                        1368,
                        3,
                        "https://picsum.photos/seed/ruta-94/640/640"
                )
        );

        canciones.stream()
                .filter(cancion -> !cancionesRepository.existsByTitulo(cancion.getTitulo()))
                .forEach(cancionesRepository::save);
    }

    private Canciones buildSong(
            String titulo,
            String artista,
            String estilo,
            String album,
            String duracion,
            Integer reproducciones,
            int puntuacion,
            String imagen
    ) {
        Canciones cancion = new Canciones();
        cancion.setTitulo(titulo);
        cancion.setArtista(artista);
        cancion.setEstilo(estilo);
        cancion.setAlbum(album);
        cancion.setDuracion(duracion);
        cancion.setReproducciones(reproducciones);
        cancion.setPuntuacion(puntuacion);
        cancion.setImagen(imagen);
        return cancion;
    }
}
