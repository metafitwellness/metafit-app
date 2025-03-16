import { Component, OnInit, Inject, OnChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-delete-modal',
  templateUrl: './user-delete-modal.component.html',
  styleUrls: ['./user-delete-modal.component.scss']
})
export class UserDeleteModalComponent implements OnInit {
  deleteType: string = 'invoice';

  constructor(
    public dialogRef: MatDialogRef<UserDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnChanges() :void{

  }

  ngOnInit(): void {
  }
  confirm() {
    this.dialogRef.close({ 'status': true, 'delete': this.deleteType });
  }
}
