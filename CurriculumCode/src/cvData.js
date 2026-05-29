export const contact = [
  { label: 'Teléfono', value: '640 29 89 57', href: 'tel:+34640298957' },
  {
    label: 'Email',
    value: 'adriantebar19@gmail.com',
    href: 'mailto:adriantebar19@gmail.com',
  },
  { label: 'Ubicación', value: 'Alaquàs' },
  {
    label: 'LinkedIn',
    value: 'www.linkedin.com/in/adrián-tebar-gálvez-970b62203',
    href: 'https://www.linkedin.com/in/adri%C3%A1n-tebar-g%C3%A1lvez-970b62203/',
  },
];

export const skills = [
  'Proactividad',
  'Pensamiento analítico',
  'Resolución de problemas técnicos',
  'Trabajo en equipo',
  'Comunicación',
];

export const languages = [
  'Español - Nativo',
  'Valenciano - Nivel avanzado',
  'Inglés - Competencia profesional',
];

export const extra = [
  'Vehículo propio',
  'Participación activa en proyectos personales (GitHub y GitLab)',
  'Interés en nuevas tecnologías e inteligencia artificial',
];

export const profile = [
  'Hola, soy Adrián Tebar Gálvez y soy desarrollador de software Full Stack, con formación en DAW y DAM. Tengo experiencia en el desarrollo de aplicaciones web, participando tanto en frontend como en backend. He trabajado en distintos proyectos, colaborando en el desarrollo y mejora de aplicaciones en entornos empresariales. Me gusta seguir aprendiendo, mejorar mis habilidades y enfrentarme a nuevos retos dentro del desarrollo de software. Fuera del ámbito profesional, disfruto del deporte como forma de mantenerme activo.',
];

export const experience = [
  {
    period: 'Mar. 2025 - 1 año y 4 meses · Ahora',
    role: 'Desarrollador de Software Full Stack',
    company: '',
    details: [
      'Desarrollo y mantenimiento de aplicaciones orientadas a entornos empresariales.',
      'Participación en el desarrollo backend y frontend, trabajando en todo el ciclo de desarrollo.',
      'Implementación de nuevas funcionalidades, optimización de procesos y gestión de datos.',
      'Trabajo continuo con bases de datos y desarrollo de soluciones escalables.',
    ],
  },
  {
    period: '2024 · 3 meses',
    role: 'Desarrollador Full Stack',
    company: 'Nunsys',
    details: [
      'Participación en el desarrollo de aplicaciones web dentro de un entorno de trabajo profesional.',
      'Desarrollo de funcionalidades tanto en frontend como en backend.',
      'Formación intensiva en tecnologías actuales mediante bootcamp enfocado al entorno empresarial.',
      'Aplicación de buenas prácticas de programación, patrones de diseño y metodologías de trabajo.',
    ],
  },
  {
    period: '2022 · 3 meses',
    role: 'Técnico Informático / Desarrollador Web',
    company: 'TiaTools',
    details: [
      'Desarrollo y mejora de aplicaciones web, participando en la parte frontend.',
      'Adaptación de interfaces para mejorar la experiencia de usuario y el diseño responsive.',
      'Reparación, mantenimiento y montaje de equipos informáticos para empresa y clientes.',
    ],
  },
  {
    period: '2021 · 3 meses',
    role: 'Técnico Informático',
    company: 'MediaMarkt (Quart de Poblet)',
    details: [
      'Diagnóstico, reparación y configuración de equipos informáticos.',
      'Montaje de hardware y resolución de incidencias técnicas.',
      'Asesoramiento técnico a clientes sobre productos y soluciones informáticas.',
    ],
  },
  {
    period: '2022 · 5 meses',
    role: 'Monitor Deportivo',
    company: 'Campus Multideporte (Aldaia)',
    details: [
      'Organización y supervisión de actividades deportivas para grupos.',
      'Trabajo en equipo y gestión de grupos en entornos dinámicos.',
      'Desarrollo de habilidades comunicativas y liderazgo.',
    ],
  },
];

export const education = [
  {
    year: '2025',
    title: 'Grado Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)',
  },
  {
    year: '2025',
    title: 'Inteligencia empresarial: IA, Big Data y otras herramientas digitales',
  },
  {
    year: '2024',
    title: 'Grado Superior en Desarrollo de Aplicaciones Web (DAW)',
  },
  {
    year: '2022',
    title: 'Grado Medio Sistemas Microinformáticos y Redes',
  },
  {
    year: '2022',
    title: 'Título de Monitor de tiempo libre',
  },
];

export const coverLetter = [
  'Soy desarrollador de Software Full Stack, con formación en Desarrollo de Aplicaciones Web (DAW) y Desarrollo de Aplicaciones Multiplataforma (DAM).',
  'Actualmente cuento con experiencia en el desarrollo de aplicaciones, participando tanto en frontend como en backend y colaborando en la construcción de soluciones orientadas a negocio.',
  'A lo largo de mi trayectoria, he trabajado en el desarrollo y mejora de aplicaciones, lo que me ha permitido adquirir una base sólida en programación, así como una visión global del ciclo de desarrollo de software. Me motiva especialmente la resolución de problemas y la creación de soluciones eficientes, bien estructuradas y orientadas a aportar valor.',
  'Además, mantengo un interés activo en el ámbito de la inteligencia artificial y en cómo puede integrarse en el desarrollo de software para mejorar procesos, optimizar soluciones y generar nuevas oportunidades tecnológicas.',
  'Me considero una persona proactiva, con capacidad analítica y orientada a la mejora continua, con facilidad para adaptarme a nuevos entornos y aportar valor dentro de un equipo de trabajo.',
  'Me gustaría aportar mis conocimientos y seguir creciendo profesionalmente dentro de su equipo, contribuyendo activamente al desarrollo de sus proyectos.',
];

