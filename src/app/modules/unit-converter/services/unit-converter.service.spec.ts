import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UnitConverterService } from './unit-converter.service';
import { ApiFetcherService } from '../../../core/http/ApiFetcherService';
import { APP_CONFIG } from '../../../config/app-config';

describe('UnitConverterService', () => {
  let service: UnitConverterService;
  let fetcherSpy: jasmine.SpyObj<ApiFetcherService>;

  const appConfig = { appBackendUrl: 'http://test-backend', appNameHeader: '', appBaseUrl: '', appName: '', appTitle: '' };

  const apiResponse = {
    value: 3.5274,
    from_unit: {
      id: 1, name: 'Gram', abbreviation: 'g', type: 'mass',
      to_base_factor: 1, base_unit_id: null,
      created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    },
    to_unit: {
      id: 2, name: 'Ounce', abbreviation: 'oz', type: 'mass',
      to_base_factor: 28.3495, base_unit_id: 1,
      created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    },
    nutrient_id: null,
  };

  beforeEach(() => {
    fetcherSpy = jasmine.createSpyObj('ApiFetcherService', ['postAndProcess']);
    fetcherSpy.postAndProcess.and.returnValue(of(apiResponse));

    TestBed.configureTestingModule({
      providers: [
        UnitConverterService,
        { provide: ApiFetcherService, useValue: fetcherSpy },
        { provide: APP_CONFIG, useValue: appConfig },
      ],
    });
    service = TestBed.inject(UnitConverterService);
  });

  it('calls postAndProcess with the correct URL', (done) => {
    service.convert(100, 1, 2).subscribe(() => {
      const url = fetcherSpy.postAndProcess.calls.mostRecent().args[0];
      expect(url).toBe('http://test-backend/api/units/convert');
      done();
    });
  });

  it('sends value, from_unit_id and to_unit_id in the payload', (done) => {
    service.convert(100, 1, 2).subscribe(() => {
      const payload = fetcherSpy.postAndProcess.calls.mostRecent().args[1];
      expect(payload).toEqual(jasmine.objectContaining({ value: 100, from_unit_id: 1, to_unit_id: 2 }));
      done();
    });
  });

  it('includes nutrient_id in the payload when provided', (done) => {
    service.convert(100, 1, 2, 5).subscribe(() => {
      const payload = fetcherSpy.postAndProcess.calls.mostRecent().args[1];
      expect(payload).toEqual(jasmine.objectContaining({ nutrient_id: 5 }));
      done();
    });
  });

  it('returns a mapped UnitConversionResult', (done) => {
    service.convert(100, 1, 2).subscribe(result => {
      expect(result.value).toBe(3.5274);
      expect(result.fromUnit.abbreviation).toBe('g');
      expect(result.toUnit.abbreviation).toBe('oz');
      expect(result.nutrientId).toBeNull();
      done();
    });
  });
});
