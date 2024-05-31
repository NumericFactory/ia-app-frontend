import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCategoryCardComponent } from './ui-category-card.component';

describe('UiCategoryCardComponent', () => {
  let component: UiCategoryCardComponent;
  let fixture: ComponentFixture<UiCategoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCategoryCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UiCategoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
