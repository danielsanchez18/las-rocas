import { Component, inject, OnInit, effect } from '@angular/core';
import { LucideShoppingBag, LucideStore } from '@lucide/angular';
import { AuthService } from '@core/service/auth/auth.service';
import { UserService } from '@core/service/users/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'component-checkout-info',
  imports: [LucideShoppingBag, LucideStore, CommonModule, FormsModule],
  templateUrl: './info.html',
})
export class ComponentCheckoutInfo implements OnInit {
  public authService = inject(AuthService);
  private userService = inject(UserService);

  userInfo: any = {
    names: '',
    email: '',
    phoneNumber: '',
    address: ''
  };

  deliveryMethod: 'delivery' | 'pickup' = 'delivery';
  saveInformation = false;
  
  isLoggedIn = false;
  userId: string | null = null;

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user?.id) {
        this.isLoggedIn = true;
        this.userId = user.id;
        this.userService.findById(user.id).subscribe({
          next: (res) => {
            if (res.data) {
              this.userInfo.names = res.data.names;
              this.userInfo.email = res.data.email;
              this.userInfo.phoneNumber = res.data.phoneNumber || '';
              // If the backend has an address field in UserResponse, we can populate it:
              this.userInfo.address = (res.data as any).address || '';
            }
          },
          error: (err) => {
            console.error('Error fetching user info:', err);
          }
        });
      } else {
        this.isLoggedIn = false;
        this.userId = null;
        this.userInfo = { names: '', email: '', phoneNumber: '', address: '' };
      }
    });
  }

  ngOnInit() {}

  setDeliveryMethod(method: 'delivery' | 'pickup') {
    this.deliveryMethod = method;
  }

  // Se llamará desde el componente padre (checkout) al procesar la orden
  public async processSaveInformation(): Promise<void> {
    if (this.isLoggedIn && this.userId && this.saveInformation) {
      const request = {
        names: this.userInfo.names,
        phoneNumber: this.userInfo.phoneNumber,
        address: this.userInfo.address,
      };
      
      try {
        await this.userService.updateProfile(this.userId, request).toPromise();
        console.log('User information updated successfully.');
      } catch (error) {
        console.error('Failed to update user info:', error);
      }
    }
  }
}
