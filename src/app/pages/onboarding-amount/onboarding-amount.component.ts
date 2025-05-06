import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from '../../services/users.service'; // Assume you have UsersService for API calls

@Component({
  selector: 'app-onboarding-amount',
  templateUrl: './onboarding-amount.component.html',
  styleUrls: ['./onboarding-amount.component.scss']
})
export class OnboardingAmountComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['hotelName', 'plan', 'subscriptionID', 'planId', 'dateAdded', 'status']; // Adjust columns as needed
  dataSource = new MatTableDataSource<any>(); // Declare with type any

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    // Fetch data from your API
    this.usersService.get_onboarding_data().subscribe((res: any) => {
      const data = res.data; // Assume API response has a 'data' field containing the array

      // Optionally modify the data, e.g., set specific values
      data.map((d: any) => {
        d.plan = d.plan || 'Default Plan'; // You can customize data mapping if needed
      });

      // Assign the fetched data to the dataSource
      this.dataSource.data = data;

      // Set up pagination and sorting after data is assigned
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    // After the view is initialized, set paginator and sort for MatTableDataSource
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    // Apply filter for mat-table
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
