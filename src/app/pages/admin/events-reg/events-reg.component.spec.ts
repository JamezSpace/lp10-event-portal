import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsRegComponent } from './events-reg.component';

describe('EventsRegComponent', () => {
  let component: EventsRegComponent;
  let fixture: ComponentFixture<EventsRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsRegComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
