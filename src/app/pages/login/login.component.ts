import { InvoiceService } from './../../services/invoice.service';
import { UsersService } from './../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  isValid: boolean = false;
  formError: string = '';


  cPassword : string = '';
  cPassword2: string = '';
  isValid2 : boolean = false;

  firstLogin: boolean = false;
  resetPass: boolean = false;

  constructor(private router: Router, private userService: UsersService, private invoiceService: InvoiceService) { }

  ngOnInit(): void {
  }

  validate() {
    this.formError = '';
    if (this.email && this.password) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }
  validate2(){
    this.formError = '';
    if (this.cPassword && this.cPassword2 && (this.cPassword2 == this.cPassword)) {
      this.isValid2 = true;
    } else {
      this.isValid2 = false;
    }
  }
  doLogin() {

    let data = {
      'email': this.email,
      'password': this.password
    }
    this.userService.login(data).subscribe( (res : any) =>{
      if(res.status == 200){
        if(res.res != 0){
          let isAdmin = false;
          if(res.res.firstLogin == 1){
            this.firstLogin = true;
          }else{
            if(res.res.admin == 1){
              isAdmin = true;
            }
            let data = {
              'logged': 1,
              "isAdmin" : isAdmin,
              "userData": res.res
            }
            localStorage.setItem("logged", JSON.stringify(data));
            this.router.navigate(['/'])
          }
        }else{
          this.formError = 'Invalid credentials or account not active';
        }
      }else{
        this.formError = 'Invalid credentials or account not active';
      }
    }, (err:Error) => {
    } )

  }
  updateLogin(){
    let data = {
      'email': this.email,
      'password': this.password,
      'newPass': this.cPassword
    }
    this.userService.changePassword(data).subscribe( (res : any) =>{
     if(res.status == 200 && res.res == 1){
      this.password = '';
      this.validate();
      this.firstLogin  =false;
      this.invoiceService.showNotification('Password Updates Successfully', 'Please login to access Toggle App', 'notification-success');

      this.cPassword = '';
      this.cPassword2 = '';
      this.password = '';
     }else{

     }
    })
  }
  forgotPassword(){
    this.resetPass = true;
    this.password = '';
  }
  resetPassword(){
    let data = {
      'email': this.email
    }
    this.userService.resetPassword(data).subscribe( (res : any) =>{
     if(res.status == 200 && res.res == 1){
      this.email = '';
      this.password = '';
      this.validate();
      this.resetPass = false;
      this.invoiceService.showNotification('Password Reset Requested', 'Please check your regisstered email id for new password', 'notification-success');
     }else{
      this.invoiceService.showNotification('Account not exists', 'Enter valid email id associated with your account', 'notification-error');
     }
    })
  }
}
