import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm!:FormGroup;
  public hospitales:Hospital[] = [];
  public hospitalSeleccionado!: Hospital | undefined;
  public medicoSeleccionado!:Medico;

  constructor(private fb:FormBuilder, private hs:HospitalService, private ms:MedicoService, private router:Router, private ar:ActivatedRoute) { }

  ngOnInit(): void {
    this.ar.params.subscribe( ({id}) => {
      this.cargarMedico(id);
    })


    this.medicoForm = this.fb.group({
      nombre: ['',[Validators.required]],
      hospital: ['',[Validators.required]],
    })

    this.cargarHospitales();

    this.medicoForm.get('hospital')?.valueChanges.subscribe( hospitalId => {
      console.log(hospitalId);
      this.hospitalSeleccionado = this.hospitales.find(x => x._id === hospitalId);
      // console.log(this.hospitalSeleccionado);
      
    })
  }

  cargarMedico(id:string){

    if(id === 'New'){
      return;
    }

    this.ms.obtenerMedicoPorId(id).pipe(delay(100)).subscribe( medico =>{

      if(!medico){
        this.router.navigateByUrl(`/dashboard/medicos`);
        return;
      }
      const { nombre, hospital } = medico;
      // console.log(nombre, hospital?._id);
      
      this.medicoSeleccionado = medico;

      this.medicoForm.setValue({nombre, hospital: hospital?._id});
    })
  }

  cargarHospitales(){
    this.hs.cargarHospitales().subscribe( (hospitales:Hospital[]) => {
      this.hospitales = hospitales;
      
    })
  }

  guardarMedico(){
    // console.log(this.medicoForm.value);

    if(this.medicoSeleccionado){
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id,
      }
      this.ms.actualizarMedico( data ).subscribe( resp => {
        Swal.fire('Actualizado', `${this.medicoSeleccionado.nombre} actualizado correctamente.`, 'success');
      })
    }else{
      const { nombre } = this.medicoForm.value;
      this.ms.crearMedico(this.medicoForm.value).subscribe(resp =>{
        // console.log(resp);
        Swal.fire('Creado', `${nombre} creado correctamente.`, 'success');
        this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
      })
    }
  }

}
