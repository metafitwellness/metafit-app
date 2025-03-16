import { UsersService } from './../../services/users.service';
import { InvoiceService } from './../../services/invoice.service';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { InformationModalComponent } from '../information-modal/information-modal.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAdmin: boolean = false;
  userDetails: any = '';
  userEnabled: boolean = true;
  isOnline: boolean = true;
  openMenu: boolean = false;

  constructor(
    private route: Router,
    private invoiceService: InvoiceService,
    private dialog: MatDialog,
    private usersService: UsersService
  ) {
  }

  ngOnInit() {
    this.userDetails = JSON.parse(localStorage["userData"]);
    this.isAdmin = this.userDetails.admin == 1 ? true : false;

    this.isOnline = this.userDetails.status == 1 ? true : false;
    // this.verifyUser('registered');

    if (this.userDetails.accountStatus == 'verification') {
      if (
        (this.userDetails.verificationStatus === 'pending' || this.userDetails.verificationStatus === 'rejected')
      ) {
        this.route.navigate(['settings']);
        this.openDialog(this.userDetails.accountStatus, this.userDetails.verificationStatus, this.userDetails.verificationRemark);
      }
    } else {

      if (this.userDetails.accountStatus == 'active' || this.userDetails.accountStatus == 'onboarded') {
        this.userEnabled = true;
        if (this.route.url !== '/settings') {
          if (this.userDetails.firstLogin == 1) {
            this.route.navigate(['/settings']);
            this.invoiceService.showNotification('Update Profile', 'Please Update profile to Get Started!', 'notification-success');
          }
        }
      } else {
        this.verifyUser(this.userDetails.accountStatus);
        this.userEnabled = false;
      }
    }
  }
  verifyUser(accountStatus: string) {
    this.openDialog(accountStatus);
    if (this.route.url == '/subscribe' || this.route.url == '/purchase-plan') {
      this.dialog.closeAll();
    }
  }
  logout() {
    this.invoiceService.logout();
    this.route.navigate(['/login'])
  }
  openDialog(accountStatus: string, verificationStatus: any = '', remark: any = '') {
    if (accountStatus == 'registered') {
      this.dialog.open(InformationModalComponent, {
        disableClose: true,
        width: '40%',
        data: {
          'icon': 'kyc/make-payment.jpg',
          'title': 'Complete Onboarding Payment!',
          'data': 'Complete Onboarding Payment to Get Started...',
          'button': 'Make Payment',
          'buttonPath': 'purchase-plan'
        }
      });
    }

    if (accountStatus == 'verified') {
      this.dialog.open(InformationModalComponent, {
        disableClose: true,
        width: '40%',
        data: {
          'icon': 'kyc/pending-kyc.png',
          'title': 'No Active Plan!',
          'data': 'Suscribe with Metafit to Get Started...',
          'button': 'Subscribe',
          'buttonPath': 'subscribe'
        }
      });
    }
    if (accountStatus == 'verification' && verificationStatus == 'pending') {
      this.dialog.open(InformationModalComponent, {
        disableClose: true,
        width: '40%',
        data: {
          'icon': 'kyc/pending.png',
          'title': 'Verification Pending!',
          'data': 'Your profile is currently under review. You will be notified once the verification process is complete, which typically takes 2-3 business days.',
          'button': '',
          'buttonPath': ''
        }
      });
    }

    if (accountStatus == 'verification' && verificationStatus == 'rejected') {
      this.dialog.open(InformationModalComponent, {
        disableClose: true,
        width: '40%',
        data: {
          'icon': 'kyc/rejected.png',
          'title': 'Verification Failed!',
          'data': 'Your profile verification was unsuccessful due to the following reason: <span class="rejectedReason">' + remark + '</span>.<br> Please review the details and resubmit your information for further processing.',
          'button': 'Update Profile',
          'buttonPath': 'close'
        }
      });
    }
  }
  updateStatus(state: any) {
    this.usersService.updateStatus(this.userDetails.id, state.checked).subscribe((res: any) => {
      this.userDetails.status = res.data;
      this.usersService.setData('userData', this.userDetails);
    })
  }
  toggleMenu() {
    this.openMenu = !this.openMenu;
  }
}
