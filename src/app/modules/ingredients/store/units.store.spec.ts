import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UnitsStore } from './units.store';
import { ApiFetcherService } from '../../../core/http/ApiFetcherService';
import { APP_CONFIG } from '../../../config/app-config';
import { UnitApiResource } from '../contracts/UnitApiResource';

describe('UnitsStore', () => {
  let store: UnitsStore;
  let fetcherSpy: jasmine.SpyObj<ApiFetcherService>;

  const appConfig = { appBackendUrl: 'http://test-backend', appNameHeader: '', appBaseUrl: '', appName: '', appTitle: '' };

  const unitResource1: UnitApiResource = {
    id: 1,
    name: 'Gram',
    abbreviation: 'g',
    type: 'mass',
    to_base_factor: 0.001,
    base_unit_id: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const unitResource2: UnitApiResource = {
    id: 2,
    name: 'Kilogram',
    abbreviation: 'kg',
    type: 'mass',
    to_base_factor: 1,
    base_unit_id: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const paginatedResponse = {
    data: [unitResource1, unitResource2],
    current_page: 1,
    total: 2,
    per_page: 50,
    last_page: 1,
  };

  beforeEach(() => {
    fetcherSpy = jasmine.createSpyObj('ApiFetcherService', ['fetchAndProcess']);

    TestBed.configureTestingModule({
      providers: [
        UnitsStore,
        { provide: ApiFetcherService, useValue: fetcherSpy },
        { provide: APP_CONFIG, useValue: appConfig },
      ],
    });
    store = TestBed.inject(UnitsStore);
  });

  describe('initial state', () => {
    it('units is an empty array', () => {
      expect(store.units()).toEqual([]);
    });
  });

  describe('index', () => {
    it('sets units from the paginated response', (done) => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(paginatedResponse);
        return of(undefined);
      });

      store.index().subscribe(() => {
        expect(store.units().length).toBe(2);
        expect(store.units()[0].name).toBe('Gram');
        expect(store.units()[1].name).toBe('Kilogram');
        done();
      });
    });

    it('does nothing when the response body is null', (done) => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(null);
        return of(undefined);
      });

      store.index().subscribe(() => {
        expect(store.units()).toEqual([]);
        done();
      });
    });

    it('calls fetchAndProcess with the correct URL', (done) => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(paginatedResponse);
        return of(undefined);
      });

      store.index().subscribe(() => {
        expect(fetcherSpy.fetchAndProcess.calls.mostRecent().args[0])
          .toBe('http://test-backend/api/units');
        done();
      });
    });
  });
});
