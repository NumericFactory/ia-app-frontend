import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiConfirmDialogComponent } from './ui-confirm-dialog.component';

describe('UiConfirmDialogComponent', () => {
  let component: UiConfirmDialogComponent;
  let fixture: ComponentFixture<UiConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiConfirmDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UiConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
