import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { environment } from '../../environments/environment'
let url = environment.apiPath;


@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';


  clientId: number = 0;
  isAdmin: boolean = false;

  private headers = new HttpHeaders({
    "Accept": "*/*",
    'Content-Type': 'application/json',
    'api-key': 'dsnvjkn2398jfsd9c803lm'
  });

  constructor(private route: Router, private http: HttpClient, private _snackBar: MatSnackBar) {
    if (localStorage["logged"] != undefined) {
      this.clientId = JSON.parse(localStorage["logged"])?.userData.id;
    }
  }

  loadDashboard(userId: number) {
    return this.http.get(url + 'loadDashboard/' + userId, { headers: this.headers })
  }
  loadAdminDashboard() {
    return this.http.get(url + 'loadDashboardAdmin/', { headers: this.headers })
  }

  uploadFile(file: any) {
    this.clientId = JSON.parse(localStorage["logged"])?.userData.id;
    const formData = new FormData();
    formData.append("file", file, file.name);
    return this.http.post(url + 'uploadPdf/' + this.clientId, formData);
  }


  showNotification(title: string, msg: string, notificationTheme: string) {
    this._snackBar.open(title + ' : ' + msg, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3000,
      panelClass: [notificationTheme]
    });
  }

  addInvoice(data: any) {
    return this.http.post(url + 'addInvoice', data, { headers: this.headers });
  }
  updateInvoice(data: any) {
    return this.http.post(url + 'updateInvoice', data, { headers: this.headers });
  }
  getInvoices(client: number | null = null, invoiceRef: string | null = null) {
    let search = '';
    if (client == null && invoiceRef != null) {
      search = '/0/' + invoiceRef;
    }
    if (client != null){
      search = '/'+client;
    }
    return this.http.get(url + 'invoiceList' + search, { headers: this.headers });
  }
  addPayment(data: any) {
    return this.http.post(url + 'addPayment', data, { headers: this.headers });
  }
  eSignInvoice(data: any) {
    return this.http.post(url + 'eSignInvoice', data, { headers: this.headers });
  }
  getPaymentData(data: any) {
    return this.http.get(url + 'paymentStatus/'+data, { headers: this.headers });
  }


  logout() {
    localStorage.clear();
  }
}
