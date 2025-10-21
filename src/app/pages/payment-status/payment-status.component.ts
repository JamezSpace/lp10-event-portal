import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-status',
  imports: [],
  templateUrl: './payment-status.component.html',
  styleUrl: './payment-status.component.css',
})
export class PaymentStatusComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router)
    status = signal<string>('')

  ngOnInit() {
    const status = this.route.snapshot.queryParamMap.get('status');

    if(status) this.status.set(status)
    else this.router.navigateByUrl('')
  }
}
