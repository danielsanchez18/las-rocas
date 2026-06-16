import { Component } from '@angular/core';
import { ComponentHomeHero } from '@components/home/hero/hero';
import { ComponentHomeCategories } from '@components/home/categories/categories';
import { ComponentHomeProducts } from '@components/home/products/products';

@Component({
  selector: 'page-home',
  imports: [ComponentHomeHero, ComponentHomeCategories, ComponentHomeProducts],
  templateUrl: './home.html',
})
export class PageHome {}
