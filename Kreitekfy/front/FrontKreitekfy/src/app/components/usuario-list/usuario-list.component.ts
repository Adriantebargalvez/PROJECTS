import { Component, OnInit } from '@angular/core';
import { Usuario } from '../common/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit {
usuario: Usuario[]=[];
userIdDelete?: number;
page: number = 0;
size: number = 2;
sort: string = ""

first: boolean= false
last: boolean= false
totalPages: number = 0;
totalElements: number = 0;

nombreFilter?: string;
apellidosFilter?: string;
rolFilter?: string;


constructor(private usuariosService: UsuariosService){}

  ngOnInit(): void {
    this.getLista();
  }
  public nextPage():void{
 this.page = this.page + 1;
 this.getLista();
  }
  public previusPage():void{
    this.page = this.page - 1;
    this.getLista();
  }
  
  public searchByFliters(): void{
   this.getLista();
  }
  private buildFilters(): string |undefined{
    const filters: string[]= [];
    if(this.nombreFilter){
      filters.push("nombre:MATCH:" + this.nombreFilter);
    }
    if(this.apellidosFilter){
      filters.push("apellidos:MATCH:" + this.apellidosFilter);
    }
    if(this.rolFilter){
      filters.push("rol:MATCH:" + this.rolFilter);
    }
   
    if(filters.length >0){
      let globalFilters: string = "";
      for (let filter of filters){
        globalFilters = globalFilters + filter + ",";
      }
      globalFilters = globalFilters.substring(0, globalFilters.length-1);
      return globalFilters;
    }else{
      return undefined;
    }
  }
  private getLista(): void {
    const filters:string | undefined = this.buildFilters();
    this.usuariosService.getAll(this.page,this.size,this.sort, filters).subscribe({
      next: (data: any) => {
        this.usuario = data.content;
        this.first = data.first
        this.last = data.last
        this.totalPages = data.totalPages
        this.totalElements = data.totalElements
      },
      error: (err) => {this.handleError(err);}
    })
  }
  private handleError(error: any): void {
    console.log(error);
  }
public prepareUserDelete(usuarioid: number): void{
  this.userIdDelete = usuarioid;
}
public deleteUser(): void {
  if(this.userIdDelete){
  this.usuariosService.deleteUser(this.userIdDelete!).subscribe({
    next: (data) => {
      this.getLista();
    },
    error: (err) => {this.handleError(err)}
  })
}
}


}