const devicon = (path) => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${path}`;
const simpleIcon = (name, color) => `https://cdn.simpleicons.org/${name}/${color}`;

export const toolkit = [
  {
    title: 'Frontend',
    items: [
      { name: 'HTML5', icon: 'H5', color: '#e34f26', image: devicon('html5/html5-original.svg') },
      { name: 'CSS3', icon: 'C3', color: '#1572b6', image: devicon('css3/css3-original.svg') },
      {
        name: 'JavaScript',
        icon: 'JS',
        color: '#f7df1e',
        image: devicon('javascript/javascript-original.svg'),
      },
      {
        name: 'TypeScript',
        icon: 'TS',
        color: '#3178c6',
        image: devicon('typescript/typescript-original.svg'),
      },
      { name: 'React', icon: 'R', color: '#61dafb', image: devicon('react/react-original.svg') },
      { name: 'Angular', icon: 'A', color: '#dd0031', image: devicon('angular/angular-original.svg') },
      { name: 'C#', icon: 'C#', color: '#68217a', image: devicon('csharp/csharp-original.svg') },
      { name: 'Python', icon: 'PY', color: '#3776ab', image: devicon('python/python-original.svg') },
    ],
  },
  {
    title: 'Backend',
    items: [
      { name: 'Node.js', icon: 'N', color: '#339933', image: devicon('nodejs/nodejs-original.svg') },
      { name: 'Express.js', icon: 'EX', color: '#222222', image: devicon('express/express-original.svg') },
      { name: 'Spring Boot', icon: 'SB', color: '#6db33f', image: devicon('spring/spring-original.svg') },
      { name: 'REST API', icon: 'API', color: '#323b4c' },
    ],
  },
  {
    title: 'Bases de datos',
    items: [
      { name: 'Firebase', icon: 'F', color: '#ffca28', image: devicon('firebase/firebase-original.svg') },
      { name: 'Firestore', icon: 'FS', color: '#ff8f00', image: devicon('firebase/firebase-original.svg') },
      { name: 'MongoDB', icon: 'M', color: '#47a248', image: devicon('mongodb/mongodb-original.svg') },
      {
        name: 'SQL Server',
        icon: 'SQL',
        color: '#cc2927',
        image: devicon('microsoftsqlserver/microsoftsqlserver-original.svg'),
      },
      {
        name: 'PostgreSQL',
        icon: 'PG',
        color: '#336791',
        image: devicon('postgresql/postgresql-original.svg'),
      },
    ],
  },
  {
    title: 'Mobile',
    items: [
      { name: 'Flutter', icon: 'FL', color: '#02569b', image: devicon('flutter/flutter-original.svg') },
      { name: 'Dart', icon: 'D', color: '#0175c2', image: devicon('dart/dart-original.svg') },
      { name: 'Kotlin', icon: 'K', color: '#7f52ff', image: devicon('kotlin/kotlin-original.svg') },
      {
        name: 'Android Studio',
        icon: 'AS',
        color: '#3ddc84',
        image: devicon('androidstudio/androidstudio-original.svg'),
      },
    ],
  },
  {
    title: 'Herramientas',
    items: [
      { name: 'Git', icon: 'G', color: '#f05032', image: devicon('git/git-original.svg') },
      { name: 'GitHub', icon: 'GH', color: '#181717', image: devicon('github/github-original.svg') },
      { name: 'GitLab', icon: 'GL', color: '#fc6d26', image: devicon('gitlab/gitlab-original.svg') },
      { name: 'Vite', icon: 'V', color: '#646cff', image: devicon('vitejs/vitejs-original.svg') },
      { name: 'npm', icon: 'npm', color: '#cb3837', image: devicon('npm/npm-original-wordmark.svg') },
      {
        name: 'Visual Studio Code',
        icon: 'VS',
        color: '#007acc',
        image: devicon('vscode/vscode-original.svg'),
      },
      {
        name: 'IntelliJ IDEA',
        icon: 'IJ',
        color: '#000000',
        image: devicon('intellij/intellij-original.svg'),
      },
      {
        name: 'Visual Studio 2026',
        icon: 'VS',
        color: '#5c2d91',
        image: devicon('visualstudio/visualstudio-original.svg'),
      },
    ],
  },
  {
    title: 'IA y automatización',
    items: [
      {
        name: 'ChatGPT Codex',
        icon: 'CX',
        color: '#10a37f',
        image: 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=64',
      },
      {
        name: 'GitHub Copilot',
        icon: 'CP',
        color: '#181717',
        image: simpleIcon('githubcopilot', '181717'),
      },
      { name: 'Claude Code', icon: 'CC', color: '#d97706', image: simpleIcon('claude', 'D97706') },
      {
        name: 'NotebookLM',
        icon: 'NB',
        color: '#4285f4',
        image: 'https://www.google.com/s2/favicons?domain=notebooklm.google.com&sz=64',
      },
      { name: 'n8n', icon: 'n8n', color: '#ea4b71', image: simpleIcon('n8n', 'EA4B71') },
      { name: 'ComfyUI', icon: 'CU', color: '#7c3aed' },
    ],
  },
];

export const professionalLinks = [
  {
    label: 'Portfolio',
    value: 'porfolio-47ceb.web.app',
    href: 'https://porfolio-47ceb.web.app/',
  },
  {
    label: 'Carta de recomendación',
    value: 'Última empresa',
    href: '/documents/Carta_Recomendacion_Adrian_Tebar_Galvez.pdf',
  },
];
