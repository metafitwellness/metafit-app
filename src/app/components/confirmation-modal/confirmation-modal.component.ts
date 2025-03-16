import { Component, OnInit, Inject, OnChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  reason: string = '';
  custom: boolean = false;
  confirmButtonText: string = 'Confirm';
  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnChanges() :void{
    if (this.data.status != 'reject') {
      this.reason = 'accepted';
    }
  }

  ngOnInit(): void {
    console.log(this.data)
    if(this.data.custom){
      this.custom = this.data.custom;
    }
    if(this.data.confirmButtonText){
      this.confirmButtonText = this.data.confirmButtonText
    }
  }
  confirm() {
    this.dialogRef.close({ 'status': true, 'reason': this.reason });
  }
}
