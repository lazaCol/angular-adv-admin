import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public imgSubs!: Subscription;
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;

  constructor(private us: UsuarioService, private bs: BusquedasService, private mis:ModalImagenService) { }
  
  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.mis.nuevaImagen.pipe(delay(100)).subscribe(img => this.cargarUsuarios());
  }
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.us.cargarUsuarios(this.desde).subscribe(({ total, usuarios }) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    })
  }

  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde > this.totalUsuarios) {
      this.desde -= valor;
    }

    this.cargarUsuarios()
  }

  buscar(termino: string) {
    // console.log(termino);
    if (termino.length === 0) {
      this.usuarios = [...this.usuariosTemp];
      return;
    }
    this.bs.buscar('usuarios', termino).subscribe(resultados => {
      // console.log(resp);
      this.usuarios = resultados;

    })
  }

  eliminarUsuario(usuario: Usuario) {

    if(usuario.uid === this.us.uid){
      Swal.fire('Error','No puede borrrase a si mismo',  'error');
      return;
    }

    Swal.fire({
      title: '¿Borrar Usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.us.eliminarUsuario(usuario).subscribe(resp => {

          Swal.fire('Usuario Borrado', `${usuario.nombre} fue eliminado correctamente`, 'success')
          this.cargarUsuarios();
        }
        )
      }
    })

  }

  cambiarRole(usuario:Usuario){
    this.us.guardarUsuario(usuario).subscribe( resp => {
      console.log(resp);
      
    })
  }

  abrirModal(usuario:Usuario){
    this.mis.abrirModal('usuarios', usuario.uid!, usuario.img );
  }

}
