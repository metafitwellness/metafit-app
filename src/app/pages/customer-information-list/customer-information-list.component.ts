import { UsersService } from './../../services/users.service';
import { RegistrationService } from './../../services/registration.service';
import { InvoiceService } from './../../services/invoice.service';
import { MatDialog } from '@angular/material/dialog';
import { UploadModalComponent } from './../../components/upload-modal/upload-modal.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-customer-information-list',
  templateUrl: './customer-information-list.component.html',
  styleUrls: ['./customer-information-list.component.scss']
})
export class CustomerInformationListComponent implements OnInit {
  displayedColumns = ['businessName', 'emailId', 'registrationDate', 'last_transaction_date', 'applicationStatus', 'accountStatus'];
  dataSource: any = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  applicationFilter: string = '';
  applicationStatus: string = '';
  accountStatus: string = '';
  invoiceData: any = '';

  isAdmin: boolean = false;

  constructor(
    public dialog: MatDialog,
    private invoiceService: InvoiceService,
    private registrationService: RegistrationService,
    private userService: UsersService) { }

  ngOnInit(): void {
    this.isAdmin = JSON.parse(localStorage["logged"]).isAdmin;
    if (!this.isAdmin) {
      this.displayedColumns.splice(1, 1);
    }
    this.getData();
  }

  getData() {
    let client = null;
    let userData: any;
    this.userService.getUsers().subscribe((res: any) => {
      userData = res.data;
      this.registrationService.getUsers().subscribe((res: any) => {
        let dataString = JSON.stringify(res.data);
        if (res.status == 200) {
          res.data.forEach((item: any, index: any) => {
            userData.forEach((item1: any, index1: any) => {
              if (item.userId == item1.id) {
                item.status = item1.accountStatus
                item.active = item1.status
              }
            })
          })
          this.dataSource = res.data;
          this.invoiceData = res.data;
          this.dataSource = new MatTableDataSource<any>(res.data);
          this.dataSource.paginator = this.paginator;
        }
      })
    });
  }
  filterTable() {
    this.dataSource = new MatTableDataSource<any>(this.invoiceData);

    let tableData = this.dataSource.data.filter((e: any) => {
      let arr: boolean[] = [];
      if (this.applicationFilter) {
        let arrx = this.applicationFilter.toLowerCase();
        if (e.emailId.toLowerCase().search(arrx) > -1 || e.businessName.toLowerCase().search(arrx) > -1) {
          arr.push(true);
        } else {
          arr.push(false);
        }
      }
      if (this.applicationStatus) {
        if (this.applicationStatus.replace(new RegExp(' ', 'g'), '_').toLowerCase().search(e.status.toLowerCase()) != -1) {
          arr.push(true);
        } else {
          arr.push(false);
        }
      }
      if (this.accountStatus) {
        if (e.active != null && this.accountStatus.toLowerCase().search(e.active.toLowerCase()) != -1) {
          arr.push(true);
        } else {
          arr.push(false);
        }
      }
      return arr.every(element => element);
    });
    this.dataSource = new MatTableDataSource<any>(tableData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  clearAllFilters() {
    this.applicationFilter = '';
    this.applicationStatus = '';
    this.accountStatus = '';
    this.filterTable();
  }


  uploadInvoice() {
    let dialogRef = this.dialog.open(UploadModalComponent, {
      data: { 'title': 'invoice', 'inputTitle': 'Invoice Number' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.status == "success") {
        let data = {
          'invoiceNumber': result.inputValue,
          'invoice': result.uploadFile,
          'customerId': this.invoiceService.clientId
        }
        this.invoiceService.addInvoice(data).subscribe((res: any) => {
          if (res.data == 'Success') {
            this.getData();
            this.invoiceService.showNotification('Invoice uploaded', 'Invoice successfully added', 'notification-success');
          } else {
            this.invoiceService.showNotification('Something went wrong', 'Error occured while uploading invoice', 'notification-error');
          }
        }, (err: Error) => {
          console.log(err);
        })
      } else {
        //Reject
      }
    });
  }

  doUpload(documentId: number) {
    let dialogRef = this.dialog.open(UploadModalComponent, {
      data: { 'title': 'invoice', 'inputTitle': 'disabled' }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.status == "success") {
        let data = {
          'documentId': documentId,
          'documentPath': result.uploadFile,
        }
        console.log(result)
        // this.kycService.saveDocument(data).subscribe(
        //   (res: any) => {
        //     this.updateList.emit();
        //   },
        //   (err: Error) => {
        //     console.log(err)
        //   }
        // )
      } else {
        //Reject
      }
    });
  }

}
