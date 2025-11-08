import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRecurringEventDialogComponent } from './new-recurring-event-dialog.component';

describe('NewRecurringEventDialogComponent', () => {
  let component: NewRecurringEventDialogComponent;
  let fixture: ComponentFixture<NewRecurringEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRecurringEventDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRecurringEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
