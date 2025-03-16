import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-esign-modal',
  templateUrl: './esign-modal.component.html',
  styleUrls: ['./esign-modal.component.scss']
})
export class EsignModalComponent implements OnInit {
  eSignStatus: string = '';
  eSignData: string = '';
  constructor(
    public dialogRef: MatDialogRef<EsignModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.eSignStatus = this.data.type;
  }
  confirm() {
    this.dialogRef.close({ 'eSignStatus': this.eSignStatus, 'eSignData': this.eSignData });
  }

}

