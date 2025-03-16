import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment'
let url = environment.registerApiPath;

@Injectable({
  providedIn: 'root'
})
export class KycService {
  constructor(private http: HttpClient) { }

  private headers = new HttpHeaders({
    "Accept": "*/*",
    'Content-Type': 'application/json',
    'api-key': 'dsnvjkn2398jfsd9c803lm'
  });
  listKycDocuments() {
    return this.http.get(url + 'kyc/kycDocumentList', { headers: this.headers })
  }

  saveDocument(data: any) {
    return this.http.post(url + 'kyc/saveDocument', data, { headers: this.headers })
  }

  getDocuments(data: any) {
    return this.http.post(url + 'kyc/getDocuments', data, { headers: this.headers })
  }

  removeDocument(data: any) {
    return this.http.post(url + 'kyc/removeDocument', data, { headers: this.headers })
  }
  updateKyc(data: any) {
    return this.http.post(url + 'kyc/updateKyc', data, { headers: this.headers })
  }
}
