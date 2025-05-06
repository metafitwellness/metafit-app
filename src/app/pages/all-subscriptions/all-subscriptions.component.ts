import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-all-subscriptions',
  templateUrl: './all-subscriptions.component.html',
  styleUrls: ['./all-subscriptions.component.scss']
})
export class AllSubscriptionsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['hotelName', 'subscriptionID', 'plan', 'planId', 'month_left', 'dateAdded', 'status'];
  dataSource = new MatTableDataSource<any>();  // Declare with type any

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    // Fetch the subscriptions data
    this.usersService.get_subscriptions_all().subscribe((res: any) => {
      const data = res.data;

      // Modify the data as needed (e.g., set plan values)
      // data.map((d: any) => {
      //   d.plan = 'Plan 1500';
      // });

      // Assign data to the MatTableDataSource
      this.dataSource.data = data;

      // Apply sorting and pagination
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    // Set paginator and sort after the view is initialized
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();  // Reset paginator to first page after filtering
    }
  }

  exportToPDF() {
    this.usersService.printPdf('reportBlock', 'Report', '', '', []);
  }

  printTableData() {
    this.usersService.printPdf('reportBlock', 'Report', '', '', [], true);
  }

  exportToExcel() {
    this.usersService.exportToExcel('reportBlock', 'Report');
  }
}
