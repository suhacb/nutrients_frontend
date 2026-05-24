import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { MappingReviewsListPage } from './mapping-reviews-list';
import { NutrientMappingReviewsStore } from '../../store/nutrient-mapping-reviews.store';
import { NutrientMappingReview } from '../../contracts/NutrientMappingReview';

function makeReview(overrides: Partial<NutrientMappingReview> = {}): NutrientMappingReview {
  return {
    id: 1,
    status: 'pending',
    confidence: 80,
    decisionType: 'merge',
    reasoning: 'High similarity.',
    resolvedAt: null,
    nutrient: { id: 10, name: 'Vitamin D' },
    suggestedCanonical: { id: 20, name: 'Vitamin D3' },
    ...overrides,
  };
}

describe('MappingReviewsListPage', () => {
  let fixture: ComponentFixture<MappingReviewsListPage>;
  let component: MappingReviewsListPage;
  let storeSpy: {
    reviews: jasmine.Spy;
    load: jasmine.Spy;
    resolve: jasmine.Spy;
  };

  beforeEach(() => {
    storeSpy = {
      reviews: jasmine.createSpy('reviews').and.returnValue([]),
      load: jasmine.createSpy('load'),
      resolve: jasmine.createSpy('resolve').and.returnValue(of(null)),
    };

    TestBed.configureTestingModule({
      declarations: [MappingReviewsListPage],
      providers: [
        { provide: NutrientMappingReviewsStore, useValue: storeSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(MappingReviewsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('calls store.load with pending status', () => {
      expect(storeSpy.load).toHaveBeenCalledOnceWith('pending');
    });
  });

  describe('onStatusChange', () => {
    it('calls store.load with the new status', () => {
      component.onStatusChange('approved');
      expect(storeSpy.load).toHaveBeenCalledWith('approved');
    });

    it('updates the activeStatus property', () => {
      component.onStatusChange('rejected');
      expect(component.activeStatus).toBe('rejected');
    });
  });

  describe('onResolve', () => {
    it('calls store.resolve with id and decision, passing null when no suggestedCanonical', () => {
      const review = makeReview({ id: 5, suggestedCanonical: null });
      component.onResolve(review, 'reject');
      expect(storeSpy.resolve).toHaveBeenCalledWith(5, 'reject', null);
    });

    it('passes the suggestedCanonical id as canonicalId when present', () => {
      const review = makeReview({ id: 3, suggestedCanonical: { id: 99, name: 'Canonical' } });
      component.onResolve(review, 'merge');
      expect(storeSpy.resolve).toHaveBeenCalledWith(3, 'merge', 99);
    });

    it('subscribes to the resolve observable', () => {
      const review = makeReview({ id: 7 });
      component.onResolve(review, 'reject');
      expect(storeSpy.resolve).toHaveBeenCalled();
    });
  });
});
