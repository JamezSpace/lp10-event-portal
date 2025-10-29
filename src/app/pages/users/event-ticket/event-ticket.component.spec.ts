import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTicketComponent } from './event-ticket.component';

describe('EventTicketComponent', () => {
  let component: EventTicketComponent;
  let fixture: ComponentFixture<EventTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventTicketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
