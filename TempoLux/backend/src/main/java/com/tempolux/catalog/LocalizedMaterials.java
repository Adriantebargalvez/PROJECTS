package com.tempolux.catalog;

import java.util.List;

/** Lista de materiales bilingüe para mostrar en la tarjeta del reloj (español / inglés). */
public record LocalizedMaterials(List<String> es, List<String> en) {
}
