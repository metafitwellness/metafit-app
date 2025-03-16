import { ConfirmationModalComponent } from './../../../components/confirmation-modal/confirmation-modal.component';
import { InvoiceService } from './../../../services/invoice.service';
import { Component, Input, OnInit } from '@angular/core';
import { RegistrationService } from '../../../services/registration.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { KycService } from '../../../services/kyc.service';
import { CreditService } from '../../../services/credit.service';

@Component({
  selector: 'app-credit-details',
  templateUrl: './credit-details.component.html',
  styleUrls: ['./credit-details.component.scss']
})
export class CreditDetailsComponent implements OnInit {
  @Input() userDetails: any = '';
  doEdit: boolean = false;
  appliedLimit: string = '';
  creditLimit: string = '';
  landingPartner: string = '';
  riskCategory: string = '';
  creditScore: number = 0;
  creditScoreValue: string = '';
  creditScoreCardValue: number = 1;
  creditRange: string = '';
  landingPartners: any = [];
  lastUpdate: string = '';
  creditId: number = 0;
  creditAddedBy: number = 0;
  loginManager: number = JSON.parse(localStorage["logged"]).userData.id;

  formButton: boolean = false;

  constructor(
    private registrationService: RegistrationService,
    private dialog: MatDialog,
    private invoiceService: InvoiceService,
    private creditService: CreditService,
    private route: Router
  ) { }

  ngOnInit(): void {
  }

  loadData() {
    this.appliedLimit = this.userDetails.expectedCreditLimit;
    this.creditLimit = this.userDetails.creditLimit;

    this.doEdit = !(this.userDetails.accountStatus === 'limit_pending');
    this.setcreditScoreValue();
    this.getLandingPartners();
    this.getCreditDetails();
  }
  setcreditScoreValue() {
    if (this.creditScore <= 619) {
      this.creditScoreCardValue = 1;
      this.creditScoreValue = 'Bad';
    } else {
      if (this.creditScore > 619 && this.creditScore <= 679) {
        this.creditScoreCardValue = 2;
        this.creditScoreValue = 'Average';
      } else {
        if (this.creditScore > 679 && this.creditScore <= 730) {
          this.creditScoreCardValue = 3;
          this.creditScoreValue = 'Good';
        } else {
          if (this.creditScore > 730) {
            this.creditScoreCardValue = 4;
            this.creditScoreValue = 'Excellent';
          } else {
            this.creditScoreCardValue = 1;
            this.creditScoreValue = 'Bad';
          }
        }
      }
    }
  }

  addCreditLimit() {
    let data = {
      userId: this.userDetails.id,
      appliedLimit: this.appliedLimit,
      creditLimit: this.creditLimit,
      landingPartner: this.landingPartner,
      riskCategory: this.riskCategory,
      addedBy: JSON.parse(localStorage["logged"]).userData.id
    }
    this.creditService.saveCreditDetails(data).subscribe((res: any) => {
      let data2 = {
        accountStatus: 'limit_added',
        userId: this.userDetails.id
      }
      if (res.status == 200) {
        this.registrationService.updateUserStatus(data2).subscribe((res: any) => {
          if (res.status == 200) {
            this.userDetails.accountStatus = 'limit_added'
            this.doEdit = true;
            this.invoiceService.showNotification('Limit Added', 'Limit added, Confirmation pending!', 'notification-success');
          } else {
            this.invoiceService.showNotification('Something went wrong', 'Error occured while uploading revised invoice', 'notification-error');
          }
        }, (err: Error) => {
          console.log(err)
        })
      }
    }, (err: any) => {
      console.log(err)
    })

  }
  resetForm() {
    this.route.navigate(['/customer-information'])
  }

  approveLimit() {
    let dialogRef2 = this.dialog.open(ConfirmationModalComponent, {
      data: { 'title': 'Approve credit limit?', 'custom': true, 'subText': 'Credit of ' + this.userDetails.currency + ' ' + this.creditLimit + ' will be added to ' + this.userDetails.name + '’s credit wallet & the application will move to “Active” stage', 'subText2': '' }
    });
    dialogRef2.afterClosed().subscribe(result2 => {
      if (result2.status) {
        this.updateLimitStatus(true, 'active', '')
      }
    });
  }
  rejectLimit() {
    let dialogRef2 = this.dialog.open(ConfirmationModalComponent, {
      data: { 'title': 'Reject Credit Limit?', 'custom': true, 'subText': 'Please select a valid reason before rejecting the document!', 'subText2': '', 'status': 'reject' }
    });
    dialogRef2.afterClosed().subscribe(result2 => {
      this.updateLimitStatus(false, 'rejected', result2.reason)
    });
  }

  updateLimitStatus(update: boolean, status: string, reason: string = '') {
    let data = {
      userId: this.userDetails.id,
      status: status,
      verifiedBy: JSON.parse(localStorage["logged"]).userData.id,
      reason: reason,
      creditId: this.creditId,
      creditLimit: this.creditLimit
    }
    this.creditService.updateLimitStatus(data).subscribe((res: any) => {
      if (res.status == 200) {
        console.log(update)
        this.updateUser(update ? true : false);
      }
    }, (err: Error) => {
      console.log(err)
      this.invoiceService.showNotification('Something went wrong', 'Error occured while uploading revised invoice', 'notification-error');
    })
  }

  updateUser(update: boolean) {
    let data = {
      accountStatus: update ? 'active' : 'limit_pending',
      userId: this.userDetails.id
    }
    this.registrationService.updateUserStatus(data).subscribe((res: any) => {
      if (res.status == 200) {
        this.invoiceService.showNotification(update ? 'Credit limit confirmed!' : 'Credit limit rejected!', update ? 'Credit limit successfully confirmed!' : 'Credit limit successfully rejected!', 'notification-success');
        this.route.navigate(['/customer-information'])
      }
    }, (err: Error) => {
      console.log(err)
    })
  }
  getLandingPartners() {
    this.creditService.listLandingPartner().subscribe((res: any) => {
      if (res.status == 200) {
        this.landingPartners = res.data;
      }
    }, (err: any) => {
      console.log(err)
    })
  }
  getCreditDetails() {
    this.creditService.getCreditDetails(this.userDetails.id).subscribe((res: any) => {
      if (res.status == 200)
        if (res.data && res.data.length > 0) {
          let data = res.data[0];
          this.appliedLimit = data.appliedLimit;
          this.creditLimit = data.creditLimit;
          this.landingPartner = data.landingPartner;
          this.riskCategory = data.riskCategory;
          this.creditId = data.id;
          this.creditAddedBy = data.addedBy;
        }
    }, (err: any) => {
      console.log(err)
    })
  }

  validLimit(limit: number | string) {
    return (parseFloat(this.appliedLimit) >= parseFloat(this.creditLimit))
  }

}
