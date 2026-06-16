import { Component, inject, OnInit, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideUpload } from '@lucide/angular';
import { UserService } from '@core/service/users/user.service';
import { AuthService } from '@core/service/auth/auth.service';
import { UserResponse } from '@core/interfaces/users/user.interface';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'page-profile-info',
  imports: [CommonModule, FormsModule, LucideUpload],
  templateUrl: './info.html',
})
export class PageProfileInfo implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  user: UserResponse | null = null;

  editMode: 'names' | 'email' | 'phone' | 'password' | null = null;
  isUploadingPhoto = false;

  // Form values
  editNames: string = '';
  editEmail: string = '';
  editPhone: string = '';

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor() {
    effect(() => {
      const authUser = this.authService.currentUser();
      // Only fetch the full user details if we have an authUser and we haven't loaded it yet,
      // or if the ID changed.
      if (authUser?.id && (!this.user || this.user.id !== authUser.id)) {
        this.fetchUserDetails(authUser.id);
      }
    });
  }

  ngOnInit() {
    // We let the effect handle the loading
  }

  async fetchUserDetails(id: string) {
    try {
      const res = await firstValueFrom(this.userService.findById(id));
      if (res.data) {
        this.user = res.data;
        this.resetForms();
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error loading user', error);
    }
  }

  resetForms() {
    if (this.user) {
      this.editNames = this.user.names || '';
      this.editEmail = this.user.email || '';
      this.editPhone = this.user.phoneNumber || '';
    }
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  private extractErrorMessage(error: any, defaultMsg: string): string {
    return error?.error?.message || error?.message || defaultMsg;
  }

  toggleEdit(field: 'names' | 'email' | 'phone' | 'password' | null) {
    this.editMode = field;
    if (field === null) {
      this.resetForms();
    }
  }

  async saveNames() {
    if (!this.user?.id) return;
    if (!this.editNames.trim()) {
      Swal.fire('Atención', 'El nombre no puede estar vacío', 'warning');
      return;
    }
    try {
      await firstValueFrom(this.userService.updateProfile(this.user.id, {
        names: this.editNames,
        phoneNumber: this.user.phoneNumber,
        photoUrl: this.user.photoUrl
      }));
      Swal.fire('Éxito', 'Nombre actualizado correctamente', 'success');
      await firstValueFrom(this.authService.loadCurrentUser()); // Refresh global signal
      if (this.user?.id) await this.fetchUserDetails(this.user.id);
      this.toggleEdit(null);
    } catch (error: any) {
      Swal.fire('Error', this.extractErrorMessage(error, 'No se pudo actualizar el nombre'), 'error');
    }
  }

  async saveEmail() {
    if (!this.user?.id) return;
    if (!this.editEmail.trim() || !this.editEmail.includes('@')) {
      Swal.fire('Atención', 'Ingresa un correo electrónico válido', 'warning');
      return;
    }
    try {
      await firstValueFrom(this.userService.updateEmail(this.user.id, {
        email: this.editEmail
      }));
      Swal.fire('Éxito', 'Correo actualizado correctamente', 'success');
      await firstValueFrom(this.authService.loadCurrentUser()); // Refresh global signal
      if (this.user?.id) await this.fetchUserDetails(this.user.id);
      this.toggleEdit(null);
    } catch (error: any) {
      Swal.fire('Error', this.extractErrorMessage(error, 'No se pudo actualizar el correo'), 'error');
    }
  }

  async savePhone() {
    if (!this.user?.id) return;
    try {
      await firstValueFrom(this.userService.updateProfile(this.user.id, {
        names: this.user.names,
        phoneNumber: this.editPhone,
        photoUrl: this.user.photoUrl
      }));
      Swal.fire('Éxito', 'Teléfono actualizado correctamente', 'success');
      await firstValueFrom(this.authService.loadCurrentUser()); // Refresh global signal
      if (this.user?.id) await this.fetchUserDetails(this.user.id);
      this.toggleEdit(null);
    } catch (error: any) {
      Swal.fire('Error', this.extractErrorMessage(error, 'No se pudo actualizar el teléfono'), 'error');
    }
  }

  async savePassword() {
    if (!this.user?.id) return;
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      Swal.fire('Atención', 'Todos los campos de contraseña son requeridos', 'warning');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      Swal.fire('Atención', 'Las contraseñas nuevas no coinciden', 'warning');
      return;
    }
    try {
      await firstValueFrom(this.userService.updatePassword(this.user.id, {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword
      }));
      Swal.fire('Éxito', 'Contraseña actualizada correctamente', 'success');
      this.toggleEdit(null);
    } catch (error: any) {
      Swal.fire('Error', this.extractErrorMessage(error, 'No se pudo actualizar la contraseña. Verifica tu contraseña actual.'), 'error');
    }
  }

  async deactivateAccount() {
    if (!this.user?.id) return;
    
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Al desactivar tu cuenta, no podrás acceder a tus pedidos. Esta acción no es reversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await firstValueFrom(this.userService.changeStatus(this.user.id));
        Swal.fire('Desactivada', 'Tu cuenta ha sido desactivada.', 'success');
        this.authService.logout();
      } catch (error: any) {
        Swal.fire('Error', this.extractErrorMessage(error, 'No se pudo desactivar la cuenta'), 'error');
      }
    }
  }

  async onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (!file || !this.user?.id) return;

    this.isUploadingPhoto = true;

    try {
      await firstValueFrom(this.userService.updateProfile(this.user.id, {
        names: this.user.names,
        phoneNumber: this.user.phoneNumber,
        photoUrl: this.user.photoUrl
      }, file));
      
      Swal.fire({
        title: 'Éxito',
        text: 'Foto de perfil actualizada',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      await firstValueFrom(this.authService.loadCurrentUser()); // Refresh global signal
      if (this.user?.id) await this.fetchUserDetails(this.user.id);
    } catch (error: any) {
      Swal.fire('Error', this.extractErrorMessage(error, 'No se pudo subir la foto'), 'error');
    } finally {
      this.isUploadingPhoto = false;
      // Reset input value so the same file can be selected again
      event.target.value = '';
    }
  }
}
