import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RememberPasswordComponent } from './remember-password.component';

describe('RememberPasswordComponent', () => {
  let component: RememberPasswordComponent;
  let fixture: ComponentFixture<RememberPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RememberPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RememberPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
