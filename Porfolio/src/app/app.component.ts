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
        'TypeScript',
        'HTML',
        'CSS',
        'Bootstrap 5',
        'Spring Boot 3',
        'Java 17',
        'REST API',
        'JPA',
        'Hibernate',
        'H2',
        'Docker',
        'Firebase Hosting',
        'Render',
        'MapStruct',
      ],
      rationale:
        'Angular estructura la interfaz y formularios, Bootstrap acelera el diseño responsive y Spring Boot aporta una API backend organizada para usuarios, roles y datos.',
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
        'SCSS',
        'JavaScript',
        'Firebase Hosting',
        'i18n ES/EN/PT',
        'localStorage',
        'WhatsApp Links',
        'Responsive Design',
      ],
      rationale:
        'HTML, CSS y JavaScript permiten una web ligera y rápida; Firebase Hosting facilita el despliegue y el sistema i18n mejora la presentación multiidioma.',
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
        'HTML',
        'CSS',
        'TypeScript',
        'SCSS',
        'Diseño responsive',
        'Audio API',
        'Spring Boot 3',
        'Java 17',
        'Spring Security',
        'JWT',
        'JPA',
        'Hibernate',
        'H2',
        'MapStruct',
        'Docker',
        'Firebase Hosting',
        'Angular Router',
        'RxJS',
        'Inicio de sesión con Google',
        'Render',
      ],
      rationale:
        'Angular construye la SPA musical, Spring Boot gestiona el backend, la seguridad y los datos, JWT controla la autenticación, Firebase Hosting publica el frontend y Render aloja y ejecuta la API en producción.',
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
        'XAML',
        'MVVM architecture',
        'ASP.NET Core REST API',
        'REST API',
        'HttpClient / JSON',
        'Docker',
        'MySQL',
        'MySqlConnector',
        'Docker',
        'Render',
        'Windows packaging',
      ],
      rationale:
        '.NET MAUI construye la aplicación de escritorio, ASP.NET Core expone la API, MySQL almacena los datos y Docker/Render preparan el despliegue backend.',
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
        'HTML',
        'CSS3',
        'Angular Forms',
        'SEO',
        'Responsive Design',
        'Karma',
        'Jasmine',
      ],
      rationale:
        'Angular organiza la aplicación de forma mantenible, TypeScript centraliza la lógica y los datos, y CSS personalizado permite construir una interfaz visualmente potente sin depender de plantillas genéricas.',
      cta: 'Ver portfolio',
      visual: 'portfolio',
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
