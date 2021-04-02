import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  constructor(private us:UsuarioService) { }

  ngOnInit(): void {
  }

  logout(){
    this.us.logout();
  }

}
