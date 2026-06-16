import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComponentSharedNavbar } from '@components/shared/navbar/navbar';
import { ComponentCartOffcanvas } from '@components/cart/offcanvas/offcanvas';
import { ComponentSearch } from '@components/search/search';

@Component({
  selector: 'layout-landing',
  imports: [
    ComponentSharedNavbar,
    RouterOutlet,
    ComponentCartOffcanvas,
    ComponentSearch,
  ],
  templateUrl: './landing.html',
})
export class LayoutLanding {}
