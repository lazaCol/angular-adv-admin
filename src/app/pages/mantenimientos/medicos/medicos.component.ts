import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [],
})
export class MedicosComponent implements OnInit, OnDestroy {
  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];
  public cargando: boolean = true;
  public imgSubs!: Subscription;

  constructor(private ms: MedicoService, private mis: ModalImagenService, private bs:BusquedasService) {}

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.mis.nuevaImagen
      .pipe(delay(100))
      .subscribe((img) => this.cargarMedicos());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos() {
    this.cargando = true;
    this.ms.cargarMedicos().subscribe((medicos) => {
      // console.log(hospitales);
      this.cargando = false;
      this.medicos = medicos;
      this.medicosTemp = medicos;
    });
  }

  abrirModal(medico: Medico) {
    this.mis.abrirModal('medicos', medico._id!, medico.img);
  }

  buscar(termino: string) {
    // console.log(termino);
    if (termino.length === 0) {
      this.medicos = [...this.medicosTemp];
      return;
    }
    this.bs.buscar('medicos', termino).subscribe(resultados => {
      // console.log(resp);
      this.medicos = resultados;

    })
  }

  eliminarMedico(medico: Medico) {
    this.ms.borrarMedico(medico._id!).subscribe((resp) => {
      // console.log(resp);
      this.cargarMedicos();
      Swal.fire('Borrado', `${medico.nombre} fue borrado.`, 'success');
    });
  }
}
