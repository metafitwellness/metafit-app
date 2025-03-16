import { Router } from '@angular/router';
import { UsersService } from './../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';

declare var Razorpay: any;


@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {
  userData: any = [];
  subscription: any = [];
  firstClick = false;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private invoiceService: InvoiceService
  ) { }

  ngOnInit(): void {
    this.userData = this.usersService.getData('userData');

  }

  getSubscription() {
    if (this.userData) {
      const d = {
        userId: this.userData.id,
        phoneNo: this.userData.phoneNumber,
      }
      this.usersService.subscribe(d).subscribe((res: any) => {
        this.subscription = res.data;
        const options = {
          key: this.subscription.rzp_key,
          subscription_id: this.subscription.subscriptionId,
          name: this.userData.hotelName,
          handler: (response: any) => {
            console.log(response);
            const data = {
              paymentId: response.razorpay_payment_id,
              subscriptionId: response.razorpay_subscription_id,
              signature: response.razorpay_signature,
              userId: this.userData.id
            }
            // this.updateSubscribe(data);
            this.verifyPayment();
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
    this.usersService.updateSubscribe(data).subscribe((data: any) => {
      if (data.data) {
        this.usersService.setData('userData', data.data);
        // this.router.navigate(['/']);
        location.replace('/');
      } else {
        this.invoiceService.showNotification('Payment Failed', data.message, 'notification-error');
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
