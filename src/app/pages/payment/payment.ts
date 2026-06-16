import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentCheckoutSummary } from '@components/checkout/summary/summary';
import { ComponentCheckoutProducts } from '@components/checkout/products/products';
import { ComponentPaymentMethod } from '@components/payment/method/method';
import { ComponentPaymentReview } from '@components/payment/review/review';
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideShoppingBag,
} from '@lucide/angular';
import { OrderService } from '@core/service/orders/order.service';
import { CartService } from '@core/service/cart/cart.service';
import { AuthService } from '@core/service/auth/auth.service';
import { firstValueFrom, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { OrderRequest } from '@core/interfaces/orders/order.interface';

@Component({
  selector: 'page-payment',
  imports: [
    ComponentCheckoutSummary,
    ComponentCheckoutProducts,
    ComponentPaymentMethod,
    ComponentPaymentReview,
    LucideChevronLeft,
    LucideChevronRight,
    LucideShoppingBag,
  ],
  templateUrl: './payment.html',
})
export class PagePayment implements OnInit {
  private router = inject(Router);
  private orderService = inject(OrderService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  @ViewChild(ComponentPaymentMethod) methodComponent!: ComponentPaymentMethod;

  isLoading = false;
  checkoutData: any = null;
  totalAmount: number = 0;
  private cartSub?: Subscription;

  ngOnInit() {
    // 1. Get checkout data
    const dataStr = sessionStorage.getItem('checkout_data');
    if (!dataStr) {
      // If no data, go back to checkout
      this.router.navigate(['/checkout']);
      return;
    }
    this.checkoutData = JSON.parse(dataStr);

    // 2. Calculate total to pass to method component
    this.cartSub = this.cartService.items$.subscribe(items => {
      const subtotal = items.reduce((acc, item) => {
        const price = item.product?.finalPrice || item.product?.basePrice || 0;
        return acc + price * item.quantity;
      }, 0);
      const deliveryCost = this.checkoutData.deliveryMethod === 'delivery' ? 3 : 0;
      this.totalAmount = subtotal + deliveryCost;
    });
  }

  ngOnDestroy() {
    this.cartSub?.unsubscribe();
  }

  async onConfirm() {
    // Verify form
    if (this.methodComponent && !this.methodComponent.isValid) {
      Swal.fire('Atención', 'Por favor, completa correctamente los datos del método de pago.', 'warning');
      return;
    }

    this.isLoading = true;

    try {
      const cartItems = await firstValueFrom(this.cartService.items$);
      if (!cartItems || cartItems.length === 0) {
        Swal.fire('Error', 'Tu carrito está vacío.', 'error');
        this.isLoading = false;
        return;
      }

      const currentUser = this.authService.currentUser();
      
      // Siempre mandaremos CASH según requerimiento para el backend
      const paymentMethod = 'CASH'; 
      // Si la UI requiere el real: const realPaymentMethod = this.methodComponent ? this.methodComponent.selectedMethod : 'YAPE';

      const orderType = this.checkoutData?.deliveryMethod === 'pickup' ? 'PICKUP' : 'DELIVERY';

      const orderRequest: OrderRequest = {
        userId: currentUser?.id,
        orderType: orderType,
        paymentMethod: paymentMethod,
        deliveryAddress: this.checkoutData?.address,
        items: cartItems.map(item => ({
          productId: item.productId,
          promotionId: item.promotionId,
          quantity: item.quantity,
        }))
      };

      const res = await firstValueFrom(this.orderService.create(orderRequest));
      
      if (res.data) {
        // Clear cart and checkout data
        this.cartService.clearCart();
        sessionStorage.removeItem('checkout_data');
        
        // Navigate
        this.router.navigate(['/pedido-confirmado'], { queryParams: { orderId: res.data.id } });
      }
    } catch (error) {
      console.error('Error creating order:', error);
      Swal.fire('Error', 'No se pudo crear el pedido.', 'error');
    } finally {
      this.isLoading = false;
    }
  }
}
