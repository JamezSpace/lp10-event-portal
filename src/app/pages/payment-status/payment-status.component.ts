import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-payment-status',
  imports: [RouterLink],
  templateUrl: './payment-status.component.html',
  styleUrl: './payment-status.component.css',
})
export class PaymentStatusComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  transaction_ref = signal<string>('');
  status = signal<string>('');

  ngOnInit() {
    const status = this.route.snapshot.queryParamMap.get('status');
    const ref = this.route.snapshot.queryParamMap.get('ref');

    if (status && ['success', 'failed'].includes(status))
      this.status.set(status);
    else this.router.navigateByUrl('/');

    // pass the transaction_ref to the event ticket component to be hashed as a qr code as a query param
    if (ref)
      this.transaction_ref.set(
        `${environment.base_backend.url}/registrations?ref=${ref}`
      );
  }
}
