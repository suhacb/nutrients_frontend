import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchContainerItemComponent } from './search-container-item-component';

describe('SearchContainerItemComponent', () => {
  let component: SearchContainerItemComponent;
  let fixture: ComponentFixture<SearchContainerItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchContainerItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchContainerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
