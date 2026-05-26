package com.tempolux.catalog;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class WatchCatalogService {

  // Divisa única del catálogo — centralizada aquí para no repetirla en cada entrada
  private static final String EUR = "EUR";

  // Los 10 modelos exclusivos del catálogo — en producción esto vendría de una base de datos
  private final List<Watch> watches = List.of(
      watch(
          1,
          "aurora-regulator",
          "aurora-regulator.webp",
          "12800",
          "Aurora Diver",
          "Aurora Diver",
          "A precision diver's watch with a deep cobalt dial, unidirectional rotating bezel and luminous hour indices rated to 300 m.",
          "Reloj de buceo de precision con esfera cobalto profunda, bisel giratorio unidireccional e indices luminosos homologado a 300 m.",
          List.of("Caja de acero 316L", "Bisel giratorio cepillado", "Cristal de zafiro antirreflejo"),
          List.of("316L steel case", "Brushed rotating bezel", "Anti-reflective sapphire crystal")),
      watch(
          2,
          "obsidian-moonphase",
          "obsidian-moonphase.webp",
          "16500",
          "Obsidian Submariner",
          "Submariner Obsidiana",
          "A two-tone sport watch in gold and steel with a vivid blue ceramic bezel, luminous markers and a date window at 3 o'clock.",
          "Reloj deportivo bicolor en oro y acero con bisel ceramico azul vivo, marcadores luminosos y fecha a las 3 en punto.",
          List.of("Caja Oyster acero y oro amarillo 18 kt", "Bisel ceramico azul unidireccional", "Brazalete Oyster integrado"),
          List.of("Oyster steel and 18k yellow gold case", "Unidirectional blue ceramic bezel", "Integrated Oyster bracelet")),
      watch(
          3,
          "atlas-tourbillon",
          "atlas-tourbillon.webp",
          "42000",
          "Atlas Explorer",
          "Explorer Atlas",
          "A bold explorer's timepiece with a matte black dial, luminous Arabic numerals at 3, 6 and 9, and a robust steel oyster bracelet.",
          "Reloj de explorador con esfera negra mate, numerales arabigos luminosos en 3, 6 y 9, y robusto brazalete Oyster de acero.",
          List.of("Caja de acero inoxidable", "Esfera negra mate con Super-LumiNova", "Brazalete Oyster en acero 904L"),
          List.of("Stainless steel case", "Matte black dial with Super-LumiNova", "Oyster bracelet in 904L steel")),
      watch(
          4,
          "mariner-perpetual",
          "mariner-perpetual.webp",
          "27400",
          "Mariner Slim",
          "Slim Mariner",
          "An ultra-minimalist dress watch with a pristine white dial, slender rose gold case and a supple two-tone grain leather strap.",
          "Reloj de vestir ultra-minimalista con esfera blanca pristina, caja fina en oro rosa y correa de cuero grano bicolor.",
          List.of("Caja en oro rosa laminado", "Esfera blanca lacada sin numerales", "Correa de cuero grano bicolor"),
          List.of("Rose gold-plated case", "Lacquered white dial without numerals", "Two-tone grain leather strap")),
      watch(
          5,
          "solstice-chrono",
          "solstice-chrono.webp",
          "21800",
          "Solstice Skeleton",
          "Skeleton Solsticio",
          "A skeletonized automatic in black PVD steel with an exposed rose gold movement, Roman numeral chapter ring and sapphire crystal.",
          "Automatico esqueletado en acero PVD negro con movimiento oro rosa expuesto, corona de numerales romanos y cristal de zafiro.",
          List.of("Caja PVD negro satinado", "Movimiento esqueletado oro rosa", "Brazalete de acero tratado PVD"),
          List.of("Satin black PVD case", "Open-worked rose gold movement", "Black PVD-treated steel bracelet")),
      watch(
          6,
          "eclipse-gmt",
          "eclipse-gmt.webp",
          "14600",
          "Eclipse Sport",
          "Sport Eclipse",
          "A robust sports watch with a deep charcoal dial, engine-turned coin-edge bezel and a polished steel oyster bracelet.",
          "Reloj deportivo robusto con esfera carbon profunda, bisel guilloché y brazalete Oyster de acero pulido.",
          List.of("Caja de acero pulido Oyster", "Bisel guilloché tipo moneda", "Brazalete Oyster acero 904L"),
          List.of("Polished Oyster steel case", "Coin-edge guilloché bezel", "904L steel Oyster bracelet")),
      watch(
          7,
          "verdant-minute-repeater",
          "verdant-minute-repeater.webp",
          "89000",
          "Verdant Skeleton",
          "Skeleton Verdant",
          "An open-worked automatic with an exposed gear train finished in rose gold, worn on a supple black leather strap.",
          "Automatico esqueletado con tren de engranajes expuesto acabado en oro rosa, sobre correa de cuero negro suave.",
          List.of("Caja en oro rosa pulido 18 kt", "Esfera esqueletada con engranajes visibles", "Correa de cuero negro premium"),
          List.of("Polished 18k rose gold case", "Skeletonized dial with visible gear train", "Premium black leather strap")),
      watch(
          8,
          "polar-skeleton",
          "polar-skeleton.webp",
          "33400",
          "Polar Submariner",
          "Submariner Polar",
          "A prestigious dive watch in two-tone gold and steel with a vivid blue ceramic bezel and dial, water-resistant to 300 m.",
          "Reloj de buceo de prestigio en dos tonos oro y acero con bisel y esfera ceramicos azules, resistente a 300 m.",
          List.of("Caja Oyster oro amarillo 18 kt y acero", "Bisel ceramico azul unidireccional", "Cristal de zafiro antirreflejo grueso"),
          List.of("18k yellow gold and steel Oyster case", "Unidirectional blue ceramic bezel", "Thick anti-reflective sapphire crystal")),
      watch(
          9,
          "nocturne-ultrathin",
          "nocturne-ultrathin.webp",
          "19200",
          "Nocturne Datejust",
          "Datejust Nocturne",
          "A classic dress watch with a sunburst chocolate dial, diamond-set hour markers and a polished fluted bezel.",
          "Reloj clasico de vestir con esfera chocolate efecto sol, marcadores de hora con diamantes y bisel acanalado pulido.",
          List.of("Caja Oyster de acero inoxidable", "Esfera chocolate sunburst", "Indices de hora con diamantes engastados"),
          List.of("Oyster stainless steel case", "Chocolate sunburst dial", "Diamond-set hour markers")),
      watch(
          10,
          "terra-annual-calendar",
          "terra-annual-calendar.webp",
          "24700",
          "Terra Chronograph",
          "Cronografo Terra",
          "A professional chronograph with a black dial, day-date complication, rose gold hands and pushers, and a robust diver's bezel.",
          "Cronografo profesional con esfera negra, complicacion dia-fecha, agujas y pulsadores en oro rosa y bisel de buceo robusto.",
          List.of("Caja de acero y oro rosa", "Esfera negra con sub-esferas cronograficas", "Bisel ceramico negro con escala de buceo"),
          List.of("Steel and rose gold case", "Black dial with chronograph sub-dials", "Black ceramic bezel with dive scale")));

  // Índice slug → Watch para búsquedas O(1) en GET /api/watches/{slug}
  private final Map<String, Watch> bySlug = watches.stream()
      .collect(Collectors.toUnmodifiableMap(Watch::slug, w -> w));

  // Devuelve el catálogo completo — el frontend carga todos los relojes al entrar al catálogo
  public List<Watch> findAll() {
    return watches;
  }

  // Búsqueda directa en el mapa en lugar de iterar la lista en cada request
  public Optional<Watch> findBySlug(String slug) {
    return Optional.ofNullable(bySlug.get(slug));
  }

  private static Watch watch(
      int id,
      String slug,
      String imageName,
      String price,
      String nameEn,
      String nameEs,
      String descriptionEn,
      String descriptionEs,
      List<String> materialsEs,
      List<String> materialsEn) {
    return new Watch(
        id,
        slug,
        "/assets/watches/" + imageName,
        new BigDecimal(price),
        EUR,
        new LocalizedText(nameEs, nameEn),
        new LocalizedText(descriptionEs, descriptionEn),
        new LocalizedMaterials(materialsEs, materialsEn));
  }
}
