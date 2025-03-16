import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'
let url = environment.registerApiPath;


@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private headers = new HttpHeaders({
    "Accept": "*/*",
    'Content-Type': 'application/json',
    'api-key': 'dsnvjkn2398jfsd9c803lm'
  });

  constructor(private http: HttpClient) { }

  listLandingPartner() {
    return this.http.get(url + 'credit/landingPartner', { headers: this.headers })
  }
  getCreditDetails(userId: any) {
    return this.http.get(url + 'credit/creditDetails?userId=' + userId, { headers: this.headers })
  }
  saveCreditDetails(data: any) {
    return this.http.post(url + 'credit/addLimit', data, { headers: this.headers })
  }
  updateLimitStatus(data: any) {
    return this.http.post(url + 'credit/approveLimit', data, { headers: this.headers })
  }
}













