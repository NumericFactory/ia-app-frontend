import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsAdminViewComponent } from './settings-admin-view.component';

describe('SettingsAdminViewComponent', () => {
  let component: SettingsAdminViewComponent;
  let fixture: ComponentFixture<SettingsAdminViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsAdminViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingsAdminViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
