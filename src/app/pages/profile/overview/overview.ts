import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  LucideCreditCard,
  LucideFileText,
  LucideGift,
  LucideLogOut,
  LucideMapPin,
  LucideShoppingBag,
  LucideUser,
} from '@lucide/angular';

@Component({
  selector: 'page-profile-overview',
  imports: [
    RouterModule,
    LucideUser,
    LucideShoppingBag,
    LucideMapPin,
    LucideCreditCard,
    LucideGift,
    LucideLogOut,
  ],
  templateUrl: './overview.html',
})
export class PageProfileOverview {}
