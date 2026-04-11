import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../auth/service/auth.service';
import { CancionService } from '../auth/service/cancion.service';
import { Cancion } from '../common/cancion';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.css']
})
export class NovedadesComponent implements OnInit {
  @Input() compact = false;

  ultimasCanciones: Cancion[] = [];
  masEscuchadas: Cancion[] = [];
  parati: Cancion[] = [];
  selectedEstilo = '';
  estilos: string[] = ['Reggaeton', 'Pop', 'Electronica'];

  constructor(private cancionService: CancionService, private authService: AuthService) { }

  ngOnInit(): void {
    if (!this.isAuthenticated()) {
      return;
    }

    this.getUltimasCanciones();
    this.getMasEscuchadas();
    this.getParaTi();
  }

  isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  trackBySongId(_: number, cancion: Cancion): number | string {
    return cancion.id ?? cancion.titulo;
  }

  getUltimasCanciones(): void {
    this.cancionService.getUltimasCanciones().subscribe(canciones => {
      this.ultimasCanciones = canciones;
      this.refreshEstilos();
    });
  }

  getMasEscuchadas(): void {
    this.cancionService.getMasEscuchadas().subscribe(canciones => {
      this.masEscuchadas = canciones;
      this.refreshEstilos();
    });
  }

  getParaTi(): void {
    this.cancionService.getParaTi().subscribe(canciones => {
      this.parati = canciones.filter(cancion => cancion.puntuacion > 3 && cancion.reproducciones > 0);
      this.refreshEstilos();
    });
  }

  filtrarPorEstilo(): void {
    if (this.selectedEstilo) {
      this.getUltimasCancionesPorEstilo(this.selectedEstilo);
      this.getMasEscuchadasPorEstilo(this.selectedEstilo);
      return;
    }

    this.getUltimasCanciones();
    this.getMasEscuchadas();
  }

  getUltimasCancionesPorEstilo(estilo: string): void {
    this.cancionService.getUltimasCancionesPorEstilo(estilo).subscribe(canciones => {
      this.ultimasCanciones = canciones;
      this.refreshEstilos();
    });
  }

  getMasEscuchadasPorEstilo(estilo: string): void {
    this.cancionService.getMasEscuchadasPorEstilo(estilo).subscribe(canciones => {
      this.masEscuchadas = canciones;
      this.refreshEstilos();
    });
  }

  private refreshEstilos(): void {
    this.estilos = [...new Set(
      [...this.ultimasCanciones, ...this.masEscuchadas, ...this.parati]
        .map(cancion => cancion.estilo)
        .filter(Boolean)
    )];
  }
}
