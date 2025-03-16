import { MatDialog } from '@angular/material/dialog';
import { InvoiceService } from './../../../services/invoice.service';
import { ConfirmationModalComponent } from './../../../components/confirmation-modal/confirmation-modal.component';
import { environment } from './../../../../environments/environment';
import { RegistrationService } from './../../../services/registration.service';
import { UsersService } from './../../../services/users.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-details',
  templateUrl: './registration-details.component.html',
  styleUrls: ['./registration-details.component.scss']
})
export class RegistrationDetailsComponent implements OnInit {
  @Input() userDetails: any = [];
  @Input() isTemp: boolean = false;

  pathSource: string = environment.uploadPath + 'assets/images/flags/';
  countryList: any = [];
  countryListAmount: any = [];

  businessTypes: string[] = ['Sole Proprietorship', 'Partnership', 'Corporation', 'Cooperative', 'FPO', 'Limited Liability Partnership', 'Others']
  turnoverLimit: string[] = ['Over 50,000', '50,000 - 100,000', '100,000 - 500,000', '500,000 - 1,000,000', 'More than 1,000,000'];

  userId: number = 0;
  phoneCode: any = '';
  phoneNumber: string = '';
  email: string = '';
  businessType: string = '';
  otherBusinessType: string = '';
  designatory: string = '';
  businessName: string = '';
  country: any = '';
  currency: any = '';
  annualTurnover: string = '';
  expectedCredit: string = '';
  doEdit: boolean = true;

  constructor(private usersService: UsersService, private registrationService: RegistrationService, private invoiceService: InvoiceService, private dialog: MatDialog, private route: Router) { }

  ngOnInit(): void {
    this.loadCountryCode();
  }

  loadData() {
    this.userId = this.userDetails.id;
    this.phoneCode = this.countryList.filter((e: any) => e.dial_code === this.userDetails.countryCode)[0];
    this.phoneNumber = this.userDetails.phoneNumber;
    this.email = this.userDetails.emailId;
    this.businessType = this.userDetails.businessType;
    this.otherBusinessType = this.userDetails.otherBusinessType;
    this.designatory = this.userDetails.designatoryName;
    this.businessName = this.userDetails.businessName;
    this.annualTurnover = this.userDetails.annualTurnover;
    this.expectedCredit = this.userDetails.expectedCreditLimit;
    this.country = this.countryList.filter((e: any) => e.name === this.userDetails.country)[0];
    this.updateCurrency()
    this.currency = this.countryList.filter((e: any) => e.currency?.code === this.userDetails.currency)[0];
  }
  loadCountryCode() {
    this.usersService.getCountryList().subscribe((res: any) => {
      if (res.status == 200) {
        this.countryList = res.res;
        this.countryList = this.countryList.filter( (v:any) => v?.code )
      }
    });
  }
  updateCurrency() {
    this.countryListAmount = [];
    this.currency = [];
    this.countryListAmount = this.countryList.filter((e: any) => {
      return (e.code === this.country.code || e.code === 'US')
    })
  }
  makeEdit(edit: boolean) {
    this.doEdit = !edit;
  }
  doRegister(status: boolean) {
    if (status) {
      let dialogRef2 = this.dialog.open(ConfirmationModalComponent, {
        data: { 'title': 'Accpet Application?', 'custom': true, 'subText': 'Are you sure you want to accept the application?', 'subText2': 'The User will have to proceed to KYC application' }
      });
      dialogRef2.afterClosed().subscribe(result2 => {
        if (result2.status) {
          this.registrationService.confirmRegister(this.userDetails).subscribe((res: any) => {
            if (res.status == 200) {
              this.invoiceService.showNotification('Application Accepted', 'Customer successfully accepted', 'notification-success');
              this.route.navigate(['/customer-information'])
            } else {
              this.invoiceService.showNotification('Something went wrong', 'Please try again later', 'notification-error');
            }
          }, (err: any) => {
            this.invoiceService.showNotification('Something went wrong', 'Please try again later', 'notification-error');
          })
        }
      });
    } else {
      let dialogRef2 = this.dialog.open(ConfirmationModalComponent, {
        data: { 'title': 'Reject Application?', 'custom': true, 'subText': 'Are you sure you want to reject the application?', 'subText2': 'Please enter reason to reject the application', 'status': 'reject' }
      });
      dialogRef2.afterClosed().subscribe(result2 => {
        if (result2.status) {
          this.invoiceService.showNotification('Application Rejected', 'Customer application rejected', 'notification-success');
        }
      });
    }
  }
  saveChanges() {
    this.userDetails.country = this.country.name;
    this.userDetails.countryCode = this.phoneCode.dial_code;
    this.userDetails.currency = this.currency.currency.code;
    this.userDetails.isTemp = this.isTemp;
    this.userDetails.phoneNumber = this.phoneNumber;
    this.userDetails.emailId = this.email;
    this.userDetails.businessType = this.businessType;
    this.userDetails.otherBusinessType = this.otherBusinessType;
    this.userDetails.designatoryName = this.designatory;
    this.userDetails.name = this.designatory;
    this.userDetails.businessName = this.businessName;
    this.userDetails.annualTurnover = this.annualTurnover;
    this.userDetails.expectedCreditLimit = this.expectedCredit;

    this.registrationService.updateUser(this.userDetails).subscribe((res: any) => {
      if (res.status == 200) {
        this.doEdit = true;
        this.invoiceService.showNotification('Application Updated', 'Customer successfully updated', 'notification-success');
      } else {
        this.invoiceService.showNotification('Something went wrong', 'Please try again later', 'notification-error');
      }
    }, (err: any) => {
      this.invoiceService.showNotification('Something went wrong', 'Please try again later', 'notification-error');
    });
  }
}
