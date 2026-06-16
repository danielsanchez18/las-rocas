import { Component, inject, OnInit, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideChevronLeft } from '@lucide/angular';
import { ComponentOrderDetails } from '@components/order/details/details';
import { ComponentReviewsAdd } from '@components/reviews/add/add';
import { OrderService } from '@core/service/orders/order.service';
import { OrderResponse } from '@core/interfaces/orders/order.interface';
import { AuthService } from '@core/service/auth/auth.service';
import { UserService } from '@core/service/users/user.service';
import { UserResponse } from '@core/interfaces/users/user.interface';
import { ReviewService } from '@core/service/reviews/review.service';
import { ReviewResponse } from '@core/interfaces/reviews/review.interface';

@Component({
  selector: 'page-profile-order-details',
  imports: [
    CommonModule,
    RouterLink,
    LucideChevronLeft,
    ComponentOrderDetails,
    ComponentReviewsAdd,
  ],
  templateUrl: './order-details.html',
})
export class PageProfileOrderDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private reviewService = inject(ReviewService);
  private cdr = inject(ChangeDetectorRef);

  order: OrderResponse | null = null;
  user: UserResponse | null = null;
  review: ReviewResponse | null = null;

  constructor() {
    effect(() => {
      const currentUser = this.authService.currentUser();
      if (currentUser?.id && (!this.user || this.user.id !== currentUser.id)) {
        this.userService.findById(currentUser.id).subscribe(res => {
          if (res.success) {
            this.user = res.data;
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idOrder = params.get('idOrder');
      if (idOrder) {
        this.loadOrder(idOrder);
      }
    });
  }

  loadOrder(id: string) {
    this.orderService.getById(id).subscribe(res => {
      if (res.success) {
        this.order = res.data;
        if (this.order?.status === 'COMPLETED') {
          this.loadReview(id);
        } else {
          this.cdr.detectChanges();
        }
      }
    });
  }

  loadReview(orderId: string) {
    this.reviewService.getByOrderId(orderId).subscribe({
      next: (res) => {
        if (res.success) {
          this.review = res.data;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        // Assume 404 Not Found if no review exists
        this.review = null;
        this.cdr.detectChanges();
      }
    });
  }

  onReviewAdded(review: ReviewResponse) {
    this.review = review;
    this.cdr.detectChanges();
  }
}
