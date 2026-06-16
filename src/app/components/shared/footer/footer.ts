import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/service/auth/auth.service';
import { ComplaintService } from '@core/service/complaint/complaint.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-shared-footer',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './footer.html',
})
export class ComponentSharedFooter {
  public authService = inject(AuthService);
  private complaintService = inject(ComplaintService);

  complaint = {
    name: '',
    email: '',
    type: 'RECLAMO',
    message: '',
  };

  submitComplaint() {
    if (!this.authService.isAuthenticated()) {
      Swal.fire(
        'Atención',
        'Debe iniciar sesión para registrar un reclamo',
        'warning',
      );
      return;
    }

    if (
      !this.complaint.name ||
      !this.complaint.email ||
      !this.complaint.message
    ) {
      Swal.fire(
        'Error',
        'Por favor, complete todos los campos requeridos',
        'error',
      );
      return;
    }

    this.complaintService.createComplaint(this.complaint).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Recibido!',
          text: 'Su reclamo/queja ha sido registrado exitosamente. Nos comunicaremos con usted pronto.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.complaint = {
            name: '',
            email: '',
            type: 'RECLAMO',
            message: '',
          };
          const closeBtn = document.querySelector(
            '#hs-complaints-modal .hs-dropdown-toggle',
          ) as HTMLElement;
          if (closeBtn) closeBtn.click();
        });
      },
      error: () => {
        Swal.fire(
          'Error',
          'No se pudo registrar su reclamo. Intente nuevamente.',
          'error',
        );
      },
    });
  }
}
