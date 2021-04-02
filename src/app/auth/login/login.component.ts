import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {


  public loginForm = this.fb.group({
    email: ['nathalym21@mail.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required]],
    remember: [false]
  })

  public auth2: any;

  constructor(private router: Router, private fb: FormBuilder, private us: UsuarioService, private ngZone:NgZone) { }

  ngOnInit(): void {
    this.renderButton();
  }

  login() {
    // console.log(this.loginForm.value);

    this.us.login(this.loginForm.value).subscribe(resp => {
      // console.log(resp);

      if (this.loginForm.get('remember')?.value) {
        localStorage.setItem('email', this.loginForm.get('email')?.value)
      } else {
        localStorage.removeItem('email');
      }

      this.router.navigateByUrl('/');

    }, err => {
      console.warn(err.error.msg);
      Swal.fire('Error', err.error.msg, 'error');
    })
    // this.router.navigateByUrl('/');
  }

  // onSuccess(googleUser: any) {
  //   console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
  //   console.log(id_token);

  // }

  // onFailure(error: any) {
  //   console.log(error);
  // }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });

    this.startApp();

  }

  async startApp() {
      await this.us.googleInit();
      this.auth2 = this.us.auth2;
      this.attachSignin(document.getElementById('my-signin2'));
  }

  attachSignin(element: any) {
    // console.log(element.id);
    this.auth2.attachClickHandler(element, {},
      (googleUser: any) => {
        const id_token = googleUser.getAuthResponse().id_token;
        // console.log(id_token);
        this.us.loginGoogle(id_token).subscribe( resp => {
          this.ngZone.run(() => {
            this.router.navigateByUrl('/');
          })
        });
        //mover al dashboard
      }, function (error: any) {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

}
