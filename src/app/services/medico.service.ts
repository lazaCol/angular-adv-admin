import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico.model';
import { map } from 'rxjs/operators';
const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http:HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
  
  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  cargarMedicos() {
    return this.http.get<any>(`${baseUrl}/medicos`, this.headers)
    .pipe(
      map( (resp: { ok: boolean, medicos: Medico[] }) => resp.medicos)
    );
  }

  obtenerMedicoPorId(id: string) {
    return this.http.get<any>(`${baseUrl}/medicos/${id}`, this.headers)
    .pipe(
      map( (resp: { ok: boolean, medico: Medico }) => resp.medico)
    );
  }

  crearMedico(medico:{ nombre: string; hospital:string}) {
    return this.http.post<any>(`${baseUrl}/medicos`, medico , this.headers);
  }

  actualizarMedico(medico: Medico) {
    return this.http.put<any>(`${baseUrl}/medicos/${medico._id}`, medico , this.headers);
  }

  borrarMedico( _id: string) {
    return this.http.delete<any>(`${baseUrl}/medicos/${_id}`, this.headers);
  }
}
