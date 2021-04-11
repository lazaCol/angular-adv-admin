import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public usuario!: Usuario;

  constructor(private us:UsuarioService, private router:Router) {
    this.usuario = us.usuario;
   }

  ngOnInit(): void {
  }

  logout(){
    this.us.logout();
  }

  buscar(termino:string){
    if(termino.length === 0){
      // this.router.navigateByUrl(`/dashboard`); 
      return;
    }
    this.router.navigateByUrl(`/dashboard/buscar/${termino}`);    
  }

}
