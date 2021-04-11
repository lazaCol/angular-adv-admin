import { Component, OnInit, OnDestroy } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [],
})
export class HospitalesComponent implements OnInit, OnDestroy {
  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs!: Subscription;

  constructor(private hs: HospitalService, private mis:ModalImagenService, private bs:BusquedasService) {}
  
  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.mis.nuevaImagen.pipe(delay(100)).subscribe(img => this.cargarHospitales());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarHospitales() {
    this.cargando = true;
    this.hs.cargarHospitales().subscribe((hospitales) => {
      // console.log(hospitales);
      this.cargando = false;
      this.hospitales = hospitales;
      this.hospitalesTemp = hospitales;
    });
  }

  guardarCambios(hospital: Hospital) {
    this.hs
      .actualizarHospital(hospital.nombre, hospital._id!)
      .subscribe((resp) => {
        console.log(resp);
        Swal.fire(
          'Actualizado',
          `${hospital.nombre} fue actualizado.`,
          'success'
        );
      });
  }

  eliminarHospital(hospital: Hospital) {
    this.hs.borrarHospital(hospital._id!).subscribe((resp) => {
      console.log(resp);
      this.cargarHospitales();
      Swal.fire('Borrado', `${hospital.nombre} fue borrado.`, 'success');
    });
  }

  async abrirSweetAlert() {
    const {value} = await Swal.fire<string>({
      input: 'text',
      title: 'Crear Hospital',
      inputLabel: 'Ingrese el nombre del Hospital',
      inputPlaceholder: 'Nombre Hospital',
      showCancelButton: true,
    });
    if(value !== undefined && value.trim().length > 0){
      this.hs.crearHospital(value).subscribe((resp:any) =>{
        // console.log(resp);
        this.hospitales.push(resp.hospital);
        
      })
    }
  }

  abrirModal(hospital:Hospital){
    this.mis.abrirModal('hospitales', hospital._id!, hospital.img );
  }

  buscar(termino: string) {
    // console.log(termino);
    if (termino.length === 0) {
      this.hospitales = [...this.hospitalesTemp];
      return;
    }
    this.bs.buscar('hospitales', termino).subscribe(resultados => {
      // console.log(resp);
      this.hospitales = resultados;

    })
  }
}
