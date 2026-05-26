/** Idiomas soportados por la aplicación */
export type Language = 'es' | 'en';

/** Par de texto bilingüe para nombres y descripciones */
export interface LocalizedText {
  es: string;
  en: string;
}

/** Lista de materiales bilingüe para mostrar en la tarjeta del catálogo */
export interface LocalizedMaterials {
  es: string[];
  en: string[];
}

/** Modelo de reloj tal como lo devuelve el backend */
export interface Watch {
  id: number;
  slug: string;
  imageUrl: string;
  price: number;
  currency: 'EUR'; // divisa única en esta versión
  name: LocalizedText;
  description: LocalizedText;
  materials: LocalizedMaterials;
}
