import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import gsap from 'gsap';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit { 
  currentUser: any;
  constructor(private authService: AuthService,private snackBar: MatSnackBar){}
  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }
  animarBoton() {
    const button = document.querySelector('.truck-button');
    const box = button?.querySelector('.box') as HTMLElement;
    const truck = button?.querySelector('.truck') as HTMLElement;

    if (button && box && truck && !button.classList.contains('done')) {

      if (!button.classList.contains('animation')) {

        button.classList.add('animation');

        gsap.to(button, {
          '--box-s': 1,
          '--box-o': 1,
          duration: 0.3,
          delay: 0.5
         
        });

        gsap.to(box, {
          x: 0,
          duration: 0.4,
          delay: 0.7
        });

        gsap.to(button, {
          '--hx': -5,
          '--bx': 50,
          duration: 0.18,
          delay: 0.92
        });

        gsap.to(box, {
          y: 0,
          duration: 0.1,
          delay: 1.15
        });

        gsap.set(button, {
          '--truck-y': 0,
          '--truck-y-n': -26
        });

        gsap.to(button, {
          '--truck-y': 1,
          '--truck-y-n': -25,
          duration: 0.2,
          delay: 1.25,
          onComplete() {
            gsap.timeline({
              onComplete() {
                button.classList.add('done');
              }
            }).to(truck, {
              x: 0,
              duration: 0.4
            }).to(truck, {
              x: 40,
              duration: 1
            }).to(truck, {
              x: 20,
              duration: 0.6
            }).to(truck, {
              x: 96,
              duration: 0.4
            });
            gsap.to(button, {
              '--progress': 1,
              duration: 2.4,
              ease: "power2.in"
            });
          }
        });

      }

    } else if (button && truck && box) {
      button.classList.remove('animation', 'done');
      gsap.set(truck, {
        x: 4
      });
      gsap.set(button, {
        '--progress': 0,
        '--hx': 0,
        '--bx': 0,
        '--box-s': 0.5,
        '--box-o': 0,
        '--truck-y': 0,
        '--truck-y-n': -26
      });
      gsap.set(box, {
        x: -24,
        y: -6
      });
    }
    const message = this.currentUser ? `Tu pedido está preparándose. Te contactaremos al correo próximamente para informarte (${this.currentUser.email}).` : "Tu pedido está preparándose.";

    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['mat-toolbar', 'mat-primary']
    });
  }
 
   
  
}
  



