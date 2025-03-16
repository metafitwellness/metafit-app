import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsersService } from './../../services/users.service';
import { HotelmodalComponent } from '../../components/hotelmodal/hotelmodal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-hotels-otp-pending',
  templateUrl: './hotels-otp-pending.component.html',
  styleUrls: ['./hotels-otp-pending.component.scss']
})
export class HotelsOtpPendingComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'hotelName', 'city_name', 'hotel_type', 'phoneNumber', 'referral', 'dateAdded'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getHotelList();
  }

  getHotelList() {
    this.usersService.getOtpPendingHotelsList().subscribe((res: any) => {
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
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    if (column === 'status') {
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        return parseInt(data.status) === parseInt(filter);
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
      console.log('Modal closed');
    });
  }

  getAccountStatus(status: string) {
    switch (status) {
      case 'active':
        return 'Subscribed';
      case 'profile-pending':
        return 'Profile Pending';
      case 'registered':
        return 'Not Subscribed';
      case 'expired':
        return 'Expired';
      default:
        return 'Unknown Status';
    }
  }
}
