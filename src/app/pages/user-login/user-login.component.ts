import { RegistrationService } from './../../services/registration.service';
import { InvoiceService } from './../../services/invoice.service';
import { UsersService } from './../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  phoneno: string = '';
  password: string = '';
  isValid: boolean = false;
  formError: string = '';


  otp: string = '';
  otpSent: boolean = false;
  userId: any = '';

  cPassword: string = '';
  cPassword2: string = '';
  isValid2: boolean = false;

  firstLogin: boolean = false;
  resetPass: boolean = false;

  constructor(
    private router: Router,
    private userService: UsersService,
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    private registrationService: RegistrationService
  ) { }

  ngOnInit(): void {
  }

  validate() {
    this.formError = '';
    if (this.phoneno && this.password) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }
  validate2() {
    this.formError = '';
    if (this.cPassword && this.cPassword2 && (this.cPassword2 == this.cPassword)) {
      this.isValid2 = true;
    } else {
      this.isValid2 = false;
    }
  }
  doLogin() {

    let data = {
      'phoneno': this.phoneno,
      'password': this.password
    }
    this.userService.login(data).subscribe((res: any) => {
      if (parseInt(res.status) === 200) {
        if (parseInt(res.res) !== 0) {
          this.userService.setData('userData', res.res);
          this.router.navigate(['/'])
        } else {
          this.formError = 'Invalid credentials or account not active';
        }
      } else {
        this.formError = 'Invalid credentials or account not active';
      }
    }, (err: Error) => {
    })

  }
  updateLogin() {
    let data = {
      'phoneNumber': this.phoneno,
      'password': this.cPassword2,
      'newPass': this.cPassword,
      'userId': this.userId
    }
    this.userService.changePassword(data).subscribe((res: any) => {
      if (res.status == 200 && res.res == 1) {
        this.validate();
        this.firstLogin = false;
        this.invoiceService.showNotification('Password Updates Successfully', 'Please login with New Password', 'notification-success');
        this.firstLogin = false;
        this.resetPass = false;
        this.cPassword = '';
        this.cPassword2 = '';
        this.password = '';
      } else {

      }
    })
  }
  forgotPassword() {
    this.resetPass = true;
    this.password = '';
  }
  resetPassword() {
    let data = {
      'phoneNumber': this.phoneno
    }
    this.userService.resetPassword(data).subscribe((res: any) => {
      if (res.status == 200 && res.res == 1) {
        this.validate();
        this.otpSent = true;
        this.invoiceService.showNotification('OTP Sent', 'Please Enter 6 digit OTP Shared on Registered Mobile Number.', 'notification-success');
      } else {
        this.invoiceService.showNotification('Account not exists', 'Enter valid email id associated with your account', 'notification-error');
      }
    })
  }
  verifyOtp() {
    let data = {
      "phoneNumber": this.phoneno,
      "otp": this.otp
    }

    this.registrationService.verifyOtp_login(data).subscribe((res: any) => {
      if (res?.status == 200 && res.data == 'success') {
        const data = res.datax;
        this.userId = data;
        this.formError = '';
        this.firstLogin = true;
        this.resetPass = false;
      } else {
        this.formError = 'Invalid OTP';
      }
    }, (err: any) => {
      this.invoiceService.showNotification('Something went wrong', 'Please try again later', 'notification-error');
    })
  }
}
