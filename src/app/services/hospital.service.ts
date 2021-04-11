import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  
  constructor(private http: HttpClient) {}

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

  cargarHospitales() {
    return this.http.get<any>(`${baseUrl}/hospitales`, this.headers)
    .pipe(
      map( (resp: { ok: boolean, hospitales: Hospital[] }) => resp.hospitales)
    );
  }

  crearHospital(nombre: string) {
    return this.http.post<any>(`${baseUrl}/hospitales`, { nombre }, this.headers);
  }

  actualizarHospital(nombre: string, _id: string) {
    return this.http.put<any>(`${baseUrl}/hospitales/${_id}`, { nombre }, this.headers);
  }

  borrarHospital( _id: string) {
    return this.http.delete<any>(`${baseUrl}/hospitales/${_id}`, this.headers);
  }

}
