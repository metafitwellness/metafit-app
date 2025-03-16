import { UsersService } from './../../services/users.service';
import { Component, OnInit, Inject, OnChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { count } from 'console';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.scss']
})
export class CreateUserModalComponent implements OnInit {
  reason: string = '';
  validForm: boolean = false;

  name: string = '';
  designatory: string = '';
  country: string = '';
  currency: string = '';
  creditLimit: string = '';
  expiryDate: any = '';
  emailId: string = '';


  dateError: string = '';
  nameError: string = '';
  designatoryError: string = '';
  countryError: string = '';
  currencyError: string = '';
  limitError: string = '';
  emailError: string = '';

  currencyList: any = [];


  constructor(
    public dialogRef: MatDialogRef<CreateUserModalComponent>,
    private userService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnChanges(): void {
    if (this.data.status != 'reject') {
      this.reason = 'accepted';
    }
  }

  ngOnInit(): void {
    this.listCurrency();
  }
  confirm() {
    let data = {
      'name': this.name,
      'designation': this.designatory,
      'country': this.country,
      'currency': this.currency,
      'creditLimit': this.creditLimit,
      'expiry': this.expiryDate,
      'email': this.emailId
    }
    this.userService.addUser(data).subscribe((res: any) => {
      if (res.status == 200) {
        this.dialogRef.close({ 'status': true, 'reason': this.reason });
      }
    }, (err: Error) => {
      console.log(err);
      this.emailError = 'Email already exists';
    })
  }

  validateDate() {
    let date = new Date(this.expiryDate);
    let today = new Date();
    if (date > today) {
      this.dateError = '';
    } else {
      this.dateError = 'Expiry date should greater than today date';
    }
  }

  validateEmail() {
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (this.emailId.match(validRegex)) {
      this.emailError = '';
    } else {
      this.emailError = 'Enter valid email id';
    }
  }

  validateForm() {
    if (this.name && this.emailId && this.currency && this.designatory && this.country && this.creditLimit && this.expiryDate && !this.emailError && !this.dateError) {
      this.validForm = true
    } else {
      this.validForm = false;
    }
  }
  listCurrency(){
    this.userService.listCurrency().subscribe((res: any) => {
      if (res.status == 200) {
        this.currencyList = res.res;
      }
    })
  }
}
