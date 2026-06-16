import { Component, inject, OnInit, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideChevronDown } from '@lucide/angular';
import { ComponentOrderTable } from '@components/order/table/table';
import { ComponentSharedPaginator } from '@components/shared/paginator/paginator';
import { OrderService } from '@core/service/orders/order.service';
import { AuthService } from '@core/service/auth/auth.service';
import { OrderResponse } from '@core/interfaces/orders/order.interface';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'page-profile-orders',
  imports: [CommonModule, LucideChevronDown, ComponentOrderTable, ComponentSharedPaginator],
  templateUrl: './orders.html',
})
export class PageProfileOrders implements OnInit {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  orders: OrderResponse[] = [];
  
  // Pagination
  page = 0;
  size = 3;
  totalPages = 0;
  totalElements = 0;
  
  // Filters
  currentTab: 'all' | 'pending' | 'closed' = 'all';
  userId: string | undefined;

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user?.id && this.userId !== user.id) {
        this.userId = user.id;
        this.loadOrders(0);
      }
    });
  }

  ngOnInit() {}

  async loadOrders(page: number) {
    if (!this.userId) return;

    this.page = page;
    
    let statuses: string | undefined = undefined;
    
    if (this.currentTab === 'pending') {
      statuses = 'PENDING,ATTENDED,PREPARING,READY,DELIVERY_READY,OUT_FOR_DELIVERY';
    } else if (this.currentTab === 'closed') {
      statuses = 'DELIVERED,COMPLETED,CANCELLED';
    }

    try {
      const res = await firstValueFrom(this.orderService.getAll({
        userId: this.userId,
        status: statuses,
        page: this.page,
        size: this.size
      }));
      
      if (res.data) {
        this.orders = res.data.content;
        this.totalPages = res.data.totalPages;
        this.totalElements = res.data.totalElements;
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error loading orders', error);
    }
  }

  changeTab(tab: 'all' | 'pending' | 'closed') {
    this.currentTab = tab;
    this.loadOrders(0);
  }

  onPageChange(newPage: number) {
    this.loadOrders(newPage);
  }
}
