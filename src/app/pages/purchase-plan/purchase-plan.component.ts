import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService } from 'src/app/services/invoice.service';
import { UsersService } from 'src/app/services/users.service';

declare var Razorpay: any;

@Component({
  selector: 'app-purchase-plan',
  templateUrl: './purchase-plan.component.html',
  styleUrls: ['./purchase-plan.component.scss']
})
export class PurchasePlanComponent implements OnInit {
  userData: any = [];
  subscription: any = [];
  firstClick = false;
  selectedPlan: any = [];

  constructor(
    private usersService: UsersService,
    private router: Router,
    private invoiceService: InvoiceService
  ) { }

  ngOnInit(): void {
    this.userData = this.usersService.getData('userData');

    this.usersService.getCountryList().subscribe((res: any) => {
      if (res.status == 200) {
        const plans = res.res.plans;

        this.selectedPlan = plans.find((a: any) => parseInt(a.id) === parseInt(this.userData.planId));
      }
    });
  }


  getSubscription() {
    if (this.userData) {
      const d = {
        userId: this.userData.id,
        planId: this.userData.planId,
      }
      this.usersService.add_onboarding_order(d).subscribe((res: any) => {
        this.subscription = res.data;
        const options = {
          key: this.subscription.rzp_key,
          order_id: this.subscription.rzp_orderId,
          handler: (response: any) => {
            const data = {
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              userId: this.userData.id,
              orderId: response.razorpay_order_id,
            }
            this.updateSubscribe(data);
            // this.verifyPayment();
          },
          prefill: {
            "contact": this.userData.countryCode + this.userData.phoneNumber
          },
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();
      });
    }
  }
  // getSubscription() {
  //   if (this.userData) {
  //     const d = {
  //       userId: this.userData.id,
  //       phoneNo: this.userData.phoneNumber,
  //     }
  //     this.usersService.subscribe(d).subscribe((res: any) => {
  //       this.subscription = res.data;
  //       this.openLink(res.data.short_url);
  //       this.firstClick = true;
  //     });
  //   }
  // }

  updateSubscribe(data: any) {
    this.usersService.verify_onboarding_payment(data).subscribe((data: any) => {
      if (data.data) {
        this.getUserData();
      } else {
        this.invoiceService.showNotification('Payment Failed', data.message, 'notification-error');
      }
    });
  }

  async getUserData() {
    await this.usersService.userData(this.userData.id).subscribe((res: any) => {
      if (res.data) {
        let data = res.data;
        localStorage.setItem('userData', JSON.stringify(data));

        location.replace('/settings');
        // this.router.navigate([]);
      }

    });
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

  verifyPayment() {
    this.usersService.verifySubscribe(this.subscription).subscribe((res: any) => {
      this.updateSubscribe(res.data);
    });
  }

}
