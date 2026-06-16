import { Component } from '@angular/core';
import { ComponentMenuProducts } from '@components/menu/products/products';
import { ComponentSharedSortBy } from '@components/shared/sort-by/sort-by';
import { ComponentSharedFilters } from '@components/shared/filters/filters';
import { ComponentMenuCategories } from '@components/menu/categories/categories';

@Component({
  selector: 'page-menu',
  imports: [
    ComponentMenuCategories,
    ComponentMenuProducts,
    ComponentSharedSortBy,
    ComponentSharedFilters,
  ],
  templateUrl: './menu.html',
})
export class PageMenu {}
