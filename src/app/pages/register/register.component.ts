import { InvoiceService } from './../../services/invoice.service';
import { RegistrationService } from './../../services/registration.service';
import { environment } from './../../../environments/environment';
import { UsersService } from './../../services/users.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  pathSource: string = environment.uploadPath + 'assets/images/flags/';
  steps: any = [
    { "step": 0, "name": "Basic Details" },
    { "step": 1, "name": "Verify OTP" }
  ]
  activeStep: number = 0;
  otpLength: number[] = [0, 1, 2, 3, 4, 5];
  countryList: any = [];
  countryListAmount: any = [];
  time: number = 120;
  display: any = "2:00";
  interval: any;
  invalidOtp: boolean = false;
  maxAttempt: number = 3;
  attemptLeft: number = 0;

  userId: number = 0;
  phoneCode: any = '+91';
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

  name: string = '';
  segment: string = '';
  segmentName: string = '';
  city: string = '';
  cityName: string = '';
  password: string = '';
  referral: string = '';
  plan: any = '';
  planName: any = '';

  cityList: any = [];
  segmentList: any = [];
  plans: any = [];
  otp: string[] = [];
  planData: any = [];

  constructor(
    private usersService: UsersService,
    private registrationService: RegistrationService,
    private invoiceService: InvoiceService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadCountryCode();
    this.startTimer();
  }
  loadCountryCode() {
    this.usersService.getCountryList().subscribe((res: any) => {
      if (res.status == 200) {
        this.countryList = res.res.countries;
        this.cityList = res.res.cities;
        this.segmentList = res.res.segments;
        this.plans = res.res.plans;
        setTimeout(() => {
          this.phoneCode = this.countryList[0];
          this.cdr.detectChanges();
          this.route.queryParams.subscribe((arg: any) => {
            if(arg.plan){
              this.plan = arg.plan;
              this.updatePlan();
            }
          });
        }, 200);
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
  updateCity() {
    this.cityName = this.cityList.find((c: any) => c.id === this.city)['city_name'];
  }
  updatePlan() {
    this.planData = this.plans.find((c: any) => c.id === this.plan);
    this.planName = `${this.planData.plan}`;
  }
  updateSegment() {
    this.segmentName = this.segmentList.find((c: any) => c.id === this.segment)['segement'];
  }
  doRegister(step = 0) {
    if (step == 1) {
      let data = {
        "phoneCode": this.phoneCode.dial_code,
        "phoneNumber": this.phoneNumber,
        "name": this.name,
        "segment": this.segment,
        "city": this.city,
        'password': this.password,
        'referral': this.referral,
        'onboardingAmount': this.planData.onboarding,
        'planId': this.planData.id
      }

      this.registrationService.register(data).subscribe((res: any) => {
        if (res?.status == 200) {
          if (res?.data === 'registered' || res?.data === 'onboarded') {
            this.invoiceService.showNotification('Already Registered', 'Given Phone Number Already Registered, Please Login', 'notification-error');
            this.router.navigate(['/login']);
          } else {
            this.activeStep++;
            this.userId = res.data;
            this.startTimer();
          }
        } else {
          this.invoiceService.showNotification('Something went wrong', 'Please try again later', 'notification-error');
        }
      }, (err: any) => {
        this.invoiceService.showNotification('Something went wrong', 'Please try again later', 'notification-error');
      })
    }
    if (step == 2) {

    }
  }
  otpInput(event: any) {
    let element;
    var charCode = (event.which) ? event.which : event.keyCode;
    if (event.target.value >= 0 && event.target.value <= 9) {
      if (event.code !== 'Backspace')
        element = event.srcElement.nextElementSibling;

      if (event.code === 'Backspace')
        element = event.srcElement.previousElementSibling;

      if (element == null)
        return;
      else
        element.focus();

      setTimeout(() => {
        this.validateOtp();
      }, 1000);
    } else {
      event.target.value = '';
    }
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.time > 0) {
        this.time--;
      } else {
        this.time = 0;
      }
      this.display = this.transform(this.time)
    }, 1000);
  }

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return minutes + ':' + (value - minutes * 60);
  }

  validateOtp() {
    return this.otp.join('').length == 6;
  }

  verifyOtp() {
    let data = {
      "phoneNumber": this.phoneNumber,
      "userId": this.userId,
      "otp": this.otp.join('')
    }

    this.registrationService.verifyOtp(data).subscribe((res: any) => {
      if (res?.status == 200 && res.data == 'success') {
        const data = res.datax;
        this.usersService.setData('userData', data);
        this.router.navigate(['/']);
        this.activeStep = 4;
      } else {
        this.invalidOtp = true;
        this.otp = [];
        this.time = 120;
        this.attemptLeft = this.maxAttempt - res.attempt;
        if (res.attempt == 3) {
          this.activeStep = 5;
        }
      }
    }, (err: any) => {
      this.invoiceService.showNotification('Something went wrong', 'Please try again later', 'notification-error');
    })
  }

  resendOtp() {
    let data = {
      "phoneNumber": this.phoneNumber,
      "userId": this.userId
    }
    this.registrationService.resendOtp(data).subscribe((res: any) => {
      if (res?.status == 200 && res.data == 'success') {
        this.invoiceService.showNotification('OTP Successfully resend', 'Please check your inbox for OTP', 'notification-success');
      } else {
        this.invoiceService.showNotification('Something went wrong', 'Please try again later', 'notification-error');
      }
    }, (err: any) => {
      this.invoiceService.showNotification('Something went wrong', 'Please try again later', 'notification-error');
    })
  }
}
