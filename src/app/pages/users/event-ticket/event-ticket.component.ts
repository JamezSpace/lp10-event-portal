import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserQRCodeSvgWriter } from '@zxing/browser';
import { EventTicket } from '../../../interfaces/event.interfaces';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { RegistrationService } from '../../../services/users/registration/registration.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-event-ticket',
  imports: [MatProgressSpinner],
  templateUrl: './event-ticket.component.html',
  styleUrl: './event-ticket.component.css',
})
export class EventTicketComponent implements OnInit, AfterViewInit {
  private reg_service!: RegistrationService;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  transaction_ref = signal<string>('');
  event!: EventTicket;

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

  constructor(reg_service: RegistrationService) {
    this.reg_service = reg_service;
  }

  async ngOnInit(): Promise<void> {
    const ref = this.route.snapshot.queryParamMap.get('reference') || '';

    // redirect to homepage if ref doesnt exist
    ref ? this.transaction_ref.set(ref) : this.router.navigateByUrl('/');

    this.event = {
      _id: 'w2s',
      date: new Date(),
      name: 'December Campout',
      venue: 'RCCG Campground',
    };

    this.shuffleTexts();
  }

  ngAfterViewInit(): void {
    // Render QR code after view is initialized
    this.renderQrCode();

    // Generate the ticket PDF after a short delay
    setTimeout(() => this.generatePdf(), 1000);
    this.router.navigateByUrl('/');
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

    html2canvas(ticket, {
      scale: window.devicePixelRatio, // preserves crispness on all devices
      useCORS: true, // allows external images (like your background) to load
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.documentElement.scrollWidth, // ensures responsiveness
      windowHeight: document.documentElement.scrollHeight,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height], // exact visual dimensions
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('campout_ticket_2025.pdf');
      clearInterval(this.shuffleInterval);
    });
  }
}
