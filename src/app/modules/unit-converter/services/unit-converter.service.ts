import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APP_CONFIG } from '../../../config/app-config';
import { ApiFetcherService } from '../../../core/http/ApiFetcherService';
import { UnitConversionRequest } from '../contracts/UnitConversionRequest';
import { UnitConversionResult } from '../contracts/UnitConversionResult';
import { UnitConversionResultApiResource } from '../contracts/UnitConversionResultApiResource';
import { UnitConversionResultMapper } from '../mappers/UnitConversionResultMapper';

@Injectable({ providedIn: 'root' })
export class UnitConverterService {
  private cfg = inject(APP_CONFIG);

  constructor(private fetcher: ApiFetcherService) {}

  private readonly mapper = new UnitConversionResultMapper();

  convert(
    value: number,
    fromUnitId: number,
    toUnitId: number,
    nutrientId?: number | null,
  ): Observable<UnitConversionResult> {
    const url = `${this.cfg.appBackendUrl}/api/units/convert`;
    const payload: UnitConversionRequest = {
      value,
      from_unit_id: fromUnitId,
      to_unit_id: toUnitId,
      ...(nutrientId != null && { nutrient_id: nutrientId }),
    };
    return this.fetcher.postAndProcess<UnitConversionRequest, UnitConversionResultApiResource>(
      url, payload, '',
    ).pipe(map(body => this.mapper.toApp(body)));
  }
}
