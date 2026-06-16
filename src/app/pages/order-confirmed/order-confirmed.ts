import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ComponentCheckoutProducts } from '@components/checkout/products/products';
import { ComponentOrderConfirmedSummary } from '@components/order/confirmed/summary/summary';
import { ComponentOrderConfirmedResumen } from '@components/order/confirmed/resumen/resumen';
import { OrderService } from '@core/service/orders/order.service';
import { OrderResponse } from '@core/interfaces/orders/order.interface';
import { AuthService } from '@core/service/auth/auth.service';
import { UserService } from '@core/service/users/user.service';
import { UserResponse } from '@core/interfaces/users/user.interface';
import { Subscription } from 'rxjs';
import confetti from 'canvas-confetti';

@Component({
  selector: 'page-order-confirmed',
  imports: [
    CommonModule,
    ComponentCheckoutProducts,
    ComponentOrderConfirmedSummary,
    ComponentOrderConfirmedResumen,
  ],
  templateUrl: './order-confirmed.html',
})
export class PageOrderConfirmed implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  
  private routeSub?: Subscription;
  order: OrderResponse | null = null;
  user: UserResponse | null = null;
  isLoading = true;
  error = false;

  ngOnInit() {
    this.routeSub = this.route.queryParams.subscribe(params => {
      const orderId = params['orderId'];
      if (orderId) {
        this.fetchOrder(orderId);
      } else {
        this.isLoading = false;
        this.error = true;
      }
    });
    this.fetchUser();
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }

  fetchOrder(orderId: string) {
    this.orderService.getById(orderId).subscribe({
      next: (res) => {
        this.order = res.data;
        this.isLoading = false;
        this.fireConfetti();
      },
      error: (err) => {
        console.error('Error fetching order', err);
        this.isLoading = false;
        this.error = true;
      }
    });
  }

  fetchUser() {
    const currentUser = this.authService.currentUser();
    if (currentUser?.id) {
      this.userService.findById(currentUser.id).subscribe({
        next: (res) => {
          this.user = res.data;
        },
        error: (err) => console.error('Error fetching user', err)
      });
    }
  }

  fireConfetti() {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    var interval: any = setInterval(function() {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
    }, 250);
  }
}
