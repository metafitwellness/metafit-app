import { InvoiceService } from './../../services/invoice.service';
import { MatDialog } from '@angular/material/dialog';
import { UploadModalComponent } from './../../components/upload-modal/upload-modal.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-invoice-credit-system',
  templateUrl: './invoice-credit-system.component.html',
  styleUrls: ['./invoice-credit-system.component.scss']
})
export class InvoiceCreditSystemComponent implements OnInit {
  displayedColumns = ['ref_number', 'customer_name', 'invoice_number', 'invoice_amount', 'uploaded_on', 'invoice_status', 'payment_status'];
  dataSource: any = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  invoiceFilter: string = '';
  invoiceStatus: string = '';
  paymentStatus: string = '';
  invoiceData: any = '';

  isAdmin: boolean = false;

  constructor(public dialog: MatDialog, private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.isAdmin = JSON.parse(localStorage["logged"]).isAdmin;
    if(!this.isAdmin){
      this.displayedColumns.splice(1, 1);
    }
    this.getData();
  }

  getData() {
    let client = null;
    if(!this.isAdmin){
      client = JSON.parse(localStorage["logged"]).userData.id;
    }
    this.invoiceService.getInvoices(client).subscribe( (res: any) => {
      let dataString = JSON.stringify(res.data);
      if(res.status == 200){
        res.data.forEach( (item:any, index:any) => {
          if(item.invoiceStatus == 'deleted' && (Math.abs(Date.now() - new Date(item.deletedOn).getTime()) / 36e5) > 48 ){
            res.data.splice(1, index)
          }
        })
        this.dataSource = res.data;
        this.invoiceData = res.data;
        this.dataSource = new MatTableDataSource<any>(res.data);
        this.dataSource.paginator = this.paginator;
      }
    })
  }
  filterTable() {
    this.dataSource = new MatTableDataSource<any>(this.invoiceData);

    let tableData = this.dataSource.data.filter((e: any) => {
      let arr: boolean[] = [];
      if (this.invoiceFilter) {
        let arrx = this.invoiceFilter.toLowerCase();
        if (e.invoiceNo.toLowerCase().search(arrx) > -1 || e.referenceNo.toLowerCase().search(arrx) > -1) {
          arr.push(true);
        } else {
          arr.push(false);
        }
      }
      if (this.invoiceStatus) {
        if (this.invoiceStatus.replace(new RegExp(' ', 'g'), '_').toLowerCase().search(e.invoiceStatus.toLowerCase()) != -1) {
          arr.push(true);
        } else {
          arr.push(false);
        }
      }
      if (this.paymentStatus) {
        if (e.paymentStatus != null && this.paymentStatus.toLowerCase().search(e.paymentStatus.toLowerCase()) != -1) {
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
    this.invoiceFilter = '';
    this.invoiceStatus = '';
    this.paymentStatus = '';
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
        this.invoiceService.addInvoice(data).subscribe((res:any) => {
          if(res.data == 'Success'){
            this.getData();
            this.invoiceService.showNotification('Invoice uploaded', 'Invoice successfully added', 'notification-success');
          }else{
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

}
