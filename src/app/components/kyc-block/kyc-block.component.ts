import { KycDetailsComponent } from './../../pages/customer-information/kyc-details/kyc-details.component';
import { ConfirmationModalComponent } from './../confirmation-modal/confirmation-modal.component';
import { environment } from './../../../environments/environment';
import { FileViewerComponent } from './../file-viewer/file-viewer.component';
import { KycService } from './../../services/kyc.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UploadModalComponent } from '../upload-modal/upload-modal.component';

@Component({
  selector: 'app-kyc-block',
  templateUrl: './kyc-block.component.html',
  styleUrls: ['./kyc-block.component.scss']
})
export class KycBlockComponent implements OnInit {
  @Input() documents: any = [];
  @Input() accountStatus: string = '';
  @Output() updateList: EventEmitter<any> = new EventEmitter();
  @ViewChild(KycDetailsComponent) kycDetailsComponent: KycDetailsComponent;

  userDetails: any = '';
  userId: number = 0;
  expandedIndex: number = 0;
  uploadPath: string = environment.uploadPath;
  rejectReason: string | null = null;

  constructor(
    private dialog: MatDialog,
    private kycService: KycService
  ) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage["logged"]);
    this.userId = this.userDetails.userData.id;
  }

  doUpload(documentId: number) {
    let dialogRef = this.dialog.open(UploadModalComponent, {
      data: { 'title': 'invoice', 'inputTitle': 'disabled' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.status == "success") {
        let data = {
          'documentId': documentId,
          'documentPath': result.uploadFile,
          'userId': this.userId
        }
        this.kycService.saveDocument(data).subscribe(
          (res: any) => {
            this.updateList.emit();
          },
          (err: Error) => {
            console.log(err)
          }
        )
      } else {
        //Reject
      }
    });
  }

  removeDocument(documentId: number) {
    let dialogRef2 = this.dialog.open(ConfirmationModalComponent, {
      data: { 'title': 'Delete file?', 'custom': true, 'subText': 'Are you sure you want to delete the uploaded file?', 'confirmButtonText': 'Delete' }
    });
    dialogRef2.afterClosed().subscribe(result2 => {
      if (result2 !== undefined && result2.status == true) {
        let data = {
          'documentId': documentId,
          'userId': this.userId
        }
        this.kycService.removeDocument(data).subscribe(
          (res: any) => {
            this.updateList.emit();
          },
          (err: Error) => {
            console.log(err)
          }
        )
      }
    });
  }
  expandNext(i: number) {
    this.expandedIndex++;
  }

  openDialog(path: any) {
    const dialogRef = this.dialog.open(FileViewerComponent, {
      data: { 'file': this.uploadPath + path },
      height: '100vh',
      width: '100%',
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  confirmUpdateKyc(document: any, status: boolean) {

    let dialogRef2 = this.dialog.open(ConfirmationModalComponent, {
      data: { 'title': status ? 'Accept' : 'Reject' + ' Document?', 'custom': true, 'subText': status ? 'Are you sure you want to accept the document?' : 'Please enter valid reason to reject the document!', 'status': status ? 'accept' : 'reject', 'confirmButtonText': status ? 'Accpet KYC' : 'Reject' }
    });
    dialogRef2.afterClosed().subscribe(result2 => {
      if (result2 !== undefined && result2.status == true) {
        this.rejectReason = result2.reason
        this.updateKyc(document, status)
      }
    });
  }
  updateKyc(document: any, status: boolean) {
    let data = {
      userId: document.userDocument[0].userId,
      userDocumentId: document.userDocument[0].id,
      reason: this.rejectReason ? this.rejectReason : null,
      status: status ? 'approved' : 'rejected'
    }
    this.kycService.updateKyc(data).subscribe((res: any) => {
      if (res.status == 200) {
        this.updateList.emit();
      }
    }, (err: Error) => console.log(err))
  }
  downloadFile(path: string) {
    let filePath = this.uploadPath + path;
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.setAttribute('target', '_blank');
    link.href = filePath;
    link.download = path;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
