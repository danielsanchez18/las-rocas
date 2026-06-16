import { Component, inject, OnInit, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucidePlus, LucideX } from '@lucide/angular';
import { UserService } from '@core/service/users/user.service';
import { AuthService } from '@core/service/auth/auth.service';
import { UserResponse } from '@core/interfaces/users/user.interface';

@Component({
  selector: 'page-profile-address',
  imports: [CommonModule, FormsModule, LucidePlus, LucideX],
  templateUrl: './address.html',
})
export class PageProfileAddress implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  user: UserResponse | null = null;
  
  isModalOpen = false;
  editAddressValue: string = '';
  isSaving = false;

  constructor() {
    effect(() => {
      const authUser = this.authService.currentUser();
      if (authUser?.id && (!this.user || this.user.id !== authUser.id)) {
        this.userService.findById(authUser.id).subscribe(res => {
          if (res.success) {
            this.user = res.data;
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  ngOnInit() {}

  openModal() {
    this.editAddressValue = this.user?.address || '';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveAddress() {
    if (!this.user) return;
    this.isSaving = true;

    // The user's other fields must be preserved
    this.userService.updateProfile(this.user.id, {
      names: this.user.names,
      phoneNumber: this.user.phoneNumber,
      address: this.editAddressValue
    }).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.user = res.data;
          this.closeModal();
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }
}
