import { InvoiceService } from './../../../services/invoice.service';
import { RegistrationService } from './../../../services/registration.service';
import { environment } from './../../../../environments/environment';
import { FileViewerComponent } from './../../../components/file-viewer/file-viewer.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { KycService } from './../../../services/kyc.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-kyc-details',
  templateUrl: './kyc-details.component.html',
  styleUrls: ['./kyc-details.component.scss']
})
export class KycDetailsComponent implements OnInit {
  @Input() userDetails: any = '';
  isRejected: boolean = false;
  allAccepted: boolean = false;
  documents: any = [];
  documentComplete: any = [];
  userDocuments: any = [];

  constructor(
    private kycService: KycService,
    private registrationService: RegistrationService,
    private invoiceService: InvoiceService,
    private route: Router
  ) { }

  ngOnInit(): void {
  }

  loadData() {
    this.listDocuments()
  }

  listDocuments() {
    this.kycService.listKycDocuments().subscribe((res: any) => {
      if (res.status == 200) {
        this.documents = res.data;
        this.listUserDocuments();
      }
    }, (err: Error) => {
      console.log(err)
    })
  }
  listUserDocuments() {
    let data = {
      'userId': this.userDetails.id
    }
    this.kycService.getDocuments(data).subscribe((res: any) => {
      if (res.status == 200) {
        this.userDocuments = res.data;
        this.documents.types.map((v: string) => {
          this.documentComplete[v] = 0;
        });
        this.documents.types.map((v: string) => {
          this.documents.data[v].map((data: any) => {
            // this.totalDocuments++;
            data.userDocument = this.userDocuments.filter((doc: any) => {
              if (doc.documentId === data.id) {
                this.documentComplete[v]++;
                // this.totalComplete++;
              }
              return doc.documentId === data.id;
            })
          })
        })
        if(this.userDetails.accountStatus == 'kyc_processing'){
          let accepted = 0;
          this.userDocuments.map((doc: any) => {
            if (doc.status != "pending") {
              if (doc.status == "rejected") {
                this.isRejected = true;
              } else {
                accepted++;
              }
            }
          })
          if (accepted == this.userDocuments.length) {
            this.allAccepted = true;
          }
        }
      }
    }, (err: Error) => {
      console.log(err)
    })
  }
  updateUser(update: boolean) {
    let data = {
      accountStatus: update ? 'limit_pending' : 'kyc_pending',
      userId: this.userDetails.id
    }
    this.registrationService.updateUserStatus(data).subscribe((res: any) => {
      if (res.status == 200) {
        this.invoiceService.showNotification(update ? 'KYC Accepted' : 'KYC Rejected', update ? 'Customer KYC successfully accepted' : 'Customer KYC successfully rejected', 'notification-success');
        this.route.navigate(['/customer-information'])
      }
    }, (err: Error) => {
      console.log(err)
    })
  }

  updateList() {
    this.listUserDocuments()
  }

}
