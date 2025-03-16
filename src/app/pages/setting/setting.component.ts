import { InvoiceService } from './../../services/invoice.service';
import { CreateUserModalComponent } from './../../components/create-user-modal/create-user-modal.component';
import { UsersService } from './../../services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  displayedColumns = ['customer_name', 'designatory', 'country', 'currency', 'credit_limit', 'expiry_date', 'email_id', 'status'];
  dataSource: any = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;


  searchFilter: string = '';
  usersData: any = [];
  clientId: number = 0;

  constructor(public dialog: MatDialog, private userService: UsersService, private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.clientId = JSON.parse(localStorage["logged"]).userData.id;
    this.getData()
  }


  getData() {
    this.userService.getUsers().subscribe((res: any) => {
      let dataString = JSON.stringify(res.data);
      if (res.status == 200) {
        this.dataSource = res.data;
        this.usersData = res.data;
        this.dataSource = new MatTableDataSource<any>(res.data);
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  addUser() {
    let dialogRef = this.dialog.open(CreateUserModalComponent, {
      data: { 'title': 'invoice', 'inputTitle': 'Invoice Number' }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result.status) {
        this.invoiceService.showNotification('User added', 'New user successfully added', 'notification-success');
      }
    });
  }


  filterTable() {

  }

  clearAllFilters() {
    this.searchFilter = '';
    this.filterTable();
  }

  updateStatus(data: any) {
    this.userService.updateUser(data).subscribe((data: any) => {
      this.invoiceService.showNotification('User status updated', 'User status successfully updated', 'notification-success');
    })
  }
}
