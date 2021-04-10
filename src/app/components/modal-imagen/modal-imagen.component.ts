import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir!:File;
  public imgTemp: any = '';


  constructor(public mis:ModalImagenService, private fus: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    this.imgTemp = null;
    this.mis.cerrarModal();
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

    const id = this.mis.id;
    const tipo = this.mis.tipo;
    this.fus.actualizarFoto(this.imagenSubir, tipo , id )
    .then(img =>{
      // console.log(img);
      Swal.fire('Actualizado', 'La imagen se actualizo correctamente', 'success');
      this.mis.nuevaImagen.emit(img);
      this.cerrarModal();
    }).catch(err =>{
      Swal.fire('Error', 'No se pudo actualizar la imagen', 'error');
    })
  }

}
