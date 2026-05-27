import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ContactChannel = 'whatsapp' | 'email';

interface Project {
  title: string;
  link: string;
  description: string;
  technologies: string[];
  rationale: string;
  cta: string;
  visual: string;
  image?: string;
  download?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  readonly fullName = 'Adrián Tebar Gálvez';
  readonly role = ' Diseño Web y Aplicaciones | Desarrollador Angular ';
  readonly location = 'Valencia, España';
  readonly contactEmail = 'adriantebar19@gmail.com';
  readonly whatsappDisplay = '+34 640 29 89 57';
  readonly whatsappNumber = '34640298957';
  readonly linkedinUrl = 'https://www.linkedin.com/in/adri%C3%A1n-tebar-g%C3%A1lvez-970b62203';
  readonly githubUrl = 'https://github.com/Adriantebargalvez';
  readonly cvUrl = 'assets/Adrian_Tebar_Galvez_CV.pdf';
  readonly profileImageUrl = 'assets/profile-placeholder.jpeg';
  readonly profileFallbackUrl = 'assets/profile-placeholder.jpeg';

  readonly strengths = [
    'Angular',
    'Diseño web',
    'Aplicaciones modernas',
    'Responsive UI',
  ];

  readonly projects: Project[] = [
    {
      title: 'Plataforma de Gestión de Usuarios',
      link: 'https://gestiondeusuarios-ad01a.web.app',
      description:
        'Plataforma moderna para gestionar usuarios, roles y permisos con frontend Angular y backend Java.',
      technologies: [
        'Angular 16',
        'Bootstrap 5',
        'Spring Boot 3',
        'Java 17',
        'REST API',
        'JPA / Hibernate',
        'Docker',
        'Firebase Hosting',
        'Render',
      ],
      rationale:
        'Se han usado tecnologias para separar la interfaz del backend, gestionar usuarios y permisos con una API organizada, persistir datos y desplegar frontend y servidor en entornos independientes.',
      cta: 'Ver proyecto',
      visual: 'users',
      image: 'assets/projects/gestion-usuarios.svg',
    },
    {
      title: 'Blog de Muebles y Decoración',
      link: 'https://blogmuebles-581b5.web.app',
      description:
        'Sitio web profesional de contenido y catálogo visual para mobiliario, decoración y contacto comercial.',
      technologies: [
        'HTML5',
        'CSS3',
        'JavaScript',
        'Firebase Hosting',
        'i18n ES/EN/PT',
        'WhatsApp Links',
      ],
      rationale:
        'Se han usado tecnologias sencillas para crear una web ligera, rapida y facil de publicar, con soporte multiidioma y contacto comercial directo.',
      cta: 'Ver proyecto',
      visual: 'blog',
      image: 'assets/projects/blog-muebles.png',
    },
    {
      title: 'Kreitekfy Plataforma Musical',
      link: 'https://kreitekfy-8af58.web.app',
      description:
        'Concepto de plataforma musical con interfaz SPA, autenticación, biblioteca y experiencia responsive.',
      technologies: [
        'Angular 16',
        'TypeScript',
        'SCSS',
        'Audio API',
        'Spring Boot 3',
        'Java 17',
        'API REST',
        'Spring Security',
        'JWT',
        'JPA / Hibernate',
        'Docker',
        'Firebase Hosting',
        'Inicio de sesión con Google',
        'Render',
      ],
      rationale:
        'Se han usado tecnologias para construir una plataforma musical con frontend SPA, reproduccion de audio, autenticacion segura, gestion de datos y despliegue separado entre frontend y API.',
      cta: 'Ver proyecto',
      visual: 'music',
      image: 'assets/projects/kreitekfy.png',
    },
    {
      title: 'FCT Manager Aplicación de Escritorio',
      image:'assets/projects/GestionFCT.png',
      link: 'assets/FCT-Manager-Windows.zip',
      description:
        'Aplicación de escritorio creada para ayudar a centros educativos a gestionar prácticas, empresas y alumnos de forma eficiente.',
      technologies: [
        '.NET MAUI',
        'C#',
        '.NET 8',
        'MVVM architecture',
        'ASP.NET Core REST API',
        'MySQL',
        'Docker',
        'Render',
        'Windows packaging',
      ],
      rationale:
        'Se han usado tecnologias para crear una aplicacion de escritorio mantenible, conectarla con una API backend, guardar los datos en base de datos y preparar su distribucion en Windows.',
      cta: 'Descargar aplicación',
      visual: 'desktop',
      download: 'FCT-Manager-Windows.zip',
    },
    {
      title: 'Portfolio Personal',
      link: '#hero',
        image:'assets/projects/PORFOLIO.png',
      description:
        'Portfolio personal desarrollado con Angular 17 y TypeScript, con diseño premium en CSS personalizado, enfoque responsive, SEO técnico básico, testing y contacto integrado por WhatsApp/Gmail.',
      technologies: [
        'Angular 17',
        'TypeScript',
        'CSS personalizado',
        'SEO',
        'Karma',
        'Jasmine',
      ],
      rationale:
        'Se han usado tecnologias para organizar el portfolio como una aplicacion mantenible, cuidar la presentacion visual, mejorar la base SEO y comprobar que el componente principal funciona correctamente.',
      cta: 'Ver portfolio',
      visual: 'portfolio',
    },
    {
      title: 'TempoLux',
      link: 'https://tempolux-61eaa.web.app/',
      description:
        'Tienda online de relojes de lujo con catalogo, accesorios y un configurador para disenar tu propio reloj.',
      technologies: [
        'Angular 21',
        'TypeScript',
        'Tailwind CSS',
        'Spring Boot 3',
        'Java 17+',
        'REST API',
      ],
      rationale:
        'Se han usado tecnologias orientadas a separar bien el frontend del backend, mantener el proyecto ordenado y ofrecer una experiencia visual cuidada con datos servidos desde una API.',
      cta: 'Ver Proyecto',
      visual: 'tempolux',
      image: 'assets/projects/tempolux.png',
    },
    {
      title: 'Currículum',
      link: '#hero',
      description:
        'Currículum vitae interactivo desarrollado como aplicación web, con secciones de experiencia, formación, habilidades y contacto.',
      technologies: [
        'Angular',
        'TypeScript',
        'HTML',
        'CSS3',
        'Responsive Design',
      ],
      rationale:
        'Presentación profesional en formato web para destacar la experiencia y habilidades de forma visual e interactiva.',
      cta: 'Ver Proyecto',
      visual: 'curriculum',
    },
    {
      title: 'API Zelda con Interfaz',
      link: '#hero',
      description:
        'Aplicación web que consume la API pública de Zelda para mostrar personajes, juegos, objetos y más, con una interfaz visual temática.',
      technologies: [
        'Angular',
        'TypeScript',
        'HTML',
        'CSS3',
        'REST API',
        'RxJS',
        'Responsive Design',
      ],
      rationale:
        'Consumo de API externa con Angular y RxJS para construir una interfaz temática que muestra el universo de The Legend of Zelda de forma visual e interactiva.',
      cta: 'Ver Proyecto',
      visual: 'zelda',
    },
    {
      title: 'Generador de Vídeos',
      link: '#hero',
      description:
        'Herramienta web para generar y editar vídeos de forma automática, con integración de IA para creación de contenido visual dinámico.',
      technologies: [
        'Angular',
        'TypeScript',
        'HTML',
        'CSS3',
        'REST API',
        'IA / Generative AI',
        'Responsive Design',
      ],
      rationale:
        'Combina una interfaz Angular moderna con APIs de generación de contenido para ofrecer una experiencia fluida en la creación automatizada de vídeos.',
      cta: 'Próximamente',
      visual: 'videogen',
    },
    {
      title: 'Tienda de Ropa',
      link: '#hero',
      description:
        'Ecommerce de moda con catálogo de productos, filtros por categoría, carrito de compra y pasarela de pago integrada.',
      technologies: [
        'Angular',
        'TypeScript',
        'HTML',
        'CSS3',
        'Spring Boot',
        'Java',
        'REST API',
        'MySQL',
        'Responsive Design',
      ],
      rationale:
        'Angular gestiona la SPA del catálogo y el carrito, Spring Boot expone la API de productos y pedidos, y MySQL almacena el inventario y los usuarios.',
      cta: 'Próximamente',
      visual: 'clothing',
    },
    {
      title: 'App de Tienda de Ropa',
      link: '#hero',
      description:
        'Aplicación móvil/de escritorio para gestión y compra de moda, con experiencia nativa, notificaciones y sincronización con la tienda web.',
      technologies: [
        '.NET MAUI',
        'C#',
        'XAML',
        'MVVM',
        'REST API',
        'MySQL',
        'Responsive Design',
      ],
      rationale:
        '.NET MAUI permite construir la app para múltiples plataformas desde una sola base de código, conectada a la misma API REST de la tienda web.',
      cta: 'Próximamente',
      visual: 'clothingapp',
    },
  ];

