const body = document.body;
const html = document.documentElement;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const footerLinks = Array.from(document.querySelectorAll(".footer-links a"));
const sections = Array.from(document.querySelectorAll("main section[id]"));
const revealNodes = Array.from(document.querySelectorAll("[data-reveal]"));
const contactForm = document.querySelector("[data-contact-form]");
const languageButtons = Array.from(document.querySelectorAll(".lang-button"));
const metaDescription = document.querySelector('meta[name="description"]');
const whatsappLinks = {
    header: document.querySelector('[data-whatsapp="header"]'),
    contact: document.querySelector('[data-whatsapp="contact"]')
};

const emailAddress = "adriantebar19@gmail.com";
const translations = { es: {}, en: {}, pt: {} };

Object.assign(translations.es, {
    lang: "es",
    pageTitle: "Adrian Contact | Mobiliario premium al por mayor",
    metaDescription: "Adrian Contact presenta mobiliario premium al por mayor para hoteles, restauracion, oficinas, interioristas y distribuidores.",
    brandName: "Adrian Contact",
    brandTagline: "Mobiliario premium para proyectos y distribucion",
    nav: ["Inicio", "Colecciones", "Sobre nosotros", "Marcas", "Contacto"],
    headerWhatsapp: "WhatsApp comercial",
    heroEyebrow: "Ventas al por mayor para hoteles, restaurantes, oficinas e interioristas",
    heroTitle: "Mobiliario exclusivo para espacios que buscan diferenciarse.",
    heroText: "Seleccionamos sillas, mesas, piezas auxiliares y colecciones decorativas con una mirada editorial. La web funciona como catalogo visual: los precios son orientativos y cada pedido se estudia de forma personalizada segun cantidad, acabados, plazos y destino.",
    heroButtons: ["Solicitar propuesta comercial", "Ver colecciones destacadas"],
    metrics: [
        "Referencias orientadas a contract y distribucion",
        "Respuesta comercial para proyectos y pedidos grandes",
        "Red logistica para hosteleria, oficinas y retail"
    ],
    heroCaption: "Selecciones pensadas para proyectos con identidad propia.",
    heroNotes: [
        ["Linea editorial", "Curaduria premium de sillas, mesas y piezas auxiliares"],
        ["Pedido bajo consulta", "Sin carrito ni checkout: gestion comercial directa"]
    ],
    clientele: ["Hoteles boutique", "Restauracion premium", "Oficinas ejecutivas", "Retail de diseno", "Interiorismo y arquitectura"],
    ribbonText: "Los importes mostrados son orientativos y sirven como referencia visual de coleccion. La tarifa final depende del volumen, los acabados, el transporte y las condiciones comerciales de cada proyecto.",
    ribbonLink: "Solicitar tarifa y disponibilidad",
    catalogueEyebrow: "Catalogo editorial",
    catalogueTitle: "Colecciones pensadas para compras en volumen y espacios con presencia.",
    catalogueText: "No presentamos una tienda online tradicional. Mostramos una seleccion comercial de piezas con vocacion arquitectonica, listas para restauracion, hospitality, oficinas y proyectos de interiorismo que necesitan consistencia visual y capacidad de suministro.",
    featureCards: [
        ["Seleccion destacada", "Coleccion Aurelia Lounge", "Butacas envolventes, sofas modulares y mesas bajas con acabados en nogal tostado, boucle arena y metal satinado. Una linea pensada para recepciones, lounges y zonas comunes donde la primera impresion importa.", "Desde 1.490 EUR / conjunto base", "Precio orientativo. Pedido profesional bajo consulta.", "Solicitar acabados y tarifa de proyecto"],
        ["Sillas de autor", "Silla Vetta", "Asiento tapizado, estructura en madera ahumada y silueta ligera para restauracion premium y comedores de hotel.", "Desde 168 EUR / unidad", "Pedido minimo orientado a volumen y canal profesional.", "Consultar cantidades y plazos"],
        ["Enfoque comercial", "Mostramos producto, contexto y rango economico. El cierre se hace contigo.", "Trabajamos con hoteleros, grupos de restauracion, oficinas, distribuidores e interioristas que necesitan una relacion directa, muestras, acabados y condiciones adaptadas a cada operacion."],
        ["Mesas de presencia escultorica", "Mesa Volta Executive", "Sobre ceramico o madera natural, bases centrales de metal mate y formatos adaptados a salas privadas, restaurantes, reuniones ejecutivas y espacios de recepcion.", "Desde 890 EUR / unidad", "Incluye variantes de medidas y acabados segun proyecto.", "Pedir medidas y tarifa mayorista"],
        ["Piezas auxiliares", "Consola Nacre", "Volumen limpio, superficies minerales y detalle metalico discreto para lobby, retail selecto y zonas de paso.", "Desde 620 EUR / unidad", "Ideal para combinar con pedidos de ambientacion completos.", "Solicitar propuesta integral"],
        ["Office y contract", "Linea Axis Work", "Mesas colaborativas, silleria ejecutiva y almacenamiento modular para oficinas con imagen sobria y materialidad noble.", "Desde 245 EUR / puesto", "Condiciones especiales para implantaciones en serie.", "Hablar de implantacion"]
    ],
    featureList: [
        "Sin fichas individuales ni compra online.",
        "Tarifa final segun volumen, tapiceria y logistica.",
        "Atencion comercial para pedidos grandes y recurrentes."
    ],
    assortmentHeads: [
        ["Programa de silleria", "Catalogo curado de sillas para restauracion, hotel y oficina.", "Una seleccion mas amplia para que la web se sienta como un catalogo comercial real y no como una muestra corta."],
        ["Decoracion y auxiliares", "Piezas de apoyo para completar ambientes y proyectos integrales.", "Complementos con la misma lectura premium para recepciones, suites, retail selecto y zonas comunes."]
    ],
    assortmentItems: [
        ["Silla tapizada", "Vetta", "Perfil ligero, respaldo curvo y tapizado neutro para comedores elegantes."],
        ["Dining premium", "Elara", "Madera natural, respaldo amplio y lectura serena para proyectos hoteleros."],
        ["Comedor contract", "Marlo", "Estructura robusta, asiento comodo y acabados para uso intensivo."],
        ["Lounge seat", "Lyra", "Butaca baja para lobby y salas de espera con aire premium."],
        ["Office executive", "Axis Executive", "Silleria de oficina con presencia sobria para implantaciones completas."],
        ["Consola", "Nacre", "Superficies minerales y volumen limpio para lobbies y pasillos nobles."],
        ["Mesa auxiliar", "Tivoli", "Mesa redonda de apoyo para habitaciones premium y recepciones."],
        ["Iluminacion", "Sora", "Lampara escultorica para atmosferas calidas en hospitality de nivel."],
        ["Espejo", "Cael", "Marco fino metalico y lectura elegante para zonas de transito y suites."],
        ["Aparador", "Neri", "Pieza de apoyo con almacenamiento oculto para proyectos residenciales piloto y hotel."]
    ],
    aboutEyebrow: "Sobre la marca",
    aboutTitle: "Una firma creada para dar forma a proyectos con ambicion estetica y escala comercial.",
    aboutText: [
        "Adrian Contact nace como una casa de seleccion y suministro de mobiliario para negocios que quieren elevar su presencia. Reunimos fabricantes, acabados y colecciones con una unica idea: ofrecer piezas que transmitan nivel, funcionen bien en uso intensivo y mantengan coherencia en pedidos grandes.",
        "Nuestro trabajo se mueve entre el interiorismo y la operacion comercial. Acompanamos a grupos hoteleros, restaurantes, oficinas, concept stores y distribuidores que necesitan criterio visual, agilidad de respuesta y una interlocucion clara durante todo el proceso."
    ],
    aboutSignature: ["Filosofia", "Diseno sereno, materiales honestos y servicio comercial con mirada de marca."],
    aboutStats: ["anos curando colecciones contract", "proyectos atendidos", "marcas alineadas con nuestra estetica", "equipo comercial y creativo a medida"],
    expertiseTitles: ["Seleccion cuidada", "Lo que nos diferencia", "Clientes habituales"],
    expertiseTextOne: "Trabajamos pocas lineas, bien escogidas. Cada pieza debe responder a una narrativa visual de alto nivel y a un uso profesional real.",
    expertiseList: [
        "Capacidad para pedidos en volumen y reposiciones.",
        "Asesoramiento en composicion, materiales y combinaciones.",
        "Tarifas comerciales adaptadas a canal profesional.",
        "Respuesta rapida para presupuestos y muestras."
    ],
    expertiseTextThree: "Hoteles boutique, restauracion premium, oficinas corporativas, distribuidores, retail selecto e interioristas.",
    brandsEyebrow: "Firmas asociadas",
    brandsTitle: "Marcas con lenguaje propio dentro de una misma sensibilidad premium.",
    brandsText: "La seleccion combina colecciones mediterraneas, lineas contemporaneas, soluciones para hospitality, oficina elegante y piezas con una lectura artesanal refinada.",
    brandTexts: [
        "Silleria de autor para restaurantes, clubs privados y recepciones con aire cosmopolita.",
        "Maderas oscuras, estructuras sobrias y mesas de presencia escultorica para hospitality y despachos ejecutivos.",
        "Inspiracion mediterranea serena, fibras tecnicas y tapicerias suaves para terrazas sofisticadas y hoteles costeros.",
        "Lineas minimalistas y proporciones precisas para oficinas premium y proyectos de arquitectura interior.",
        "Mesas, taburetes y piezas auxiliares con caracter mediterraneo y acabados duraderos para restauracion.",
        "Soluciones modulares para implantaciones en serie, zonas comunes y proyectos corporativos de gran escala.",
        "Piezas calidas y tactiles para suites, recepciones y espacios donde el detalle material es protagonista.",
        "Decoracion, consolas y complementos de linea tranquila para dar continuidad visual a proyectos completos."
    ],
    contactEyebrow: "Contacto comercial",
    contactTitle: "Solicita informacion, disponibilidad o presupuesto para pedidos grandes.",
    contactText: "Trabajamos exclusivamente con un enfoque comercial y mayorista. Si estas equipando un hotel, restaurante, oficina, vivienda piloto, retail o canal distribucion, escribenos. Te enviaremos referencias, acabados, plazos y tarifa orientada a tu volumen.",
    contactButtons: ["WhatsApp directo"],
    contactPoints: [
        "Precios publicados como referencia, no como compra online inmediata.",
        "Condiciones comerciales definidas segun cantidad, acabados, destino y plazos.",
        "Atencion orientada a profesionales, proyectos y distribuidores."
    ],
    formLabel: "Consulta rapida",
    formTitle: "Cuentanos tu proyecto y abrimos conversacion por email.",
    formLabels: ["Nombre", "Empresa o estudio", "Correo", "Volumen estimado", "Necesidad"],
    formPlaceholders: ["Tu nombre", "Nombre de empresa", "tu@empresa.com", "Ej. 80 sillas y 20 mesas", "Describe el tipo de espacio, estilo, plazos o piezas que necesitas."],
    formButton: "Abrir Gmail comercial",
    formDisclaimer: "Al enviar, abriremos Gmail con el mensaje preparado para un primer contacto.",
    footerText: "Mobiliario, silleria y decoracion premium al por mayor para proyectos profesionales.",
    mailSubjectPrefix: "Solicitud comercial",
    mailIntro: "Me gustaria solicitar informacion comercial sobre mobiliario al por mayor.",
    mailProjectLabel: "Detalle del proyecto:",
    whatsappHeaderMessage: "Hola Adrian Contact, quiero informacion sobre mobiliario al por mayor.",
    whatsappContactMessage: "Hola Adrian Contact, quiero solicitar informacion sobre un pedido grande."
});

