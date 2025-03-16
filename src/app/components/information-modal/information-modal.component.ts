import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-information-modal',
  templateUrl: './information-modal.component.html',
  styleUrls: ['./information-modal.component.scss']
})
export class InformationModalComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<InformationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
    ){
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

  navigatePath(path: string = ''){
    if(path === 'close'){
      this.dialogRef.close();
      return;
    }
    this.router.navigateByUrl(path);
  }

}
