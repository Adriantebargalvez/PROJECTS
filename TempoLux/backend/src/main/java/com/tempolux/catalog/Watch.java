package com.tempolux.catalog;

import java.math.BigDecimal;

/** Modelo inmutable de un reloj del catálogo. Incluye nombre, descripción y materiales en ES/EN. */
public record Watch(
    int id,
    String slug,
    String imageUrl,
    BigDecimal price,
    String currency,
    LocalizedText name,
    LocalizedText description,
    LocalizedMaterials materials) {
}
