import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentCartProducts } from '@components/cart/products/products';
import { ComponentCartSummary } from '@components/cart/summary/summary';

@Component({
  selector: 'page-landing-cart',
  imports: [CommonModule, ComponentCartProducts, ComponentCartSummary],
  templateUrl: './cart.html',
})
export class PageLandingCart {}
