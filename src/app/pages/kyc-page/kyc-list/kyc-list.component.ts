import { UsersService } from './../../../services/users.service';
import { ConfirmationModalComponent } from './../../../components/confirmation-modal/confirmation-modal.component';
import { RegistrationService } from './../../../services/registration.service';
import { KycService } from './../../../services/kyc.service';
import { Route, Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-kyc-list',
  templateUrl: './kyc-list.component.html',
  styleUrls: ['./kyc-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class KycListComponent implements OnInit {
  documents: any = [];
  userDocuments: any = [];
  documentComplete: any = [];
  totalDocuments: number = 0;
  totalComplete: number = 0;
  userDetails: any = [];
  isRejected:boolean = false;


  constructor(
    private kycService: KycService,
    private registrationService: RegistrationService,
    private dialog: MatDialog,
    private invoiceService: InvoiceService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage["logged"]);
    this.listDocuments()
  }

  listDocuments() {
    this.kycService.listKycDocuments().subscribe((res: any) => {
      if (res.status == 200) {
        this.documents = res.data;
        this.listUserDocuments()
      }
    }, (err: Error) => {
      console.log(err)
    })
  }

  listUserDocuments() {
    this.totalDocuments = 0;
    this.totalComplete = 0;
    let userDetails = JSON.parse(localStorage["logged"]);
    let data = {
      'userId': userDetails.userData.id
    }
    this.kycService.getDocuments(data).subscribe((res: any) => {
      if (res.status == 200) {
        this.isRejected = false;
        this.userDocuments = res.data;
        this.documents.types.map((v: string) => {
          this.documentComplete[v] = 0;
        });
        this.documents.types.map((v: string) => {
          this.documents.data[v].map((data: any) => {
            this.totalDocuments++;
            data.userDocument = this.userDocuments.filter((doc: any) => {
              if (doc.documentId === data.id) {
                this.documentComplete[v]++;
                this.totalComplete++;
              }
              return doc.documentId === data.id;
            })
          })
        })
        this.userDocuments.map((doc: any) => {
          if (doc.status == "rejected") {
            this.isRejected = true;
          }
        })
      }
    }, (err: Error) => {
      console.log(err)
    })
  }

  updateUserStatus() {
    if (this.totalDocuments == this.totalComplete) {
      let userDetails = this.userDetails;
      let userId = userDetails.userData.id;
      let data = {
        accountStatus: 'kyc_processing',
        userId: userId
      }
      this.registrationService.updateUserStatus(data).subscribe((res: any) => {
        console.log(res)
        if (res.status == 200) {
          userDetails.userData.accountStatus = 'kyc_processing'

          localStorage["logged"] = JSON.stringify(userDetails)
        }
      }, (err: Error) => {
        console.log(err)
      })
    }
  }
  exitKyc(){
    let dialogRef2 = this.dialog.open(ConfirmationModalComponent, {
      data: { 'title': 'Exit KYC?', 'custom': true, 'subText': 'Are you sure you want to exit KYC?', 'subText2': 'The uploaded documents will be auto-saved!' , 'confirmButtonText': 'Exit KYC' }
    });
    dialogRef2.afterClosed().subscribe(result2 => {
      if (result2 !== undefined && result2.status == true) {
        this.invoiceService.logout();
        this.route.navigate(['/login'])
      }
    });
  }


}
