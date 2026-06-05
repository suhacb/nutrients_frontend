import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NutrientMappingReview } from '../../contracts/NutrientMappingReview';
import { NutrientMappingReviewResolvePayload } from '../../contracts/NutrientMappingReviewResolvePayload';
import { NutrientMappingReviewsStore } from '../../store/nutrient-mapping-reviews.store';

@Component({
  selector: 'app-mapping-reviews-list',
  standalone: false,
  templateUrl: './mapping-reviews-list.html',
  styleUrl: './mapping-reviews-list.scss',
})
export class MappingReviewsListPage implements OnInit {
  readonly displayedColumns = ['nutrient', 'suggestedCanonical', 'confidence', 'reasoning', 'actions'];
  readonly statuses = ['pending', 'approved', 'rejected'] as const;

  activeStatus: 'pending' | 'approved' | 'rejected' = 'pending';

  private readonly destroyRef = inject(DestroyRef);

  constructor(public store: NutrientMappingReviewsStore) {}

  ngOnInit(): void {
    this.store.load(this.activeStatus);
  }

  onStatusChange(status: 'pending' | 'approved' | 'rejected'): void {
    this.activeStatus = status;
    this.store.load(status);
  }

  onResolve(
    review: NutrientMappingReview,
    decision: NutrientMappingReviewResolvePayload['decision'],
  ): void {
    const canonicalId = review.suggestedCanonical?.id ?? null;
    this.store.resolve(review.id, decision, canonicalId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
