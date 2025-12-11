import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsItemComponent } from './search-results-item-component';

describe('SearchResultsItemComponent', () => {
  let component: SearchResultsItemComponent;
  let fixture: ComponentFixture<SearchResultsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchResultsItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchResultsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
