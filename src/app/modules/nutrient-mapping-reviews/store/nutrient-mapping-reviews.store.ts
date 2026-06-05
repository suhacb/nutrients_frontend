import { Injectable, inject, signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { APP_CONFIG } from '../../../config/app-config';
import { ApiFetcherService } from '../../../core/http/ApiFetcherService';
import { NutrientMappingReview } from '../contracts/NutrientMappingReview';
import { NutrientMappingReviewApiResource } from '../contracts/NutrientMappingReviewApiResource';
import { NutrientMappingReviewResolvePayload } from '../contracts/NutrientMappingReviewResolvePayload';
import { NutrientMappingReviewMapper } from '../mappers/NutrientMappingReviewMapper';

interface ReviewListApiResponse {
  data?: NutrientMappingReviewApiResource[];
}

@Injectable({ providedIn: 'root' })
export class NutrientMappingReviewsStore {
  private cfg = inject(APP_CONFIG);

  constructor(private fetcher: ApiFetcherService) {}

  private readonly mapper = new NutrientMappingReviewMapper();

  readonly _reviews = signal<NutrientMappingReview[]>([]);
  readonly reviews = this._reviews.asReadonly();

  private loadSub?: Subscription;

  load(status: 'pending' | 'approved' | 'rejected' = 'pending'): void {
    this.loadSub?.unsubscribe();
    const url = `${this.cfg.appBackendUrl}/api/nutrient-mapping-reviews?status=${status}`;
    this.loadSub = this.fetcher.fetchAndProcess<ReviewListApiResponse>(url, '', body => {
      this._reviews.set((body?.data ?? []).map(r => this.mapper.toApp(r)));
    }).subscribe();
  }

  resolve(
    id: number,
    decision: NutrientMappingReviewResolvePayload['decision'],
    canonicalId?: number | null,
  ): Observable<null> {
    const url = `${this.cfg.appBackendUrl}/api/nutrient-mapping-reviews/${id}`;
    const payload: NutrientMappingReviewResolvePayload = {
      decision,
      ...(canonicalId != null && { canonical_id: canonicalId }),
    };
    return this.fetcher.patchAndProcess<NutrientMappingReviewResolvePayload, null>(
      url, payload, 'Review resolved.',
    ).pipe(
      tap(() => this._reviews.update(rs => rs.filter(r => r.id !== id))),
    );
  }
}
