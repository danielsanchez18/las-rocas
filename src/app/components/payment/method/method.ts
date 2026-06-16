import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideBanknote,
  LucideCreditCard,
  LucideSmartphone,
  LucideBadgeInfo,
  LucideCopy,
  LucideUpload,
} from '@lucide/angular';

@Component({
  selector: 'component-payment-method',
  imports: [
    CommonModule,
    FormsModule,
    LucideBanknote,
    LucideCreditCard,
    LucideSmartphone,
    LucideBadgeInfo,
    LucideCopy,
    LucideUpload,
  ],
  templateUrl: './method.html',
})
export class ComponentPaymentMethod {
  @Input() totalAmount: number = 0;

  selectedMethod: 'CASH' | 'YAPE' | 'CARD' = 'CASH';

  // CASH fields
  exactAmount: 'si' | 'no' = 'si';
  cashGiven: number | null = null;

  // YAPE fields
  yapeFile: File | null = null;

  // CARD fields
  cardNumber: string = '';
  cardExpiry: string = '';
  cardCvv: string = '';
  cardName: string = '';

  selectMethod(method: 'CASH' | 'YAPE' | 'CARD') {
    if (this.selectedMethod !== method) {
      this.resetState();
      this.selectedMethod = method;
    }
  }

  private resetState() {
    this.exactAmount = 'si';
    this.cashGiven = null;
    this.yapeFile = null;
    this.cardNumber = '';
    this.cardExpiry = '';
    this.cardCvv = '';
    this.cardName = '';
  }

  onCardNumberInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 16) {
      value = value.substring(0, 16);
    }
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.substring(i, i + 4));
    }
    this.cardNumber = parts.join('-');
  }

  onCardExpiryInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 4) {
      value = value.substring(0, 4);
    }
    if (value.length > 2) {
      this.cardExpiry = value.substring(0, 2) + '/' + value.substring(2);
    } else {
      this.cardExpiry = value;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.yapeFile = file;
    }
  }

  get changeAmount(): number {
    if (this.exactAmount === 'si') return 0;
    if (this.cashGiven && this.cashGiven > this.totalAmount) {
      return this.cashGiven - this.totalAmount;
    }
    return 0;
  }

  get isValid(): boolean {
    if (this.selectedMethod === 'CASH') {
      if (this.exactAmount === 'no') {
        if (!this.cashGiven || this.cashGiven < this.totalAmount) {
          return false;
        }
      }
      return true;
    } else if (this.selectedMethod === 'YAPE') {
      return this.yapeFile !== null;
    } else if (this.selectedMethod === 'CARD') {
      return (
        this.cardNumber.replace(/\D/g, '').length === 16 &&
        this.cardExpiry.length === 5 &&
        this.cardCvv.length >= 3 &&
        this.cardName.trim().length > 0
      );
    }
    return false;
  }
}
