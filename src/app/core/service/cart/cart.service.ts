import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface CartItem {
  productId?: string;
  promotionId?: string;
  quantity: number;
  product?: any;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  items$ = this.itemsSubject.asObservable();

  private loadCart(): CartItem[] {
    const saved = localStorage.getItem('shopping_cart');
    return saved ? JSON.parse(saved) : [];
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem('shopping_cart', JSON.stringify(items));
    this.itemsSubject.next(items);
  }

  getCart() {
    return of({ data: { items: this.itemsSubject.value } });
  }

  addItem(request: any, productInfo?: any): Observable<any> {
    const items = this.loadCart();
    // Check by productId or promotionId
    const existing = items.find(i => 
      (request.productId && i.productId === request.productId) || 
      (request.promotionId && i.promotionId === request.promotionId)
    );
    if (existing) {
      existing.quantity += request.quantity;
    } else {
      items.push({
        productId: request.productId,
        promotionId: request.promotionId,
        quantity: request.quantity,
        product: productInfo
      });
    }
    this.saveCart(items);
    return of({ success: true });
  }

  updateItem(itemId: string, quantity: number): Observable<any> {
    const items = this.loadCart();
    const existing = items.find(i => i.productId === itemId || i.promotionId === itemId);
    if (existing) {
      existing.quantity = quantity;
      this.saveCart(items);
    }
    return of({ success: true });
  }

  removeItem(itemId: string): Observable<any> {
    let items = this.loadCart();
    items = items.filter(i => i.productId !== itemId && i.promotionId !== itemId);
    this.saveCart(items);
    return of({ success: true });
  }

  clearCart(): Observable<any> {
    this.saveCart([]);
    return of({ success: true });
  }

  syncCart(items: any[]): Observable<any> {
    return of({ success: true });
  }
}
