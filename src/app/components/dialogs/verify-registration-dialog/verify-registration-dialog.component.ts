import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { toggleLoader } from '../../../../utils/components.utils';
import { DashboardService } from '../../../services/admin/dashboard/dashboard.service';
import { PersonEntityWithPayer } from '../../../interfaces/person.interface';
import { computeAgeFromDob } from '../../../../utils/date.utils';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-verify-registration-dialog',
  imports: [MatProgressSpinner, MatSlideToggleModule, MatCheckboxModule],
  templateUrl: './verify-registration-dialog.component.html',
  styleUrl: './verify-registration-dialog.component.css',
})
export class VerifyRegistrationDialogComponent implements OnInit, OnDestroy {
  @ViewChild('video', { static: true }) video!: ElementRef<HTMLVideoElement>;

  private codeReader = new BrowserMultiFormatReader();
  private controls!: IScannerControls;
  private snackBar = inject(MatSnackBar);
  private dashboard_service = inject(DashboardService);

  async ngOnInit() {
    try {
      this.controls = await this.codeReader.decodeFromVideoDevice(
        undefined, // automatically select camera
        this.video.nativeElement,
        (result, error, controls) => {
          if (result) {
            const qrText = result.getText();

            console.log('✅ QR Detected:', qrText);
            const valid_qr = this.testIfQRCodeContentIsValid(qrText);

            if (!valid_qr) {
              this.snackBar.open('QR Code is invalid!', '', { duration: 3000 });

              return;
            }

            toggleLoader(this.loader);
            this.apiCall(qrText);

            controls.stop(); // stop scanning
          }
          if (error) {
            // ignore not-found errors (normal while scanning)
            console.log(error);
          }
        }
      );
    } catch (err) {
      console.error('Camera access error:', err);
      this.snackBar.open('Camera access failed', '', { duration: 3000 });
    }
  }

  scanned = signal(false);
  persons = signal<PersonEntityWithPayer[]>([]);
  async apiCall(qrText: string) {
    try {
      const persons = await this.dashboard_service.verifyRegistration(qrText);

      this.scanned.set(true);
      if (persons) this.persons.set(persons);
      toggleLoader(this.loader)
    } catch (error: any) {
      this.snackBar.open(error.message, '', { duration: 3000 });
    }
  }

  getAge(year_of_birth: number) {
    return computeAgeFromDob(year_of_birth);
  }

  ngOnDestroy() {
    if (this.controls) {
      this.controls.stop();
    }

    // ✅ Additionally stop all video tracks manually for safety
    const videoElement = this.video?.nativeElement;
    const stream = videoElement?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoElement.srcObject = null;
    }
  }

  @ViewChild('loader')
  loader!: ElementRef<HTMLDivElement>;

  testIfQRCodeContentIsValid(qr_code_text: string) {
    return qr_code_text.includes('registrations?ref=');
  }


}
