import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucidePhone,
  LucideStore,
  LucideShoppingBag,
  LucideUser,
} from '@lucide/angular';

@Component({
  selector: 'component-payment-review',
  imports: [CommonModule, LucideUser, LucidePhone, LucideStore, LucideShoppingBag],
  templateUrl: './review.html',
})
export class ComponentPaymentReview {
  @Input() checkoutData: any = null;
}
