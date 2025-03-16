import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment'
let url = environment.registerApiPath;

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) { }

  private headers = new HttpHeaders({
    "Accept": "*/*",
    'Content-Type': 'application/json',
    'api-key': 'dsnvjkn2398jfsd9c803lm'
  });
  register(data: any) {
    return this.http.post(url + 'register/register', data, { headers: this.headers })
  }
  verifyOtp(data: any) {
    return this.http.post(url + 'register/verifyotp', data, { headers: this.headers })
  }
  verifyOtp_login(data: any) {
    return this.http.post(url + 'register/verifyotp_login', data, { headers: this.headers })
  }
  resendOtp(data: any) {
    return this.http.post(url + 'register/resendotp', data, { headers: this.headers })
  }
  getUsers(client: number | null = null, invoiceRef: string | null = null) {
    let search = '';
    if (client == null && invoiceRef != null) {
      search = '/0/' + invoiceRef;
    }
    if (client != null) {
      search = '/' + client;
    }
    return this.http.get(url + 'register/userList' + search, { headers: this.headers });
  }
  confirmRegister(data: any) {
    return this.http.post(url + 'register/confirmRegister', data, { headers: this.headers })
  }
  updateUser(data:any){
    return this.http.post(url + 'register/updateUserDetails', data, { headers: this.headers })
  }
  verifyLink(link: string){
    let data: any = {
      "link": link,
      "timestamp": new Date().getTime()
    }
    return this.http.post(url + 'register/verifyLink', data, { headers: this.headers })
  }
  updateUserStatus(data:any){
    return this.http.post(url + 'register/updateUserStatus', data, { headers: this.headers })
  }
}
