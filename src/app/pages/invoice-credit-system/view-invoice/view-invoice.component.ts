import { UploadModalComponent } from './../../../components/upload-modal/upload-modal.component';
import { InvoiceService } from './../../../services/invoice.service';
import { EsignModalComponent } from './../../../components/esign-modal/esign-modal.component';
import { ConfirmationModalComponent } from './../../../components/confirmation-modal/confirmation-modal.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss']
})
export class ViewInvoiceComponent implements OnInit {
  invoiceReference: string = '';
  invoiceNumber: number = 0;
  invoiceData: any = '';
  isAdmin: boolean = false;
  uploadPath: string = environment.uploadPath;
  paymentDetails: string = '';

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.invoiceReference = this.route.snapshot.params['id'];
    this.isAdmin = JSON.parse(localStorage["logged"]).isAdmin;
    // this.approveInvoice('reject', '1234567')
    // this.eSignInvoice('2333');
    this.getData();
  }
  getData() {
    this.invoiceService.getInvoices(null, this.invoiceReference).subscribe((res: any) => {
      if (res.data[0] != undefined) {
        this.invoiceData = res.data[0]
        this.invoiceNumber = this.invoiceData.id;
        console.log(this.invoiceData)
        this.getPaymentDetails(this.invoiceData.id);
      } else {
        console.log("err");
      }
    });
  }
  approveInvoice(status: string, invoice: string) {
    let dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: { 'status': status, 'invoice': invoice }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.status == true) {
        let updateData = {
          'invoiceNumber': this.invoiceReference,
          'customerId': JSON.parse(localStorage["logged"])?.userData.id,
          'data': {}
        }
        if (status == 'accept') {
          let data = {
            'invoiceStatus': 'under-review',
            'acceptedOn': new Date().toJSON(),
            'lastUpdate': new Date().toJSON()
          }
          updateData.data = data;
          this.invoiceService.updateInvoice(updateData).subscribe((res: any) => {
            if (res.data == 'Success') {
              this.getData();
              this.invoiceService.showNotification('Invoice accepted', 'Invoice successfully accepted', 'notification-success');
            }
          })
        }
        if (status == 'reject') {
          let data = {
            'invoiceStatus': 'rejected',
            'rejectReason': result.reason
          }
          updateData.data = data;
          this.invoiceService.updateInvoice(updateData).subscribe((res: any) => {
            if (res.data == 'Success') {
              this.getData();
              this.invoiceService.showNotification(this.invoiceReference + ' rejected', 'Invoice successfully rejected', 'notification-error');
            }
          })
        }
      }
    });
  }
  eSignInvoice(invoice: string, type:string) {
    let dialogRef = this.dialog.open(EsignModalComponent, {
      data: { 'invoice': invoice, 'type':type }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.eSignStatus == "esign") {
        let data = {
          'invoiceNumber': this.invoiceReference,
          'customerId': JSON.parse(localStorage["logged"])?.userData.id,
          'data': {
            'eSign': result.eSignData,
            'lastUpdate': new Date().toJSON(),
            'invoiceStatus': 'completed',
            'eSignOn': new Date().toJSON(),
            'paymentStatus': 'pending',
            'revisedInvoiceUrl': this.invoiceData.revisedInvoiceUrl
          }
        }
        let dataESign = {
          'invoiceNumber': this.invoiceReference,
          'eSign': result.eSignData,
          'invoice': this.invoiceData.revisedInvoiceUrl
        }
        this.invoiceService.eSignInvoice(dataESign).subscribe((res2: any) => {
          data.data.revisedInvoiceUrl = res2.path;
          if (res2.data == 'Success') {
            this.invoiceService.updateInvoice(data).subscribe((res: any) => {
              console.log(res)
              if (res.data == 'Success') {
                this.getData();
                this.invoiceService.showNotification('eSign Completed', 'Revised Invoice Successfully E-Signed', 'notification-success');
              } else {
                this.invoiceService.showNotification('Something went wrong', 'Error occured while uploading revised invoice', 'notification-error');
              }
            }, (err: Error) => {
              this.invoiceService.showNotification('Something went wrong', 'Error occured while uploading revised invoice', 'notification-error');
            })
          } else {
            this.invoiceService.showNotification('Something went wrong', 'Error occured while uploading revised invoice', 'notification-error');
          }
        }, (err: Error) => {
          console.log(err)
          this.invoiceService.showNotification('Something went wrong', 'Error occured while uploading revised invoice', 'notification-error');
        })
      } else {
        //Reject
        if (result.eSignStatus == "rejesign") {
          let data = {
            'invoiceNumber': this.invoiceReference,
            'customerId': JSON.parse(localStorage["logged"])?.userData.id,
            'data': {
              'eSign': result.eSignData,
              'lastUpdate': new Date().toJSON(),
              'invoiceStatus': 'declined'
            }
          }
          this.invoiceService.updateInvoice(data).subscribe((res: any) => {
            if (res.data == 'Success') {
              this.getData();
              this.invoiceService.showNotification('eSign Declined', 'Revised Invoice Successfully Declined', 'notification-success');
            } else {
              this.invoiceService.showNotification('Something went wrong', 'Error occured while uploading revised invoice', 'notification-error');
            }
          }, (err: Error) => {
            console.log("Error");
          })
        }
      }
    });
  }


  uploadRevisedInvoice() {
    let dialogRef = this.dialog.open(UploadModalComponent, {
      data: { 'title': 'revised invoice', 'inputTitle': 'Invoice Amount', 'type': 'number' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.status == "success") {
        let data = {
          'invoiceNumber': this.invoiceReference,
          'customerId': JSON.parse(localStorage["logged"])?.userData.id,
          'data': {
            'invoiceAmount': result.inputValue,
            'revisedInvoiceUrl': result.uploadFile,
            'lastUpdate': new Date().toJSON(),
            'invoiceStatus': 'e-sign-pending'
          }
        }
        this.invoiceService.updateInvoice(data).subscribe((res: any) => {
          if (res.data == 'Success') {
            this.getData();
            this.invoiceService.showNotification('Revised Invoice uploaded', 'Revised Invoice successfully added', 'notification-success');
          } else {
            this.invoiceService.showNotification('Something went wrong', 'Error occured while uploading revised invoice', 'notification-error');
          }
        }, (err: Error) => {
          console.log("Error");
        })
      } else {
        //Reject
      }
    });
  }

  uploadPaymentDetails() {
    let dialogRef = this.dialog.open(UploadModalComponent, {
      data: { 'title': 'payment details', 'inputTitle': 'disabled' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.status == "success") {
        let data = {
          'invoiceNumber': this.invoiceReference,
          'customerId': JSON.parse(localStorage["logged"])?.userData.id,
          'data': {
            'paymentFile': result.inputValue,
            'lastUpdate': new Date().toJSON(),
            'paymentStatus': 'in-progress'
          }
        }
        this.invoiceService.updateInvoice(data).subscribe((res: any) => {
          if (res.data == 'Success') {
            let data2 = {
              'invoiceId': this.invoiceNumber,
              'invoice': result.inputValue
            }
            this.invoiceService.addPayment(data2).subscribe((res) => {
              this.getData();
              this.invoiceService.showNotification('Payment details uploaded', 'Payment details successfully uploaded', 'notification-success');
            })

          } else {
            this.invoiceService.showNotification('Something went wrong', 'Error occured while uploading payment details', 'notification-error');
          }
        }, (err: Error) => {
          console.log("Error");
        })
      } else {
        //Reject
      }
    });
  }

  closeInvoice() {
    let dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: { 'status': "Close", 'invoice': '' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.status == true) {
        let data = {
          'invoiceNumber': this.invoiceReference,
          'customerId': JSON.parse(localStorage["logged"])?.userData.id,
          'data': {
            'lastUpdate': new Date().toJSON(),
            'invoiceStatus': 'closed',
            'paymentStatus': 'completed'
          }
        }
        this.invoiceService.updateInvoice(data).subscribe((res: any) => {
          if (res.data == 'Success') {
            this.getData();
            this.invoiceService.showNotification('Revised Invoice uploaded', 'Revised Invoice successfully added', 'notification-success');
          } else {
            this.invoiceService.showNotification('Something went wrong', 'Error occured while uploading revised invoice', 'notification-error');
          }
        }, (err: Error) => {
          console.log("Error");
        })
      }
    });
  }

  deleteInvoice() {
    let dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: { 'status': "Delete", 'invoice': '' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.status == true) {
        let data = {
          'invoiceNumber': this.invoiceReference,
          'customerId': JSON.parse(localStorage["logged"])?.userData.id,
          'data': {
            'lastUpdate': new Date().toJSON(),
            'invoiceStatus': 'deleted',
            'paymentStatus': '',
            'deletedOn': new Date().toJSON()
          }
        }
        this.invoiceService.updateInvoice(data).subscribe((res: any) => {
          if (res.data == 'Success') {
            this.getData();
            this.invoiceService.showNotification('Invoice Deleted', 'Invoice deleted successfully', 'notification-success');
          } else {
            this.invoiceService.showNotification('Something went wrong', 'Error occured while uploading revised invoice', 'notification-error');
          }
        }, (err: Error) => {
          console.log("Error");
        })
      }
    });
  }

  getPaymentDetails(id:any){
    this.invoiceService.getPaymentData(id).subscribe( (res:any) => {
      this.paymentDetails = res.res.paymentDetails.paymentFile;
    })
  }
}
