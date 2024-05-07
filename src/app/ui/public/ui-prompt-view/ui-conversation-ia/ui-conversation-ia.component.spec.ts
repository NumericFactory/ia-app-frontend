import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiConversationIaComponent } from './ui-conversation-ia.component';

describe('UiConversationIaComponent', () => {
  let component: UiConversationIaComponent;
  let fixture: ComponentFixture<UiConversationIaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiConversationIaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UiConversationIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
