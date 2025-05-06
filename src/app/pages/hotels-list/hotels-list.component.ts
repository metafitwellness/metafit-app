import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsersService } from './../../services/users.service';
import { HotelmodalComponent } from '../../components/hotelmodal/hotelmodal.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { VendorEditModalComponent } from 'src/app/components/vendor-edit-modal/vendor-edit-modal.component';

@Component({
  selector: 'app-hotels-list',
  templateUrl: './hotels-list.component.html',
  styleUrls: ['./hotels-list.component.scss']
})
export class HotelsListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['sno', 'hotelName', 'city_name', 'hotel_type', 'phoneNumber', 'emailId', 'account_Status', 'hotelStatus', 'referral', 'dateAdded', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.getHotelList();
  }

  async ngAfterViewInit() {
    this.route.queryParams.subscribe(async (res: any) => {
      this.resetFilters();
      if (res.status) {
        this.applyColumnFilter({ value: res.status }, 'verificationStatus');
      }
      if (res.accountStatus) {
        this.applyColumnFilter({ value: res.accountStatus }, 'accountStatus');
      }
    });
  }

  resetFilters() {
    this.dataSource.filter = ''; // Clear the general filter

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reset to the first page
    }

    // Optionally, reset any filter input fields on the UI (if applicable)
  }

  getHotelList() {
    this.usersService.getVendorsList().subscribe((res: any) => {
      this.dataSource.data = res.data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyColumnFilter(value: any, column: string) {
    const filterValue = value.value;
    if (column === 'accountStatus') {
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        return data.accountStatus.toLowerCase() === filter.toLowerCase();
      };
      if (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }
    }
    if (column === 'verificationStatus') {
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        return data.verificationStatus.toLowerCase() === filter.toLowerCase();
      };
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openHotelModal(hotelData: any) {
    const dialogRef = this.dialog.open(HotelmodalComponent, {
      width: '80%',
      data: { hotelData: hotelData }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getHotelList();
    });
  }

  editHotelModal(hotelData: any) {
    const dialogRef = this.dialog.open(VendorEditModalComponent, {
      width: '80%',
      data: { hotelData: hotelData }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getHotelList();
    });
  }

  getAccountStatus(status: string) {
    switch (status) {
      case 'active':
        return 'Subscribed';
      case 'onboarded':
        return 'Onboarded - Profile Pending';
      case 'verification':
        return 'Profile Verification';
      case 'verified':
        return 'Verified - Subscription Pending';
      case 'registered':
        return 'Not Subscribed';
      case 'expired':
        return 'Expired';
      default:
        return 'Unknown Status';
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
