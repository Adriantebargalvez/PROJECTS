import { Component, OnInit } from '@angular/core';
import { CancionService } from '../auth/service/cancion.service';
import { Cancion } from '../common/cancion';
import { AuthService } from '../auth/service/auth.service';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.css']
})
export class NovedadesComponent implements OnInit {
  ultimasCanciones: Cancion[] = [];
  masEscuchadas: Cancion[] = []; 
  parati: Cancion[] = []; 
  selectedEstilo: string | undefined; 
  estilos: string[] = ['Reggaeton', '	Pop', 'Electronica'];
 // isAuthenticated: boolean = false; 
  constructor(private cancionService: CancionService,private authService: AuthService) { }

  ngOnInit(): void {
    this.getUltimasCanciones();
    this.getMasEscuchadas();
    this.getParaTi();
  }
  isAuthenticated(): boolean {
    return this.authService.isLoggedIn(); // Método que verifica si el usuario está autenticado
  }

  getUltimasCanciones(): void {
    this.cancionService.getUltimasCanciones()
      .subscribe(canciones => {
        this.ultimasCanciones = canciones;
      });
  }
  getMasEscuchadas(): void { 
    this.cancionService.getMasEscuchadas()
      .subscribe(canciones => {
        this.masEscuchadas = canciones;
      });
  }
  getParaTi(): void {
    this.cancionService.getParaTi()
      .subscribe(canciones => {
        this.parati = canciones.filter(cancion => cancion.puntuacion > 3 && cancion.reproducciones > 0);
      });
  }
  filtrarPorEstilo(): void { 
    if (this.selectedEstilo) {
      this.getUltimasCancionesPorEstilo(this.selectedEstilo);
      this.getMasEscuchadasPorEstilo(this.selectedEstilo);
    } else {
      this.getUltimasCanciones();
      this.getMasEscuchadas();
    }
  }
  
  getUltimasCancionesPorEstilo(estilo: string): void {
    this.cancionService.getUltimasCancionesPorEstilo(estilo)
      .subscribe(canciones => {
        this.ultimasCanciones = canciones;
      });
  }
  getMasEscuchadasPorEstilo(estilo: string): void {
    this.cancionService.getMasEscuchadasPorEstilo(estilo)
      .subscribe(canciones => {
        this.masEscuchadas = canciones;
      });
  }

}
