import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyRegistrationDialogComponent } from './verify-registration-dialog.component';

describe('VerifyRegistrationDialogComponent', () => {
  let component: VerifyRegistrationDialogComponent;
  let fixture: ComponentFixture<VerifyRegistrationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyRegistrationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyRegistrationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
