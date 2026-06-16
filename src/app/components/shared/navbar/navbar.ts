import { Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/service/auth/auth.service';
import { CartService } from '../../../core/service/cart/cart.service';
import { UserService } from '../../../core/service/users/user.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { UserResponse } from '../../../core/interfaces/users/user.interface';

@Component({
  selector: 'component-shared-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
})
export class ComponentSharedNavbar implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  private cartService = inject(CartService);
  private userService = inject(UserService);

  public cartCount: number = 0;
  private cartSub?: Subscription;

  public user: UserResponse | null = null;

  constructor() {
    effect(() => {
      const authUser = this.authService.currentUser();
      if (authUser?.id) {
        this.fetchUserDetails(authUser.id);
      } else {
        this.user = null;
      }
    });
  }

  async fetchUserDetails(id: string) {
    try {
      const res = await firstValueFrom(this.userService.findById(id));
      if (res.data) {
        this.user = res.data;
      }
    } catch (error) {
      console.error('Error fetching user for navbar', error);
    }
  }

  ngOnInit() {
    this.cartSub = this.cartService.items$.subscribe((items) => {
      this.cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
    });
  }

  ngOnDestroy() {
    this.cartSub?.unsubscribe();
  }
}
