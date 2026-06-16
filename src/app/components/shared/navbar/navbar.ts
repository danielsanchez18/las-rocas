import { Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/service/auth/auth.service';
import { CartService } from '../../../core/service/cart/cart.service';
import { UserService } from '../../../core/service/users/user.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { UserResponse } from '../../../core/interfaces/users/user.interface';
import { NotificationService } from '../../../core/service/notifications/notification.service';
import { NotificationResponse } from '../../../core/interfaces/notifications/notification.interface';
import { ComponentSharedContact } from '../contact/contact';

@Component({
  selector: 'component-shared-navbar',
  imports: [RouterModule, CommonModule, ComponentSharedContact],
  templateUrl: './navbar.html',
})
export class ComponentSharedNavbar implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  private cartService = inject(CartService);
  private userService = inject(UserService);

  public cartCount: number = 0;
  private cartSub?: Subscription;

  public user: UserResponse | null = null;

  public notifications: NotificationResponse[] = [];
  public unreadCount: number = 0;
  private notificationService = inject(NotificationService);

  constructor() {
    effect(() => {
      const authUser = this.authService.currentUser();
      if (authUser?.id) {
        this.fetchUserDetails(authUser.id);
        this.fetchNotifications();
      } else {
        this.user = null;
        this.notifications = [];
        this.unreadCount = 0;
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

  async fetchNotifications() {
    try {
      const countRes = await firstValueFrom(this.notificationService.getUnreadCount());
      if (countRes.success) {
        this.unreadCount = countRes.data;
      }
      
      const notifRes = await firstValueFrom(this.notificationService.getUserNotifications(0, 10));
      if (notifRes.success) {
        this.notifications = notifRes.data.content;
      }
    } catch (error) {
      console.error('Error fetching notifications', error);
    }
  }

  async markAllAsRead() {
    try {
      await firstValueFrom(this.notificationService.markAllAsRead());
      this.unreadCount = 0;
      this.notifications.forEach(n => n.isRead = true);
    } catch (error) {
      console.error('Error marking all as read', error);
    }
  }

  async readNotification(notif: NotificationResponse) {
    if (!notif.isRead) {
      try {
        await firstValueFrom(this.notificationService.markAsRead(notif.id));
        notif.isRead = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      } catch (error) {
        console.error('Error marking as read', error);
      }
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
