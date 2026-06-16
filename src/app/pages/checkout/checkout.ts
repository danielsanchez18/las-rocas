import { Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideShoppingBag,
} from '@lucide/angular';
import { ComponentCheckoutInfo } from '@components/checkout/info/info';
import { ComponentCheckoutSummary } from '@components/checkout/summary/summary';
import { ComponentCheckoutProducts } from '@components/checkout/products/products';

@Component({
  selector: 'page-checkout',
  imports: [
    LucideChevronRight,
    LucideChevronLeft,
    LucideShoppingBag,
    ComponentCheckoutInfo,
    ComponentCheckoutSummary,
    ComponentCheckoutProducts,
  ],
  templateUrl: './checkout.html',
})
export class PageCheckout {
  @ViewChild(ComponentCheckoutInfo) infoComponent!: ComponentCheckoutInfo;

  private router = inject(Router);

  async onContinue() {
    // 1. Process and save user info if checkbox was checked
    if (this.infoComponent) {
      await this.infoComponent.processSaveInformation();

      // Save checkout data for payment page
      const checkoutData = {
        names: this.infoComponent.userInfo.names,
        email: this.infoComponent.userInfo.email,
        phoneNumber: this.infoComponent.userInfo.phoneNumber,
        address: this.infoComponent.userInfo.address,
        deliveryMethod: this.infoComponent.deliveryMethod,
      };
      sessionStorage.setItem('checkout_data', JSON.stringify(checkoutData));
    }

    // 3. Navigate to payment page
    this.router.navigate(['/pago']);
  }
}
