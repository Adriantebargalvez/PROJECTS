import { computed, Injectable, signal } from '@angular/core';
import { Language, LocalizedText, Watch } from './watch';

export const APP_COPY = {
  es: {
    navJournal: 'Revista',
    navCatalog: 'Catálogo',
    navCustomize: 'Diseña tu reloj',
    navAccessories: 'Accesorios',
    languageLabel: 'Idioma',
    footerLead: 'TempoLux crea una experiencia editorial y privada alrededor de la relojeria contemporanea.',
    footerCatalog: 'Ver catálogo',
    footerJournal: 'Volver al inicio',
    footerCustomize: 'Diseña tu reloj',
    home: {
      eyebrow: 'Maison independiente',
      title: 'TempoLux',
      lead:
        'Una revista de relojeria moderna donde el diseno, la mecanica y el ritual de coleccionar se presentan con imagenes reales y una mirada de lujo.',
      catalogCta: 'Ver catálogo',
      storyCta: 'Leer editorial',
      customizeCta: 'Diseña tu pieza única',
      dispatch: 'Diario de taller',
      dispatchTitle: 'La pieza no empieza en la vitrina, empieza en el gesto.',
      dispatchLead:
        'Cada articulo explora materiales, calibres y decisiones de estilo antes de llegar a la coleccion disponible.',
      assemblyEyebrow: 'Montaje realista por scroll',
      assemblyTitle: 'El reloj aparece pieza por pieza mientras bajas',
      assemblyLead:
        'Una fotografia real permanece fija en pantalla y se revela por capas: correa, caja, esfera, indices, agujas y corona.',
      assemblyProgress: 'Ensamblaje',
      articlesEyebrow: 'Blog editorial',
      articlesTitle: 'Notas de lujo, tecnica y presencia',
      customizerEyebrow: 'Atelier digital',
      customizerTitle: 'Diseña tu reloj ideal',
      customizerLead: 'Combina materiales, acabados y colores. Ve cómo queda en tiempo real antes de añadirlo a tu cesta.',
      customizerCta: 'Abrir el atelier',
    },
    assemblySteps: ['Correa', 'Caja', 'Esfera', 'Índices', 'Agujas', 'Corona'],
    catalog: {
      eyebrow: 'Coleccion privada',
      title: 'Relojes exclusivos disponibles',
      lead:
        'Diez piezas con fotografias reales, materiales nobles y precio orientativo para iniciar una consulta privada.',
      loading: 'Cargando catalogo desde la API...',
      error: 'No se pudo cargar el catalogo desde la API.',
      buy: 'Comprar',
      addToCart: 'Añadir a la cesta',
      materials: 'Materiales',
      contactEyebrow: 'Contacto privado',
      contactTitle: 'Reserva una consulta',
      contactLead: 'Selecciona un reloj y deja preparada la solicitud comercial.',
      selected: 'Reloj seleccionado',
      noSelection: 'Selecciona una pieza del catalogo',
      nameLabel: 'Nombre',
      emailLabel: 'Email',
      messageLabel: 'Mensaje',
      send: 'Solicitar informacion',
    },
    cart: {
      title: 'Tu Cesta',
      openCart: 'Abrir cesta de compra',
      empty: 'Tu cesta está vacía',
      emptySub: 'Explora el catálogo o diseña tu pieza única',
      checkout: 'Ir al pago',
      continueShopping: 'Seguir comprando',
      total: 'Total',
      freeShipping: 'Envío gratuito e incluido',
    },
    customizer: {
      back: 'Volver',
      eyebrow: 'Atelier Digital',
      title: 'Diseña tu pieza única',
      strapLabel: 'Correa',
      caseLabel: 'Caja',
      dialLabel: 'Esfera',
      handsLabel: 'Agujas',
      livePreview: 'Vista en tiempo real',
      price: 'Precio de pieza única',
      uniquePiece: 'Fabricada a medida en Suiza. Entrega en 8–12 semanas.',
      addToCart: 'Añadir a la cesta',
      added: '¡Añadido a la cesta!',
    },
    checkout: {
      back: 'Volver al catálogo',
      secure: 'Pago seguro SSL',
      orderSummary: 'Resumen del pedido',
      emptyCart: 'Tu cesta está vacía',
      goToCatalog: 'Ver catálogo',
      subtotal: 'Subtotal',
      shipping: 'Envío',
      freeShipping: 'Gratuito',
      tax: 'IVA (21%)',
      total: 'Total',
      paymentDetails: 'Datos de pago',
      cardholderInfo: 'Titular',
      cardDetails: 'Tarjeta',
      billingAddress: 'Dirección de facturación',
      cardName: 'Nombre del titular',
      emailLabel: 'Email',
      cardNumber: 'Número de tarjeta',
      expiry: 'Caducidad',
      cvv: 'CVV',
      country: 'País',
      city: 'Ciudad',
      zip: 'Código postal',
      trustBadge: 'Cifrado SSL de 256 bits. Tus datos están protegidos.',
      placeOrder: 'Confirmar pedido',
      processing: 'Procesando...',
      successEyebrow: 'Pedido confirmado',
      successTitle: 'Gracias por tu confianza',
      successLead: 'Hemos recibido tu pedido. Recibirás un email de confirmación en breve.',
      orderRef: 'Número de pedido',
      successCta: 'Seguir explorando',
    },
  },
  en: {
    navJournal: 'Journal',
    navCatalog: 'Catalog',
    navCustomize: 'Design your watch',    navAccessories: 'Accessories',    languageLabel: 'Language',
    footerLead: 'TempoLux builds an editorial and private experience around contemporary watchmaking.',
    footerCatalog: 'View catalog',
    footerJournal: 'Back to journal',
    footerCustomize: 'Design your watch',
    home: {
      eyebrow: 'Independent maison',
      title: 'TempoLux',
      lead:
        'A modern watch journal where design, mechanics and the collecting ritual are presented through real imagery and a luxury point of view.',
      catalogCta: 'View catalog',
      storyCta: 'Read editorial',
      customizeCta: 'Design your unique piece',
      dispatch: 'Atelier notes',
      dispatchTitle: 'A piece does not begin in the showcase, it begins in the gesture.',
      dispatchLead:
        'Each article explores materials, calibers and style decisions before arriving at the available collection.',
      assemblyEyebrow: 'Realistic scroll assembly',
      assemblyTitle: 'The watch appears piece by piece as you scroll',
      assemblyLead:
        'A real photograph stays fixed on screen and is revealed through layers: strap, case, dial, markers, hands and crown.',
      assemblyProgress: 'Assembly',
      articlesEyebrow: 'Editorial blog',
      articlesTitle: 'Notes on luxury, engineering and presence',
      customizerEyebrow: 'Digital atelier',
      customizerTitle: 'Design your ideal watch',
      customizerLead: 'Combine materials, finishes and colors. See how it looks in real time before adding it to your cart.',
      customizerCta: 'Open the atelier',
    },
    assemblySteps: ['Strap', 'Case', 'Dial', 'Markers', 'Hands', 'Crown'],
    catalog: {
      eyebrow: 'Private collection',
      title: 'Exclusive watches available',
      lead:
        'Ten pieces with real photography, noble materials and reference pricing for a private consultation.',
      loading: 'Loading catalog from the API...',
      error: 'The catalog could not be loaded from the API.',
      buy: 'Buy',
      addToCart: 'Add to cart',
      materials: 'Materials',
      contactEyebrow: 'Private contact',
      contactTitle: 'Book a consultation',
      contactLead: 'Select a watch and prepare a commercial request.',
      selected: 'Selected watch',
      noSelection: 'Select a piece from the catalog',
      nameLabel: 'Name',
      emailLabel: 'Email',
      messageLabel: 'Message',
      send: 'Request information',
    },
    cart: {
      title: 'Your Cart',
      openCart: 'Open shopping cart',
      empty: 'Your cart is empty',
      emptySub: 'Explore the catalog or design your unique piece',
      checkout: 'Proceed to checkout',
      continueShopping: 'Continue shopping',
      total: 'Total',
      freeShipping: 'Free shipping included',
    },
    customizer: {
      back: 'Back',
      eyebrow: 'Digital Atelier',
      title: 'Design your unique piece',
      strapLabel: 'Strap',
      caseLabel: 'Case',
      dialLabel: 'Dial',
      handsLabel: 'Hands',
      livePreview: 'Live preview',
      price: 'Unique piece price',
      uniquePiece: 'Swiss-made to order. Delivery in 8–12 weeks.',
      addToCart: 'Add to cart',
      added: 'Added to cart!',
    },
    checkout: {
      back: 'Back to catalog',
      secure: 'SSL Secure',
      orderSummary: 'Order summary',
      emptyCart: 'Your cart is empty',
      goToCatalog: 'View catalog',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      freeShipping: 'Free',
      tax: 'VAT (21%)',
      total: 'Total',
      paymentDetails: 'Payment details',
      cardholderInfo: 'Cardholder',
      cardDetails: 'Card',
      billingAddress: 'Billing address',
      cardName: 'Name on card',
      emailLabel: 'Email',
      cardNumber: 'Card number',
      expiry: 'Expiry',
      cvv: 'CVV',
      country: 'Country',
      city: 'City',
      zip: 'Postal code',
      trustBadge: '256-bit SSL encryption. Your data is protected.',
      placeOrder: 'Place order',
      processing: 'Processing...',
      successEyebrow: 'Order confirmed',
      successTitle: 'Thank you for your trust',
      successLead: 'Your order has been received. A confirmation email will follow shortly.',
      orderRef: 'Order reference',
      successCta: 'Continue exploring',
    },
  },
} as const;

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  // Recuperamos el idioma guardado en la sesión anterior; si no hay nada, español por defecto
  readonly language = signal<Language>((localStorage.getItem('tempolux-lang') as Language) ?? 'es');

  // copy se recalcula automáticamente cada vez que cambia el idioma
  readonly copy = computed(() => APP_COPY[this.language()]);

  setLanguage(language: Language): void {
    this.language.set(language);
    // Persiste la elección para que se recuerde al volver a la web
    localStorage.setItem('tempolux-lang', language);
    document.documentElement.lang = language;
  }

  localize(text: LocalizedText): string {
    return text[this.language()];
  }

  formatPrice(watch: Watch): string {
    return new Intl.NumberFormat(this.language() === 'es' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency: watch.currency,
      maximumFractionDigits: 0,
    }).format(watch.price);
  }
}

