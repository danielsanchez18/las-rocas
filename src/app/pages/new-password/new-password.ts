import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/service/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'page-new-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-password.html',
})
export class PageNewPassword implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  isLoading = false;
  errorMessage = '';

  get email() {
    return this.authService.resetEmail;
  }

  get code() {
    return this.authService.resetCode;
  }

  ngOnInit() {
    if (!this.email || !this.code) {
      this.router.navigate(['/auth/recuperar-clave']);
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .resetPassword({
        email: this.email!,
        code: this.code!,
        newPassword: this.form.value.password,
      })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            Swal.fire({
              icon: 'success',
              title: '¡Contraseña actualizada!',
              text: 'Tu contraseña ha sido restablecida correctamente.',
              confirmButtonColor: '#3b82f6',
              timer: 1500,
              showConfirmButton: false,
            }).then(() => {
              this.router.navigate(['/auth/ingresar']);
            });
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage =
            err.error?.message || 'Error al restablecer la contraseña';
          
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: this.errorMessage,
            confirmButtonColor: '#3b82f6',
          });
        },
      });
  }
}