Object.assign(translations.en, {
    lang: "en",
    pageTitle: "Adrian Contact | Premium furniture wholesale",
    metaDescription: "Adrian Contact showcases premium wholesale furniture for hotels, restaurants, offices, interior designers, and distributors.",
    brandName: "Adrian Contact",
    brandTagline: "Premium furniture for contract projects and distribution",
    nav: ["Home", "Collections", "About", "Brands", "Contact"],
    headerWhatsapp: "Business WhatsApp",
    heroEyebrow: "Wholesale furniture for hotels, restaurants, offices, and interior designers",
    heroTitle: "Exclusive furniture for spaces designed to stand out.",
    heroText: "We curate chairs, tables, occasional pieces, and decorative collections with an editorial eye. The website works as a visual catalogue: prices are indicative and every order is reviewed according to quantity, finishes, lead time, and destination.",
    heroButtons: ["Request a commercial proposal", "View featured collections"],
    metrics: ["References oriented to contract and distribution", "Commercial response for projects and large orders", "Logistics network for hospitality, offices, and retail"],
    heroCaption: "Selections built for projects with a strong identity.",
    heroNotes: [["Editorial curation", "Premium selection of chairs, tables, and occasional pieces"], ["Orders by inquiry", "No cart or checkout: direct commercial management"]],
    clientele: ["Boutique hotels", "Premium dining", "Executive offices", "Design retail", "Interior design and architecture"],
    ribbonText: "Shown prices are indicative and serve as a visual collection reference. Final pricing depends on volume, finishes, transport, and the commercial conditions of each project.",
    ribbonLink: "Request pricing and availability",
    catalogueEyebrow: "Editorial catalogue",
    catalogueTitle: "Collections tailored for volume purchasing and high-presence interiors.",
    catalogueText: "This is not a traditional online store. We present a commercial selection of pieces with architectural intent, ready for hospitality, offices, and interior projects that need visual consistency and supply capacity.",
    featureCards: [
        ["Featured selection", "Aurelia Lounge Collection", "Curved armchairs, modular sofas, and low tables in toasted walnut, sand boucle, and satin metal. A line designed for receptions, lounges, and common areas where first impressions matter.", "From EUR 1,490 / base set", "Indicative price. Professional order by inquiry.", "Request finishes and project pricing"],
        ["Designer chairs", "Vetta Chair", "Upholstered seat, smoked wood frame, and a light silhouette for premium dining and hotel spaces.", "From EUR 168 / unit", "Minimum order aimed at volume and trade.", "Check quantities and lead times"],
        ["Commercial approach", "We show product, context, and price range. The closing happens with you.", "We work with hoteliers, restaurant groups, offices, distributors, and interior designers who need direct communication, samples, finishes, and project-specific conditions."],
        ["Sculptural tables", "Volta Executive Table", "Ceramic or wood top, matte metal bases, and formats tailored to private rooms, restaurants, executive meetings, and reception spaces.", "From EUR 890 / unit", "Available in multiple dimensions and finishes.", "Request dimensions and wholesale pricing"],
        ["Occasional pieces", "Nacre Console", "Clean volume, mineral surfaces, and subtle metal detailing for lobbies, curated retail, and circulation zones.", "From EUR 620 / unit", "Ideal to combine with full atmosphere packages.", "Request an integrated proposal"],
        ["Office and contract", "Axis Work Line", "Collaborative tables, executive seating, and modular storage for offices with a sober look and noble materiality.", "From EUR 245 / workstation", "Special conditions for large office rollouts.", "Discuss an implementation"]
    ],
    featureList: ["No individual product pages or online checkout.", "Final pricing depends on volume, upholstery, and logistics.", "Commercial support for large and recurring orders."],
    assortmentHeads: [["Chair programme", "Curated chair catalogue for hospitality, hotels, and offices.", "A broader selection so the website feels like a true commercial catalogue instead of a short sample."], ["Decoration and accents", "Support pieces to complete atmospheres and integral projects.", "Accessories with the same premium language for receptions, suites, selective retail, and common areas."]],
    assortmentItems: [
        ["Upholstered chair", "Vetta", "Light profile, curved back, and neutral upholstery for elegant dining rooms."],
        ["Premium dining", "Elara", "Natural wood, generous backrest, and serene presence for hotel projects."],
        ["Contract dining", "Marlo", "Robust structure, comfortable seat, and finishes for intensive use."],
        ["Lounge seat", "Lyra", "Low armchair for lobbies and waiting areas with a premium feel."],
        ["Executive office", "Axis Executive", "Office seating with a sober presence for full installations."],
        ["Console", "Nacre", "Mineral surfaces and clean volume for refined lobbies and hallways."],
        ["Side table", "Tivoli", "Round support table for premium rooms and receptions."],
        ["Lighting", "Sora", "Sculptural lamp for warm atmospheres in high-end hospitality."],
        ["Mirror", "Cael", "Slim metal frame and elegant reading for transition zones and suites."],
        ["Sideboard", "Neri", "Support piece with hidden storage for model residences and hotel projects."]
    ],
    aboutEyebrow: "About the brand",
    aboutTitle: "A firm created to shape projects with aesthetic ambition and commercial scale.",
    aboutText: [
        "Adrian Contact was born as a curated furniture sourcing house for businesses that want to elevate their presence. We bring together manufacturers, finishes, and collections with one goal: to deliver pieces that project quality, perform in demanding use, and stay coherent across large orders.",
        "Our work sits between interior design and commercial execution. We support hotel groups, restaurants, offices, concept stores, and distributors who need visual criteria, agility, and a clear point of contact throughout the process."
    ],
    aboutSignature: ["Philosophy", "Calm design, honest materials, and commercial service with a brand mindset."],
    aboutStats: ["years curating contract collections", "projects delivered", "brands aligned with our aesthetic", "tailored commercial and creative team"],
    expertiseTitles: ["Carefully curated", "What sets us apart", "Typical clients"],
    expertiseTextOne: "We work with a limited, well-chosen set of lines. Each piece must answer both a premium visual narrative and a real professional use case.",
    expertiseList: ["Capacity for volume orders and replenishment.", "Advice on composition, materials, and combinations.", "Trade pricing adapted to professional channels.", "Fast response for quotes and samples."],
    expertiseTextThree: "Boutique hotels, premium restaurants, corporate offices, distributors, selective retail, and interior designers.",
    brandsEyebrow: "Associated brands",
    brandsTitle: "Brands with their own language inside a shared premium sensibility.",
    brandsText: "The selection combines Mediterranean collections, contemporary lines, hospitality solutions, elegant office furniture, and pieces with a refined artisanal reading.",
    brandTexts: [
        "Designer seating for restaurants, private clubs, and cosmopolitan receptions.",
        "Dark woods, restrained structures, and sculptural tables for hospitality and executive settings.",
        "Serene Mediterranean inspiration, technical fibres, and soft upholstery for sophisticated terraces and coastal hotels.",
        "Minimal lines and precise proportions for premium offices and interior architecture.",
        "Tables, stools, and occasional pieces with Mediterranean character and durable finishes for dining spaces.",
        "Modular solutions for rollouts, common areas, and large corporate projects.",
        "Warm tactile pieces for suites, receptions, and spaces where material detail leads.",
        "Decoration, consoles, and calm accessories that complete full projects with continuity."
    ],
    contactEyebrow: "Commercial contact",
    contactTitle: "Request information, availability, or a quote for large orders.",
    contactText: "We work exclusively with a wholesale and commercial approach. If you are furnishing a hotel, restaurant, office, show unit, retail space, or distribution channel, write to us. We will send references, finishes, lead times, and pricing aligned with your volume.",
    contactButtons: ["Direct WhatsApp"],
    contactPoints: ["Published prices are reference values, not instant online purchases.", "Commercial conditions are defined by quantity, finishes, destination, and lead time.", "Service focused on professionals, projects, and distributors."],
    formLabel: "Quick inquiry",
    formTitle: "Tell us about your project and we will open the conversation by email.",
    formLabels: ["Name", "Company or studio", "Email", "Estimated volume", "Need"],
    formPlaceholders: ["Your name", "Company name", "you@company.com", "Example: 80 chairs and 20 tables", "Describe the type of space, style, lead times, or pieces you need."],
    formButton: "Open business email in Gmail",
    formDisclaimer: "On submit, we will open Gmail with the message prepared for a first contact.",
    footerText: "Premium wholesale furniture, seating, and decoration for professional projects.",
    mailSubjectPrefix: "Commercial request",
    mailIntro: "I would like to request commercial information about wholesale furniture.",
    mailProjectLabel: "Project details:",
    whatsappHeaderMessage: "Hello Adrian Contact, I would like information about wholesale furniture.",
    whatsappContactMessage: "Hello Adrian Contact, I would like information about a large order."
});

