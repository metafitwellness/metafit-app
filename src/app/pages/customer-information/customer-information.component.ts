import { UsersService } from './../../services/users.service';
import { RegistrationDetailsComponent } from './registration-details/registration-details.component';
import { InvoiceService } from './../../services/invoice.service';
import { RegistrationService } from './../../services/registration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { KycDetailsComponent } from './kyc-details/kyc-details.component';
import { CreditDetailsComponent } from './credit-details/credit-details.component';

@Component({
  selector: 'app-customer-information',
  templateUrl: './customer-information.component.html',
  styleUrls: ['./customer-information.component.scss']
})
export class CustomerInformationComponent implements OnInit {
  @ViewChild(RegistrationDetailsComponent) registrationDetailsComponent: RegistrationDetailsComponent;
  @ViewChild(KycDetailsComponent) kycDetailsComponent: KycDetailsComponent;
  @ViewChild(CreditDetailsComponent) creditDetailsComponent: CreditDetailsComponent;


  name: string = '';
  accountStatus: string = '';
  isTemp: boolean = false;
  userId: number = 0;
  userDetail: any = [];

  constructor(
    private router: Router,
    private registrationService: RegistrationService,
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private userService: UsersService,
  ) { }

  ngOnInit(): void {
    if (this.router.url.search('temp') > 0) {
      this.isTemp = true;
    }
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      this.userDetails();
    });
  }
  userDetails() {
    if (!this.isTemp) {
      //Load Data from Main Table
      this.userService.userData(this.userId).subscribe((res: any) => {
        if (res.status == 200 && res.data.length == 1) {
          this.userDetail = res.data[0];
          this.name = this.userDetail.businessName;
          this.accountStatus = this.userDetail.accountStatus;
          setTimeout(() => {
            this.registrationDetailsComponent.loadData()
          }, 100);
        } else {
          this.invoiceService.showNotification('Something went wrong', 'Please try again later', 'notification-error');
        }
      }, (err: any) => {
        this.invoiceService.showNotification('Something went wrong', 'Please try again later', 'notification-error');
      })
    } else {
      //Load Data from Temp Table
      this.registrationService.getUsers(this.userId).subscribe((res: any) => {
        if (res.status == 200 && res.data.length == 1) {
          this.userDetail = res.data[0];
          this.name = this.userDetail.businessName;
          this.accountStatus = this.userDetail.status;
          setTimeout(() => {
            this.registrationDetailsComponent.loadData()
          }, 100);
        } else {
          this.invoiceService.showNotification('Something went wrong', 'Please try again later', 'notification-error');
        }
      }, (err: any) => {
        this.invoiceService.showNotification('Something went wrong', 'Please try again later', 'notification-error');
      })
    }
  }
  tabClick(tab: any) {
    const tabLabel = tab.tab.textLabel;
    switch (tabLabel) {
      case 'KYC Details':
        this.kycDetailsComponent.loadData();
        break;
      case 'Credit Details':
        this.creditDetailsComponent.loadData();
        break;
    }
  }
}
