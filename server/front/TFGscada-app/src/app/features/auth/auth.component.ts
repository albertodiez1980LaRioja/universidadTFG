// Angular imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

// Third-party libraries imports
import { Subscription } from 'rxjs';

// App own modules and services imports
import { AuthService } from '../../guards/auth.service';
import { IUser } from '../dashboard/modules/users/users-interfaces';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  hidePassword = true;
  loginErrorMessage = '';

  private returnUrl = '/';
  private authenticateUser$!: Subscription;

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    let userJson = localStorage.getItem('user');
    let token = localStorage.getItem('token');
    if (userJson != undefined && token != undefined) {
      this.auth.user = JSON.parse(userJson);
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  authenticateUser(): void {
    const values = this.loginForm.value;
    this.router.navigateByUrl(this.returnUrl);
    this.authenticateUser$ = this.auth
      .authenticateUser(values.username, values.password)
      .subscribe({
        next: (response: any) => {
          console.log('Autenticado', response.usuario);
          localStorage.setItem('user', JSON.stringify(response.usuario));
          localStorage.setItem('token', response.token);
          this.auth.user = response.usuario;
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (err: HttpErrorResponse) => {
          console.log('Error de autenticación', err);
          if (err.status === 500) {
            this.authenticateUser();
          } else {
            this.loginForm
              .get('username')
              ?.setErrors({ error: 'Credenciales incorrectas' });
            this.loginForm
              .get('password')
              ?.setErrors({ error: 'Credenciales incorrectas' });
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.authenticateUser$?.unsubscribe();
  }
}