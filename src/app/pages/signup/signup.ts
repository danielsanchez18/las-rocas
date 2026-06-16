import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAtSign, LucideLock, LucideUser } from '@lucide/angular';
import { UserService } from '@core/service/users/user.service';
import { RoleService } from '@core/service/roles/role.service';
import { UserRoleService } from '@core/service/roles/user-role.service';
import { AuthService } from '@core/service/auth/auth.service';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'page-signup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideUser,
    LucideAtSign,
    LucideLock,
  ],
  templateUrl: './signup.html',
})
export class PageSignup {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private userRoleService = inject(UserRoleService);
  private authService = inject(AuthService);
  private router = inject(Router);

  signupForm: FormGroup = this.fb.group({
    names: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading = false;

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { names, email, password } = this.signupForm.value;

    this.userService
      .create({ names, email, password })
      .pipe(
        // 1. Create User
        switchMap((userRes) => {
          const userId = userRes.data?.id;
          if (!userId) throw new Error('Error al crear usuario.');

          // 2. Find Roles to get "Cliente"
          return this.roleService.findAll().pipe(
            switchMap((rolesRes) => {
              const clienteRole = rolesRes.data?.find(
                (r) => r.name.toLowerCase() === 'cliente',
              );
              if (!clienteRole)
                throw new Error('Rol de cliente no encontrado en el sistema.');

              // 3. Assign Role "Cliente"
              return this.userRoleService.assignRoleToUser({
                userId,
                roleId: clienteRole.id,
              });
            }),
          );
        }),
        // 4. Log in
        switchMap(() => this.authService.login({ email, password })),
      )
      .subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Cuenta creada exitosamente',
            showConfirmButton: false,
            timer: 1500,
          });

          // 5. Redirect
          const prevUrl = this.authService.getPreviousUrl();
          const targetUrl =
            prevUrl === '/' ||
            prevUrl.includes('ingresar') ||
            prevUrl.includes('registrarse')
              ? '/'
              : prevUrl;

          this.router.navigateByUrl(targetUrl);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Signup error:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              err.error?.message ||
              err.message ||
              'No se pudo crear la cuenta. Intenta de nuevo.',
          });
        },
      });
  }
}
