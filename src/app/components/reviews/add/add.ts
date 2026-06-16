import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideStar, LucideX } from '@lucide/angular';
import { OrderResponse } from '@core/interfaces/orders/order.interface';
import { ReviewResponse } from '@core/interfaces/reviews/review.interface';
import { ReviewService } from '@core/service/reviews/review.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-reviews-add',
  imports: [CommonModule, FormsModule, LucideStar, LucideX],
  templateUrl: './add.html',
})
export class ComponentReviewsAdd {
  @Input() order!: OrderResponse;
  @Input() review: ReviewResponse | null = null;
  @Output() reviewAdded = new EventEmitter<ReviewResponse>();

  private reviewService = inject(ReviewService);

  rating: number = 0;
  comment: string = '';
  isSubmitting = false;

  setRating(stars: number) {
    if (this.review) return; // Read-only if review already exists
    this.rating = stars;
  }

  closeModal() {
    // Note: HSOverlay should handle closing with data-hs-overlay
    if (!this.review) {
      this.rating = 0;
      this.comment = '';
    }
  }

  submitReview() {
    if (!this.order) return;
    if (this.rating === 0) {
      Swal.fire('Atención', 'Debes seleccionar una calificación en estrellas', 'warning');
      return;
    }

    this.isSubmitting = true;
    this.reviewService.create({
      orderId: this.order.id,
      rating: this.rating,
      comment: this.comment
    }).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success) {
          Swal.fire('¡Éxito!', 'Gracias por tu reseña', 'success');
          this.reviewAdded.emit(res.data);
          // Auto close could be done via DOM click on the close button or HSOverlay programmatic close
          document.getElementById('close-review-modal')?.click();
        } else {
          Swal.fire('Error', res.message, 'error');
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        const msg = err.error?.message || 'Error al enviar la reseña';
        Swal.fire('Error', msg, 'error');
      }
    });
  }
}