Object.assign(translations.pt, {
    lang: "pt",
    pageTitle: "Adrian Contact | Mobilario premium por grosso",
    metaDescription: "Adrian Contact apresenta mobilario premium por grosso para hoteis, restaurantes, escritorios, designers de interiores e distribuidores.",
    brandName: "Adrian Contact",
    brandTagline: "Mobilario premium para projetos contract e distribuicao",
    nav: ["Inicio", "Colecoes", "Sobre nos", "Marcas", "Contacto"],
    headerWhatsapp: "WhatsApp comercial",
    heroEyebrow: "Venda por grosso para hoteis, restaurantes, escritorios e interioristas",
    heroTitle: "Mobilario exclusivo para espacos que querem destacar-se.",
    heroText: "Selecionamos cadeiras, mesas, pecas auxiliares e colecoes decorativas com um olhar editorial. O site funciona como catalogo visual: os precos sao orientativos e cada encomenda e estudada segundo quantidade, acabamentos, prazos e destino.",
    heroButtons: ["Pedir proposta comercial", "Ver colecoes em destaque"],
    metrics: ["Referencias orientadas para contract e distribuicao", "Resposta comercial para projetos e grandes encomendas", "Rede logistica para hotelaria, escritorios e retail"],
    heroCaption: "Selecoes pensadas para projetos com identidade propria.",
    heroNotes: [["Curadoria editorial", "Selecao premium de cadeiras, mesas e pecas auxiliares"], ["Pedido sob consulta", "Sem carrinho nem checkout: gestao comercial direta"]],
    clientele: ["Hoteis boutique", "Restauracao premium", "Escritorios executivos", "Retail de design", "Interiorismo e arquitetura"],
    ribbonText: "Os valores apresentados sao orientativos e servem como referencia visual da colecao. O preco final depende do volume, acabamentos, transporte e condicoes comerciais de cada projeto.",
    ribbonLink: "Pedir tabela e disponibilidade",
    catalogueEyebrow: "Catalogo editorial",
    catalogueTitle: "Colecoes pensadas para compras em volume e espacos com presenca.",
    catalogueText: "Nao apresentamos uma loja online tradicional. Mostramos uma selecao comercial de pecas com vocacao arquitetonica, prontas para hotelaria, escritorios e projetos de interiores que exigem consistencia visual e capacidade de fornecimento.",
    featureCards: [
        ["Selecao em destaque", "Colecao Aurelia Lounge", "Poltronas envolventes, sofas modulares e mesas baixas em nogueira tostada, boucle areia e metal acetinado. Uma linha pensada para rececoes, lounges e zonas comuns onde a primeira impressao conta.", "Desde 1.490 EUR / conjunto base", "Preco orientativo. Pedido profissional sob consulta.", "Pedir acabamentos e tabela de projeto"],
        ["Cadeiras de autor", "Cadeira Vetta", "Assento estofado, estrutura em madeira fumada e silhueta leve para restauracao premium e salas de hotel.", "Desde 168 EUR / unidade", "Pedido minimo orientado a volume e canal profissional.", "Consultar quantidades e prazos"],
        ["Abordagem comercial", "Mostramos produto, contexto e faixa de preco. O fecho faz-se consigo.", "Trabalhamos com hoteleiros, grupos de restauracao, escritorios, distribuidores e interioristas que precisam de relacao direta, amostras, acabamentos e condicoes adaptadas a cada operacao."],
        ["Mesas escultoricas", "Mesa Volta Executive", "Tampo ceramico ou em madeira natural, bases centrais em metal mate e formatos adaptados a salas privadas, restaurantes, reunioes executivas e rececoes.", "Desde 890 EUR / unidade", "Inclui varias medidas e acabamentos segundo o projeto.", "Pedir medidas e preco grossista"],
        ["Pecas auxiliares", "Consola Nacre", "Volume limpo, superficies minerais e detalhe metalico discreto para lobby, retail seletivo e zonas de passagem.", "Desde 620 EUR / unidade", "Ideal para combinar com pedidos de ambientacao completos.", "Pedir proposta integral"],
        ["Office e contract", "Linha Axis Work", "Mesas colaborativas, cadeiras executivas e arrumacao modular para escritorios com imagem sobria e materialidade nobre.", "Desde 245 EUR / posto", "Condicoes especiais para implantacoes em serie.", "Falar sobre implantacao"]
    ],
    featureList: ["Sem fichas individuais nem compra online.", "Preco final segundo volume, estofos e logistica.", "Apoio comercial para pedidos grandes e recorrentes."],
    assortmentHeads: [["Programa de cadeiras", "Catalogo curado de cadeiras para restauracao, hotel e escritorio.", "Uma selecao mais ampla para que o site pareca um catalogo comercial real e nao uma amostra curta."], ["Decoracao e auxiliares", "Pecas de apoio para completar ambientes e projetos integrais.", "Complementos com a mesma leitura premium para rececoes, suites, retail seletivo e zonas comuns."]],
    assortmentItems: [
        ["Cadeira estofada", "Vetta", "Perfil leve, encosto curvo e estofado neutro para salas elegantes."],
        ["Dining premium", "Elara", "Madeira natural, encosto amplo e presenca serena para projetos hoteleiros."],
        ["Comedor contract", "Marlo", "Estrutura robusta, assento confortavel e acabamentos para uso intensivo."],
        ["Lounge seat", "Lyra", "Poltrona baixa para lobbies e zonas de espera com ar premium."],
        ["Office executive", "Axis Executive", "Cadeiras de escritorio com presenca sobria para implantacoes completas."],
        ["Consola", "Nacre", "Superficies minerais e volume limpo para lobbies e corredores nobres."],
        ["Mesa auxiliar", "Tivoli", "Mesa redonda de apoio para quartos premium e rececoes."],
        ["Iluminacao", "Sora", "Candeeiro escultorico para atmosferas quentes em hospitality de nivel."],
        ["Espelho", "Cael", "Moldura metalica fina e leitura elegante para zonas de passagem e suites."],
        ["Aparador", "Neri", "Peca de apoio com arrumacao oculta para projetos piloto residenciais e hoteleiros."]
    ],
    aboutEyebrow: "Sobre a marca",
    aboutTitle: "Uma firma criada para dar forma a projetos com ambicao estetica e escala comercial.",
    aboutText: [
        "Adrian Contact nasce como uma casa de selecao e fornecimento de mobilario para negocios que querem elevar a sua presenca. Reunimos fabricantes, acabamentos e colecoes com uma unica ideia: oferecer pecas que transmitam nivel, funcionem bem em uso intensivo e mantenham coerencia em encomendas grandes.",
        "O nosso trabalho move-se entre o interiorismo e a operacao comercial. Acompanhamos grupos hoteleiros, restaurantes, escritorios, concept stores e distribuidores que precisam de criterio visual, agilidade e um interlocutor claro durante todo o processo."
    ],
    aboutSignature: ["Filosofia", "Design sereno, materiais honestos e servico comercial com visao de marca."],
    aboutStats: ["anos a curar colecoes contract", "projetos atendidos", "marcas alinhadas com a nossa estetica", "equipa comercial e criativa a medida"],
    expertiseTitles: ["Selecao cuidada", "O que nos distingue", "Clientes habituais"],
    expertiseTextOne: "Trabalhamos poucas linhas, bem escolhidas. Cada peca deve responder a uma narrativa visual premium e a um uso profissional real.",
    expertiseList: ["Capacidade para encomendas em volume e reposicoes.", "Aconselhamento em composicao, materiais e combinacoes.", "Tabelas comerciais adaptadas ao canal profissional.", "Resposta rapida para orcamentos e amostras."],
    expertiseTextThree: "Hoteis boutique, restauracao premium, escritorios corporativos, distribuidores, retail seletivo e interioristas.",
    brandsEyebrow: "Marcas associadas",
    brandsTitle: "Marcas com linguagem propria dentro da mesma sensibilidade premium.",
    brandsText: "A selecao combina colecoes mediterraneas, linhas contemporaneas, solucoes para hospitality, escritorio elegante e pecas com leitura artesanal refinada.",
    brandTexts: [
        "Cadeiras de autor para restaurantes, clubes privados e rececoes cosmopolitas.",
        "Madeiras escuras, estruturas sobrias e mesas escultoricas para hospitality e espacos executivos.",
        "Inspiracao mediterranea serena, fibras tecnicas e estofos suaves para terracos sofisticados e hoteis costeiros.",
        "Linhas minimalistas e proporcoes precisas para escritorios premium e arquitetura de interiores.",
        "Mesas, bancos e pecas auxiliares com carater mediterraneo e acabamentos duradouros para restauracao.",
        "Solucoes modulares para implantacoes em serie, zonas comuns e grandes projetos corporativos.",
        "Pecas quentes e tateis para suites, rececoes e espacos onde o detalhe material lidera.",
        "Decoracao, consolas e complementos tranquilos para dar continuidade visual a projetos completos."
    ],
    contactEyebrow: "Contacto comercial",
    contactTitle: "Solicite informacao, disponibilidade ou orcamento para pedidos grandes.",
    contactText: "Trabalhamos exclusivamente com uma abordagem comercial e grossista. Se esta a equipar um hotel, restaurante, escritorio, casa piloto, retail ou canal de distribuicao, escreva-nos. Enviaremos referencias, acabamentos, prazos e tabela orientada ao seu volume.",
    contactButtons: ["WhatsApp direto"],
    contactPoints: ["Precos publicados como referencia, nao como compra online imediata.", "Condicoes comerciais definidas segundo quantidade, acabamentos, destino e prazo.", "Atendimento orientado a profissionais, projetos e distribuidores."],
    formLabel: "Consulta rapida",
    formTitle: "Conte-nos o seu projeto e abrimos a conversa por email.",
    formLabels: ["Nome", "Empresa ou estudio", "Email", "Volume estimado", "Necessidade"],
    formPlaceholders: ["O seu nome", "Nome da empresa", "voce@empresa.com", "Ex. 80 cadeiras e 20 mesas", "Descreva o tipo de espaco, estilo, prazos ou pecas que necessita."],
    formButton: "Abrir email comercial no Gmail",
    formDisclaimer: "Ao enviar, abriremos o Gmail com a mensagem preparada para um primeiro contacto.",
    footerText: "Mobilario, cadeiras e decoracao premium por grosso para projetos profissionais.",
    mailSubjectPrefix: "Pedido comercial",
    mailIntro: "Gostaria de solicitar informacao comercial sobre mobilario por grosso.",
    mailProjectLabel: "Detalhes do projeto:",
    whatsappHeaderMessage: "Ola Adrian Contact, gostaria de informacao sobre mobilario por grosso.",
    whatsappContactMessage: "Ola Adrian Contact, gostaria de informacao sobre um pedido grande."
});

