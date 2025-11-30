import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserQRCodeSvgWriter } from '@zxing/browser';
import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  Signal,
  signal,
  ViewChild,
} from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { BaseEventModel } from '../../../models/api-models/event.api-model';
import { DashboardService } from '../../../services/admin/dashboard/dashboard.service';
import { RegistrationService } from '../../../services/users/registration/registration.service';
import { RegistrationDataService } from '../../../services/users/registration-data/registration-data.service';

@Component({
  selector: 'app-event-ticket',
  imports: [MatProgressSpinner],
  templateUrl: './event-ticket.component.html',
  styleUrl: './event-ticket.component.css',
})
export class EventTicketComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  transaction_ref = signal<string>('');
  private reg_data_service = inject(RegistrationDataService);

  event: Signal<
    { name: string; start_date: string; venue: string } | undefined
  > = computed(() => {
    let live_event = localStorage.getItem('event');
    if (!live_event) return;

    let event = JSON.parse(live_event);

    const start = new Date(event.start_date || '');
    const formatted_start_date = isNaN(start.getTime())
      ? 'null'
      : start
          .toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })
          .toString();

    return {
      name: event.name,
      start_date: formatted_start_date,
      venue: event.venue || 'null',
    };
  });

  @ViewChild('ticket')
  event_ticket!: ElementRef<HTMLDivElement>;

  @ViewChild('qr_code')
  qrCodeRef!: ElementRef<HTMLDivElement>;

  heading_texts = [
    'Almost done!',
    'See you at campout!',
    'One moment please...',
  ];
  @ViewChild('text_to_display')
  display_text_during_download!: ElementRef<HTMLHeadingElement>;

  async ngOnInit(): Promise<void> {
    const ref = localStorage.getItem('reference') || '';

    // redirect to homepage if ref doesnt exist
    ref !== '' ? this.transaction_ref.set(ref) : this.router.navigateByUrl('/');

    this.shuffleTexts();
  }

  ngAfterViewInit(): void {
    // Render QR code after view is initialized
    this.renderQrCode();

    // Generate the ticket PDF after a short delay
    setTimeout(() => this.generatePdf(), 1000);

    localStorage.removeItem('reference');
  }

  private renderQrCode() {
    const container = this.qrCodeRef.nativeElement;
    container.innerHTML = ''; // clear previous content

    const writer = new BrowserQRCodeSvgWriter();
    const svgElement = writer.write(this.transaction_ref(), 210, 210);
    container.appendChild(svgElement);
  }

  shuffleInterval: any;
  shuffleTexts() {
    let count = 0;

    this.shuffleInterval = setInterval(() => {
      const num = count % this.heading_texts.length;
      this.display_text_during_download.nativeElement.textContent =
        this.heading_texts[num];
      count++;
    }, 1500);
  }

  async generatePdf() {
    const ticket = this.event_ticket.nativeElement;
    
    // Assuming you are using 'hidden-print' now and showing the element
    ticket.classList.remove('hidden-print'); 

    html2canvas(ticket, {
      scale: 2,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jspdf({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // --- SCALING LOGIC FOR FULL-BLEED (COVER) ---

      // 1. Use Math.max to force the image to cover the entire page
      // This ensures the shortest dimension of the page is filled by the image
      const ratio = Math.max(
        pageWidth / canvas.width,
        pageHeight / canvas.height
      ); 

      // 2. Calculate new dimensions that fully cover the page
      const imgWidth = canvas.width * ratio;
      const imgHeight = canvas.height * ratio;

      // 3. Center the image (the overflowing parts will be clipped by the PDF)
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      // ---------------------------------------------

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save('campout_ticket_2025.pdf');

      // Restore the hiding class
      ticket.classList.add('hidden-print'); 

      clearInterval(this.shuffleInterval);
      this.router.navigateByUrl('/');
    });
}
}
