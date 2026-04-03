import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface PortfolioProject {
  title: string;
  summary: string;
  stack: string[];
  link: string;
  status: string;
  accent: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly fullName = 'Adrián Tebar Gálvez';
  readonly professionalRole = 'Desarrollador de Software | Full Stack';
  readonly contactEmail = 'adriantebar19@gmail.com';
  readonly contactPhoneDisplay = '+34 640 29 89 57';
  readonly contactPhoneWhatsApp = '34640298957';

  readonly projects: PortfolioProject[] = [
    {
      title: 'Panel de Gestión Empresarial',
      summary:
        'Dashboard moderno para analizar métricas, clientes y operaciones con foco en rendimiento y experiencia de usuario.',
      stack: ['Angular', 'TypeScript', 'APIs REST'],
      link: 'https://github.com/Adriantebargalvez',
      status: 'Proyecto destacado',
      accent: '#38bdf8',
    },
    {
      title: 'Plataforma E-commerce Full Stack',
      summary:
        'Arquitectura de tienda online con catálogo, panel administrativo y flujo de compra optimizado para conversión.',
      stack: ['Frontend', 'Backend', 'SQL'],
      link: 'https://github.com/Adriantebargalvez?tab=repositories',
      status: 'En evolución',
      accent: '#a78bfa',
    },
    {
      title: 'Sistema de Reservas Inteligente',
      summary:
        'Aplicación web para gestionar reservas, disponibilidad y notificaciones con una interfaz clara y responsive.',
      stack: ['Angular', 'Node.js', 'UX/UI'],
      link: 'https://github.com/Adriantebargalvez',
      status: 'Caso práctico',
      accent: '#34d399',
    },
  ];

  contactForm = {
    name: '',
    email: '',
    message: '',
    channel: 'whatsapp',
  };

  formStatus = 'Elige si prefieres contactarme por WhatsApp o por correo.';

  sendMessage(): void {
    if (this.contactForm.channel === 'email') {
      this.openMailClient();
      return;
    }

    this.openWhatsAppChat();
  }

  private openWhatsAppChat(): void {
    const text = encodeURIComponent(
      `Hola Adrián, soy ${this.contactForm.name.trim()}.\n\n${this.contactForm.message.trim()}\n\nMi correo de contacto es: ${this.contactForm.email.trim()}`,
    );

    window.open(
      `https://wa.me/${this.contactPhoneWhatsApp}?text=${text}`,
      '_blank',
      'noopener,noreferrer',
    );

    this.formStatus = 'Se ha abierto WhatsApp con el mensaje preparado.';
    this.contactForm = {
      name: '',
      email: '',
      message: '',
      channel: 'whatsapp',
    };
  }

  private openMailClient(): void {
    const subject = encodeURIComponent(
      `Contacto por portfolio - ${this.contactForm.name.trim()}`,
    );
    const body = encodeURIComponent(
      `Hola Adrián,\n\n${this.contactForm.message.trim()}\n\nEmail de contacto: ${this.contactForm.email.trim()}\n`,
    );

    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${this.contactEmail}&su=${subject}&body=${body}`,
      '_blank',
      'noopener,noreferrer',
    );

    this.formStatus = 'Se ha abierto Gmail con el mensaje preparado.';
    this.contactForm = {
      name: '',
      email: '',
      message: '',
      channel: 'email',
    };
  }
}
