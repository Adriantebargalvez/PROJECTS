import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from '../common/usuario';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
 
  mode: "NEW" | "UPDATE" = "NEW"
  userId?: number;
  usuario?: Usuario;
  constructor(private route: ActivatedRoute,private usariosService: UsuariosService){}  
    ngOnInit(): void {
      const entryParam: string = this.route.snapshot.paramMap.get("userId") ?? "new"
      if(entryParam !== "new"){
        this.userId = +this.route.snapshot.paramMap.get("userId")!;
        this.mode = "UPDATE";
        this.getUserById(this.userId!);
      } else{
        this.mode = "NEW";
        this.initializerItem();
      }
    }
   
 
    private getUserById(userId: number){
      this.usariosService.getUserById(userId).subscribe({
        next: (userRequest) =>{this.usuario= userRequest },
        error: (err) => {this.handleError(err);}
      })
    }
 private handleError(err: any): void {
    
  }
 private initializerItem(): void {
    this.usuario = new Usuario(undefined,"","","","");
  }
  public saveUser(): void {
    if  (this.mode === "NEW") {
      this.insertUser();
    }
    if  (this.mode === "UPDATE") {
      this.updateUser();
    }
}
 private updateUser(): void {
  this.usariosService.update(this.usuario!).subscribe({
    next: (userUpdate) =>{
      console.log("Modificado Correctamente");
      console.log(userUpdate)
     },
    error: (err) => {this.handleError(err);}
  })
  }
  private insertUser(): void {
    this.usariosService.insert(this.usuario!).subscribe({
      next: (userInserted) =>{
        console.log("Insertado Correctamente");
        console.log(userInserted)
       },
      error: (err) => {this.handleError(err);}
    })
  }
  
}
