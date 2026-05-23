import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DietTagsStore } from './diet-tags.store';
import { ApiFetcherService } from '../../../core/http/ApiFetcherService';
import { APP_CONFIG } from '../../../config/app-config';
import { DietTagApiResource } from '../contracts/DietTagApiResource';

describe('DietTagsStore', () => {
  let store: DietTagsStore;
  let fetcherSpy: jasmine.SpyObj<ApiFetcherService>;

  const appConfig = { appBackendUrl: 'http://test-backend', appNameHeader: '', appBaseUrl: '', appName: '', appTitle: '' };

  const tagResource1: DietTagApiResource = {
    id: 1,
    name: 'Ketogenic',
    slug: 'ketogenic',
    description: 'High fat diet.',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const tagResource2: DietTagApiResource = {
    id: 2,
    name: 'Vegan',
    slug: 'vegan',
    description: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const paginatedResponse = {
    data: [tagResource1, tagResource2],
    current_page: 1,
    total: 2,
    per_page: 20,
    last_page: 1,
  };

  beforeEach(() => {
    fetcherSpy = jasmine.createSpyObj('ApiFetcherService', ['fetchAndProcess', 'postAndProcess', 'putAndProcess', 'deleteAndProcess']);

    TestBed.configureTestingModule({
      providers: [
        DietTagsStore,
        { provide: ApiFetcherService, useValue: fetcherSpy },
        { provide: APP_CONFIG, useValue: appConfig },
      ],
    });
    store = TestBed.inject(DietTagsStore);
  });

  // ---------------------------------------------------------------------------
  // Initial state
  // ---------------------------------------------------------------------------

  describe('initial state', () => {
    it('dietTags is an empty array', () => {
      expect(store.dietTags()).toEqual([]);
    });

    it('dietTag is null', () => {
      expect(store.dietTag()).toBeNull();
    });

    it('total is 0', () => {
      expect(store.total()).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // Setters
  // ---------------------------------------------------------------------------

  describe('setters', () => {
    it('setDietTags replaces the dietTags signal', () => {
      store.setDietTags([{ id: 1 } as any]);
      expect(store.dietTags().length).toBe(1);
    });

    it('setDietTag replaces the dietTag signal', () => {
      store.setDietTag({ id: 5 } as any);
      expect(store.dietTag()?.id).toBe(5);
    });
  });

  // ---------------------------------------------------------------------------
  // index
  // ---------------------------------------------------------------------------

  describe('index', () => {
    it('sets dietTags from the paginated response', (done) => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(paginatedResponse);
        return of(undefined);
      });

      store.index().subscribe(() => {
        expect(store.dietTags().length).toBe(2);
        expect(store.dietTags()[0].name).toBe('Ketogenic');
        done();
      });
    });

    it('sets total from the paginated response', (done) => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(paginatedResponse);
        return of(undefined);
      });

      store.index().subscribe(() => {
        expect(store.total()).toBe(2);
        done();
      });
    });

    it('does nothing when the response body is null', (done) => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(null);
        return of(undefined);
      });

      store.index().subscribe(() => {
        expect(store.dietTags()).toEqual([]);
        done();
      });
    });
  });

  // ---------------------------------------------------------------------------
  // create
  // ---------------------------------------------------------------------------

  describe('create', () => {
    it('emits the mapped diet tag', (done) => {
      fetcherSpy.postAndProcess.and.returnValue(of(tagResource1));

      store.create({ name: 'Ketogenic', description: 'High fat diet.' }).subscribe(tag => {
        expect(tag.id).toBe(1);
        expect(tag.name).toBe('Ketogenic');
        done();
      });
    });

    it('appends the new tag to dietTags', (done) => {
      store.setDietTags([{ id: 99 } as any]);
      fetcherSpy.postAndProcess.and.returnValue(of(tagResource1));

      store.create({ name: 'Ketogenic', description: null }).subscribe(() => {
        expect(store.dietTags().length).toBe(2);
        expect(store.dietTags()[1].id).toBe(1);
        done();
      });
    });

    it('calls postAndProcess with the correct URL', (done) => {
      fetcherSpy.postAndProcess.and.returnValue(of(tagResource1));

      store.create({ name: 'Ketogenic', description: null }).subscribe(() => {
        expect(fetcherSpy.postAndProcess.calls.mostRecent().args[0])
          .toBe('http://test-backend/api/diet-tags');
        done();
      });
    });
  });

  // ---------------------------------------------------------------------------
  // update
  // ---------------------------------------------------------------------------

  describe('update', () => {
    beforeEach(() => {
      store.setDietTags([
        { id: 1, name: 'Ketogenic', slug: 'ketogenic', description: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Vegan', slug: 'vegan', description: null, createdAt: new Date(), updatedAt: new Date() },
      ]);
    });

    it('emits the updated tag', (done) => {
      const updated = { ...tagResource1, name: 'Keto Updated' };
      fetcherSpy.putAndProcess.and.returnValue(of(updated));

      store.update(1, { name: 'Keto Updated', description: null }).subscribe(tag => {
        expect(tag.name).toBe('Keto Updated');
        done();
      });
    });

    it('replaces the matching entry in dietTags', (done) => {
      const updated = { ...tagResource1, name: 'Keto Updated' };
      fetcherSpy.putAndProcess.and.returnValue(of(updated));

      store.update(1, { name: 'Keto Updated', description: null }).subscribe(() => {
        expect(store.dietTags()[0].name).toBe('Keto Updated');
        expect(store.dietTags()[1].name).toBe('Vegan');
        done();
      });
    });

    it('leaves other entries unchanged', (done) => {
      fetcherSpy.putAndProcess.and.returnValue(of(tagResource1));

      store.update(1, { name: 'Ketogenic', description: null }).subscribe(() => {
        expect(store.dietTags().length).toBe(2);
        done();
      });
    });
  });

  // ---------------------------------------------------------------------------
  // delete
  // ---------------------------------------------------------------------------

  describe('delete', () => {
    beforeEach(() => {
      store.setDietTags([
        { id: 1, name: 'Ketogenic', slug: 'ketogenic', description: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Vegan', slug: 'vegan', description: null, createdAt: new Date(), updatedAt: new Date() },
      ]);
    });

    it('removes the tag with the given id from dietTags', (done) => {
      fetcherSpy.deleteAndProcess.and.returnValue(of(undefined));

      store.delete(1).subscribe(() => {
        expect(store.dietTags().length).toBe(1);
        expect(store.dietTags()[0].id).toBe(2);
        done();
      });
    });

    it('calls deleteAndProcess with the correct URL', (done) => {
      fetcherSpy.deleteAndProcess.and.returnValue(of(undefined));

      store.delete(1).subscribe(() => {
        expect(fetcherSpy.deleteAndProcess.calls.mostRecent().args[0])
          .toBe('http://test-backend/api/diet-tags/1');
        done();
      });
    });
  });
});
