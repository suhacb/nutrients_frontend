import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { APP_CONFIG } from '../../../config/app-config';
import { ApiFetcherService } from '../../../core/http/ApiFetcherService';
import { DietTag } from '../contracts/DietTag';
import { DietTagApiPayload } from '../contracts/DietTagApiPayload';
import { DietTagApiResource } from '../contracts/DietTagApiResource';
import { DietTagsMapper } from '../mappers/DietTagsMapper';

interface DietTagPaginatedApiResponse {
  data: DietTagApiResource[];
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
}

@Injectable({ providedIn: 'root' })
export class DietTagsStore {
  private cfg = inject(APP_CONFIG);

  constructor(private fetcher: ApiFetcherService) {}

  private readonly mapper = new DietTagsMapper();

  private _dietTags = signal<DietTag[]>([]);
  private _dietTag  = signal<DietTag | null>(null);
  private _total    = signal<number>(0);

  readonly dietTags = this._dietTags.asReadonly();
  readonly dietTag  = this._dietTag.asReadonly();
  readonly total    = this._total.asReadonly();

  setDietTags(tags: DietTag[]): void { this._dietTags.set(tags); }
  setDietTag(tag: DietTag | null): void { this._dietTag.set(tag); }

  index(): Observable<void> {
    const url = `${this.cfg.appBackendUrl}/api/diet-tags`;
    return this.fetcher.fetchAndProcess<DietTagPaginatedApiResponse>(url, '', body => {
      if (!body) return;
      this._dietTags.set(body.data.map(t => this.mapper.toApp(t)));
      this._total.set(body.total);
    });
  }

  create(payload: DietTagApiPayload): Observable<DietTag> {
    const url = `${this.cfg.appBackendUrl}/api/diet-tags`;
    return this.fetcher.postAndProcess<DietTagApiPayload, DietTagApiResource>(
      url, payload, 'Diet tag created.',
    ).pipe(
      map(body => this.mapper.toApp(body)),
      tap(tag => this._dietTags.update(tags => [...tags, tag])),
    );
  }

  update(id: number, payload: DietTagApiPayload): Observable<DietTag> {
    const url = `${this.cfg.appBackendUrl}/api/diet-tags/${id}`;
    return this.fetcher.putAndProcess<DietTagApiPayload, DietTagApiResource>(
      url, payload, 'Diet tag updated.',
    ).pipe(
      map(body => this.mapper.toApp(body)),
      tap(tag => this._dietTags.update(tags => tags.map(t => t.id === id ? tag : t))),
    );
  }

  delete(id: number): Observable<void> {
    const url = `${this.cfg.appBackendUrl}/api/diet-tags/${id}`;
    return this.fetcher.deleteAndProcess(url, 'Diet tag deleted.').pipe(
      tap(() => this._dietTags.update(tags => tags.filter(t => t.id !== id))),
    );
  }
}