let currentLang = localStorage.getItem("blogtio-language") || "es";
if (!translations[currentLang]) {
    currentLang = "es";
}

const closeMenu = () => {
    body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
};

const setNodeText = (node, value) => {
    if (node) {
        node.textContent = value;
    }
};

const setText = (selector, value) => {
    const node = document.querySelector(selector);
    setNodeText(node, value);
};

const applyLanguage = (lang) => {
    const t = translations[lang];
    currentLang = lang;
    html.lang = t.lang;
    document.title = t.pageTitle;

    if (metaDescription) {
        metaDescription.setAttribute("content", t.metaDescription);
    }

    setText(".brand-copy strong", t.brandName);
    setText(".brand-copy small", t.brandTagline);
    navLinks.forEach((link, index) => setNodeText(link, t.nav[index]));
    footerLinks.forEach((link, index) => {
        const footerMap = [0, 2, 3, 4];
        setNodeText(link, t.nav[footerMap[index]]);
    });

    setNodeText(whatsappLinks.header, t.headerWhatsapp);
    setText(".hero-copy .eyebrow", t.heroEyebrow);
    setText(".hero-copy h1", t.heroTitle);
    setText(".hero-text", t.heroText);
    document.querySelectorAll(".hero-actions a").forEach((link, index) => setNodeText(link, t.heroButtons[index]));
    document.querySelectorAll(".hero-metrics dd").forEach((item, index) => setNodeText(item, t.metrics[index]));
    setText(".hero-shot-primary figcaption", t.heroCaption);

    document.querySelectorAll(".hero-note").forEach((note, index) => {
        setNodeText(note.querySelector("span"), t.heroNotes[index][0]);
        setNodeText(note.querySelector("strong"), t.heroNotes[index][1]);
    });

    document.querySelectorAll(".clientele-strip span").forEach((item, index) => setNodeText(item, t.clientele[index]));
    setText(".commercial-ribbon p", t.ribbonText);
    setText(".commercial-ribbon a", t.ribbonLink);

    const catalogueHead = document.querySelector(".catalogue .section-head");
    if (catalogueHead) {
        setNodeText(catalogueHead.querySelector(".eyebrow"), t.catalogueEyebrow);
        setNodeText(catalogueHead.querySelector("h2"), t.catalogueTitle);
        setNodeText(catalogueHead.querySelector("p:last-child"), t.catalogueText);
    }

    document.querySelectorAll(".catalogue-layout .piece").forEach((piece, index) => {
        const card = t.featureCards[index];
        if (!card) {
            return;
        }

        setNodeText(piece.querySelector(".piece-kicker"), card[0]);
        setNodeText(piece.querySelector("h3"), card[1]);
        setNodeText(piece.querySelector(".piece-body p"), card[2]);
        setNodeText(piece.querySelector(".piece-meta strong"), card[3] || "");
        setNodeText(piece.querySelector(".piece-meta span"), card[4] || "");
        setNodeText(piece.querySelector(".piece-link"), card[5] || "");
    });

    document.querySelectorAll(".piece-note .piece-list li").forEach((item, index) => setNodeText(item, t.featureList[index]));

    document.querySelectorAll(".assortment-panel").forEach((panel, index) => {
        const head = panel.querySelector(".assortment-head");
        setNodeText(head?.querySelector(".eyebrow"), t.assortmentHeads[index][0]);
        setNodeText(head?.querySelector("h3"), t.assortmentHeads[index][1]);
        setNodeText(head?.querySelector("p:last-child"), t.assortmentHeads[index][2]);
    });

    document.querySelectorAll(".assortment-item").forEach((item, index) => {
        const values = t.assortmentItems[index];
        setNodeText(item.querySelector(".assortment-copy span"), values[0]);
        setNodeText(item.querySelector(".assortment-copy h4"), values[1]);
        setNodeText(item.querySelector(".assortment-copy p"), values[2]);
    });

    setText(".about-copy .eyebrow", t.aboutEyebrow);
    setText(".about-copy h2", t.aboutTitle);
    document.querySelectorAll(".about-copy > p:not(.eyebrow)").forEach((item, index) => setNodeText(item, t.aboutText[index]));
    setText(".about-signature span", t.aboutSignature[0]);
    setText(".about-signature strong", t.aboutSignature[1]);
    document.querySelectorAll(".about-stats span").forEach((item, index) => setNodeText(item, t.aboutStats[index]));

    const expertisePanels = document.querySelectorAll(".expertise-panel");
    setNodeText(expertisePanels[0]?.querySelector("h3"), t.expertiseTitles[0]);
    setNodeText(expertisePanels[0]?.querySelector("p"), t.expertiseTextOne);
    setNodeText(expertisePanels[1]?.querySelector("h3"), t.expertiseTitles[1]);
    expertisePanels[1]?.querySelectorAll("li").forEach((item, index) => setNodeText(item, t.expertiseList[index]));
    setNodeText(expertisePanels[2]?.querySelector("h3"), t.expertiseTitles[2]);
    setNodeText(expertisePanels[2]?.querySelector("p"), t.expertiseTextThree);

    const brandsHead = document.querySelector(".brands .section-head");
    if (brandsHead) {
        setNodeText(brandsHead.querySelector(".eyebrow"), t.brandsEyebrow);
        setNodeText(brandsHead.querySelector("h2"), t.brandsTitle);
        setNodeText(brandsHead.querySelector("p:last-child"), t.brandsText);
    }

    document.querySelectorAll(".brand-grid .brand-tile p").forEach((item, index) => setNodeText(item, t.brandTexts[index]));

    setText(".contact-copy .eyebrow", t.contactEyebrow);
    setText(".contact-copy h2", t.contactTitle);
    setText(".contact-copy > p:not(.eyebrow)", t.contactText);
    setNodeText(whatsappLinks.contact, t.contactButtons[0]);
    document.querySelectorAll(".contact-points li").forEach((item, index) => setNodeText(item, t.contactPoints[index]));
    setText(".contact-card-label", t.formLabel);
    setText(".contact-card h3", t.formTitle);

    Array.from(document.querySelectorAll(".contact-form label span")).forEach((item, index) => {
        setNodeText(item, t.formLabels[index]);
    });

    const formFields = [
        contactForm?.querySelector('input[name="name"]'),
        contactForm?.querySelector('input[name="company"]'),
        contactForm?.querySelector('input[name="email"]'),
        contactForm?.querySelector('input[name="volume"]'),
        contactForm?.querySelector('textarea[name="message"]')
    ];

    formFields.forEach((field, index) => {
        if (field) {
            field.setAttribute("placeholder", t.formPlaceholders[index]);
        }
    });

    setText(".contact-form button", t.formButton);
    setText(".contact-disclaimer", t.formDisclaimer);
    setText(".site-footer strong", t.brandName);
    setText(".site-footer p", t.footerText);

    if (whatsappLinks.header) {
        whatsappLinks.header.href = `https://wa.me/34640298957?text=${encodeURIComponent(t.whatsappHeaderMessage)}`;
    }

    if (whatsappLinks.contact) {
        whatsappLinks.contact.href = `https://wa.me/34640298957?text=${encodeURIComponent(t.whatsappContactMessage)}`;
    }

    languageButtons.forEach((button) => {
        const isActive = button.dataset.lang === lang;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    localStorage.setItem("blogtio-language", lang);
};

if (navToggle) {
    navToggle.addEventListener("click", () => {
        const isOpen = body.classList.toggle("nav-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

languageButtons.forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.lang));
});

window.addEventListener(
    "scroll",
    () => {
        header?.classList.toggle("is-scrolled", window.scrollY > 18);
    },
    { passive: true }
);

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.18,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealNodes.forEach((node) => revealObserver.observe(node));

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                navLinks.forEach((link) => {
                    const isMatch = link.getAttribute("href") === `#${entry.target.id}`;
                    link.classList.toggle("is-active", isMatch);
                });
            });
        },
        {
            threshold: 0.45,
            rootMargin: "-15% 0px -35% 0px"
        }
    );

    sections.forEach((section) => sectionObserver.observe(section));
} else {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
}

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const t = translations[currentLang];
        const formData = new FormData(contactForm);
        const name = String(formData.get("name") || "").trim();
        const company = String(formData.get("company") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const volume = String(formData.get("volume") || "").trim();
        const message = String(formData.get("message") || "").trim();

        const subjectBase = company || name || t.brandName;
        const lines = [
            `${t.brandName},`,
            "",
            t.mailIntro,
            "",
            `${t.formLabels[0]}: ${name || "-"}`,
            `${t.formLabels[1]}: ${company || "-"}`,
            `${t.formLabels[2]}: ${email || "-"}`,
            `${t.formLabels[3]}: ${volume || "-"}`,
            "",
            t.mailProjectLabel,
            message || "-"
        ];

        const subject = encodeURIComponent(`${t.mailSubjectPrefix} | ${subjectBase}`);
        const bodyText = encodeURIComponent(lines.join("\n"));

        const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}&su=${subject}&body=${bodyText}`;
        window.location.href = gmailComposeUrl;
    });
}

applyLanguage(currentLang);
