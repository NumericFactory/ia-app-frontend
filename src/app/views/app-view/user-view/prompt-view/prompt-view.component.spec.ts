import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptViewComponent } from './prompt-view.component';

describe('PromptViewComponent', () => {
  let component: PromptViewComponent;
  let fixture: ComponentFixture<PromptViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromptViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