  contactForm = {
    name: '',
    email: '',
    company: '',
    message: '',
    channel: 'whatsapp' as ContactChannel,
  };

  formStatus = 'Elige WhatsApp o Gmail para preparar tu mensaje.';

  ngAfterViewInit(): void {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: '0px 0px -70px 0px',
        threshold: 0.12,
      },
    );

    elements.forEach((element) => observer.observe(element));
  }

  sendMessage(): void {
    if (this.contactForm.channel === 'email') {
      this.openGmail();
      return;
    }

    this.openWhatsApp();
  }

  useProfileFallback(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.src = this.profileFallbackUrl;
  }

  private openWhatsApp(): void {
    window.open(
      `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(this.buildContactMessage())}`,
      '_blank',
      'noopener,noreferrer',
    );

    this.formStatus = 'WhatsApp se ha abierto con el mensaje preparado.';
    this.resetForm('whatsapp');
  }

  private openGmail(): void {
    const subject = encodeURIComponent(
      `Contacto desde portfolio - ${this.contactForm.name.trim()}`,
    );
    const body = encodeURIComponent(this.buildContactMessage());

    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${this.contactEmail}&su=${subject}&body=${body}`,
      '_blank',
      'noopener,noreferrer',
    );

    this.formStatus = 'Gmail se ha abierto con el mensaje preparado.';
    this.resetForm('email');
  }

  private buildContactMessage(): string {
    const company = this.contactForm.company.trim() || 'No especificada';

    return [
      `Hola Adrián, soy ${this.contactForm.name.trim()}.`,
      '',
      this.contactForm.message.trim(),
      '',
      `Correo: ${this.contactForm.email.trim()}`,
      `Empresa: ${company}`,
    ].join('\n');
  }

  private resetForm(channel: ContactChannel): void {
    this.contactForm = {
      name: '',
      email: '',
      company: '',
      message: '',
      channel,
    };
  }
}
