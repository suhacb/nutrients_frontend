import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NutrientMappingReviewsStore } from './nutrient-mapping-reviews.store';
import { ApiFetcherService } from '../../../core/http/ApiFetcherService';
import { APP_CONFIG } from '../../../config/app-config';
import { NutrientMappingReviewApiResource } from '../contracts/NutrientMappingReviewApiResource';

describe('NutrientMappingReviewsStore', () => {
  let store: NutrientMappingReviewsStore;
  let fetcherSpy: jasmine.SpyObj<ApiFetcherService>;

  const appConfig = { appBackendUrl: 'http://test-backend', appNameHeader: '', appBaseUrl: '', appName: '', appTitle: '' };

  const reviewResource: NutrientMappingReviewApiResource = {
    id: 1,
    status: 'pending',
    confidence: 75,
    decision_type: 'merge',
    reasoning: 'Similar compounds.',
    resolved_at: null,
    source_nutrient: { id: 10, name: 'Vitamin D' },
    suggested_canonical: { id: 20, name: 'Vitamin D3' },
  };

  const listResponse = { data: [reviewResource] };

  beforeEach(() => {
    fetcherSpy = jasmine.createSpyObj('ApiFetcherService', ['fetchAndProcess', 'patchAndProcess']);

    TestBed.configureTestingModule({
      providers: [
        NutrientMappingReviewsStore,
        { provide: ApiFetcherService, useValue: fetcherSpy },
        { provide: APP_CONFIG, useValue: appConfig },
      ],
    });
    store = TestBed.inject(NutrientMappingReviewsStore);
  });

  // ---------------------------------------------------------------------------
  // Initial state
  // ---------------------------------------------------------------------------

  describe('initial state', () => {
    it('reviews is an empty array', () => {
      expect(store.reviews()).toEqual([]);
    });
  });

  // ---------------------------------------------------------------------------
  // load
  // ---------------------------------------------------------------------------

  describe('load', () => {
    it('sets reviews after the fetch callback is invoked', () => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(listResponse);
        return of(undefined);
      });

      store.load();

      expect(store.reviews().length).toBe(1);
      expect(store.reviews()[0].id).toBe(1);
      expect(store.reviews()[0].nutrient?.name).toBe('Vitamin D');
    });

    it('defaults to status=pending in the URL', () => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(listResponse);
        return of(undefined);
      });

      store.load();

      const url = fetcherSpy.fetchAndProcess.calls.mostRecent().args[0];
      expect(url).toContain('status=pending');
    });

    it('uses the provided status in the URL', () => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process({ data: [] });
        return of(undefined);
      });

      store.load('approved');

      const url = fetcherSpy.fetchAndProcess.calls.mostRecent().args[0];
      expect(url).toContain('status=approved');
    });

    it('sets reviews to empty array when data is absent', () => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process({});
        return of(undefined);
      });

      store.load();

      expect(store.reviews()).toEqual([]);
    });
  });

  // ---------------------------------------------------------------------------
  // resolve
  // ---------------------------------------------------------------------------

  describe('resolve', () => {
    beforeEach(() => {
      store['_reviews'].set([
        { id: 1, status: 'pending', confidence: 75, decisionType: 'merge', reasoning: null, resolvedAt: null, nutrient: null, suggestedCanonical: null },
        { id: 2, status: 'pending', confidence: 60, decisionType: 'keep', reasoning: null, resolvedAt: null, nutrient: null, suggestedCanonical: null },
      ]);
    });

    it('calls patchAndProcess with the correct URL and payload', (done) => {
      fetcherSpy.patchAndProcess.and.returnValue(of(null));

      store.resolve(1, 'reject').subscribe(() => {
        const [url, payload, msg] = fetcherSpy.patchAndProcess.calls.mostRecent().args;
        expect(url).toBe('http://test-backend/api/nutrient-mapping-reviews/1');
        expect(payload).toEqual({ decision: 'reject' });
        expect(msg).toBe('Review resolved.');
        done();
      });
    });

    it('includes canonical_id in the payload when provided', (done) => {
      fetcherSpy.patchAndProcess.and.returnValue(of(null));

      store.resolve(1, 'merge', 42).subscribe(() => {
        const payload = fetcherSpy.patchAndProcess.calls.mostRecent().args[1];
        expect(payload).toEqual({ decision: 'merge', canonical_id: 42 });
        done();
      });
    });

    it('removes the resolved review from the list', (done) => {
      fetcherSpy.patchAndProcess.and.returnValue(of(null));

      store.resolve(1, 'reject').subscribe(() => {
        expect(store.reviews().length).toBe(1);
        expect(store.reviews()[0].id).toBe(2);
        done();
      });
    });
  });
});
