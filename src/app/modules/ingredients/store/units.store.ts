import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../../config/app-config';
import { ApiFetcherService } from '../../../core/http/ApiFetcherService';
import { Unit } from '../contracts/Unit';
import { UnitApiResource } from '../contracts/UnitApiResource';
import { UnitsMapper } from '../mappers/UnitsMapper';

interface UnitsPaginatedApiResponse {
  data: UnitApiResource[];
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
}

@Injectable({ providedIn: 'root' })
export class UnitsStore {
  private cfg = inject(APP_CONFIG);

  constructor(private fetcher: ApiFetcherService) {}

  private readonly mapper = new UnitsMapper();

  private _units = signal<Unit[]>([]);
  readonly units = this._units.asReadonly();

  index(): Observable<void> {
    const url = `${this.cfg.appBackendUrl}/api/units`;
    return this.fetcher.fetchAndProcess<UnitsPaginatedApiResponse>(url, '', body => {
      if (!body) return;
      this._units.set(body.data.map(u => this.mapper.toApp(u)));
    });
  }
}
