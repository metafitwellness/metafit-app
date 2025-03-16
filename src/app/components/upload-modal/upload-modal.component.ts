import { InvoiceService } from './../../services/invoice.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, HostListener } from '@angular/core';

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss']
})
export class UploadModalComponent implements OnInit {
  uploadFile: string = '';
  inputValue: string = '';
  constructor(
    public dialogRef: MatDialogRef<UploadModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private invoiceSerice: InvoiceService) { }

  ngOnInit(): void {
  }
  confirm() {
    this.dialogRef.close({ 'status': 'success', 'uploadFile': this.uploadFile, 'inputValue': this.inputValue });
  }
  postFile(event: any, methodType = '') {
    let file = event.target.files;
    if(methodType == 'dragged'){
      file = event.dataTransfer.files[0];
    }else{
      file = event.target.files[0];
    }

    if (file.name.toLowerCase().includes('pdf') || file.name.toLowerCase().includes('jpg')) {
      this.invoiceSerice.uploadFile(file).subscribe((res: any) => {
        if (res.status == 200) {
          this.uploadFile = res.data.res.file_path;

          if(this.data.inputTitle == 'disabled'){
            this.inputValue = this.uploadFile;
          }

        } else {
          let msg = res.data.error.error.replace(/<\/?[^>]+(>|$)/g, "");
          this.invoiceSerice.showNotification('Error in file uploading', msg, 'notification-error');
        }
      })
    } else {
      this.invoiceSerice.showNotification('Error', 'Upload only pdf or jpg file', 'notification-error');
    }

  }


  @HostListener('dragover', ['$event']) dragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }
  // Dragleave Event
  @HostListener('dragleave', ['$event']) public dragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }
  // Drop Event
  @HostListener('drop', ['$event']) public drop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      this.postFile(event, 'dragged')
    }
  }
}

