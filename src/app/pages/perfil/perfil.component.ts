import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Subscription } from 'rxjs';
import { Usuario } from '../../models/usuario.model';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario: Usuario;
  public imagenSubir!:File;
  public imgTemp: any = '';

  constructor(private fb:FormBuilder, private us:UsuarioService, private fus: FileUploadService) {
    this.usuario = us.usuario;
   }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre,[Validators.required]],
      email: [this.usuario.email ,[Validators.required, Validators.email]],
    });
  }

  actualizarPerfil(){
    console.log(this.perfilForm.value);
    this.us.actualizarPerfil(this.perfilForm.value).subscribe(() =>{
      // console.log(resp);
      const { nombre, email}  = this.perfilForm.value;
      this.usuario.nombre = nombre;
      this.usuario.email = email;
      Swal.fire('Guardado', 'Los cambios fueron guardados', 'success');
    }, err => {
      Swal.fire('Error', err.error.msg, 'error');
    })
  }

  cambiarImagen(event: any){
    const file:File = event.target.files[0];
    this.imagenSubir = file || undefined;

    if(!file){ return this.imgTemp = ''; }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
      // console.log(reader.result); 
    }

    return '';

  }

  subirImagen(){
    this.fus.actualizarFoto(this.imagenSubir,'usuarios', this.usuario.uid! )
    .then(img =>{
      console.log(img);
      this.usuario.img = img;
      Swal.fire('Actualizado', 'La imagen se actualizo correctamente', 'success');
    }).catch(err =>{
      Swal.fire('Error', 'No se pudo actualizar la imagen', 'error');
    })
  }

}
