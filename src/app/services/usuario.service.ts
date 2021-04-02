import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { catchError, map, tap } from "rxjs/operators";
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

const baseUrl = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor(private http: HttpClient, private router:Router, private ngZone:NgZone) { 
    this.googleInit();
  }

  googleInit(){

    return new Promise(resolve => {
      
          gapi.load('auth2', () => {
            // Retrieve the singleton for the GoogleAuth library and set up the client.
            this.auth2 = gapi.auth2.init({
              client_id: '358335335339-nrpr6llmtkju8jojtqt92tm2pgk55251.apps.googleusercontent.com',
              cookiepolicy: 'single_host_origin',
            });
            resolve(null);
          });

    });
  }

  logout(){
    localStorage.removeItem('token');
    this.auth2.signOut().then( () => {

      this.ngZone.run( () => {
        this.router.navigateByUrl('/login');
      })
    });

  }

  validarToken(): Observable<boolean>{
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${baseUrl}/login/renew`,{
      headers:{
        'x-token': token,
      }
    })
    .pipe(
      tap( (resp:any) => {
        localStorage.setItem('token', resp.token)
      }),
      map(resp => true),
      catchError(err => of(false))
    )
  }

  crearUsuario(formData:RegisterForm){  
    return this.http.post(`${baseUrl}/usuarios`, formData)
    .pipe(
      tap( (resp:any) => {
        localStorage.setItem('token', resp.token)
      }),
    )
  }

  login(formData:LoginForm){  
    return this.http.post(`${baseUrl}/login`, formData)
    .pipe(
      tap( (resp:any) => {
        localStorage.setItem('token', resp.token)
      }),
    )
  }

  loginGoogle(token:string){  
    return this.http.post(`${baseUrl}/login/google`, {token})
    .pipe(
      tap( (resp:any) => {
        localStorage.setItem('token', resp.token)
      }),
    )
  }
}
