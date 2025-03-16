import { UsersService } from './../../services/users.service';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit, AfterViewInit {
  userData: any = {};

  displayedColumns: string[] = ['sno', 'roomType', 'noOfRooms', 'roomRent', 'isAvailable', 'actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  newRoom: any = {
    roomType: '',
    noOfRooms: 0,
    roomRent: 0,
    isAvailable: '0',
    active: 1
  };

  roomTypes: any[] = [];

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.userData = this.usersService.getData('userData');

    this.usersService.getRoomTypes().subscribe((data: any) => {
      if (data.status == 200) {
        this.roomTypes = data.data;
      }
    });

    this.getRooms();
  }

  ngAfterViewInit() {
    // Ensure sort and paginator are applied after view is initialized
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getRooms() {
    this.usersService.getRooms(this.userData.id).subscribe((data: any) => {
      if (data.status == 200) {
        this.dataSource.data = data.data; // Correct assignment to the dataSource's data
      }
    });
  }

  saveRoom() {
    if (!this.newRoom.roomType || !this.newRoom.noOfRooms || !this.newRoom.roomRent) {
      alert('Please fill all required fields.');
      return;
    }

    this.newRoom.hotelId = this.userData.id;

    if (this.newRoom.id) {
      this.usersService.updateRoom(this.newRoom, this.newRoom.id).subscribe(response => {
        this.resetForm();
        this.getRooms();
      });
    } else {
      this.usersService.addRoom(this.newRoom).subscribe(response => {
        this.resetForm();
        this.getRooms();
      });
    }
  }

  editRoom(room: any) {
    this.newRoom = { ...room };
  }

  resetForm() {
    this.newRoom = {
      roomType: '',
      noOfRooms: 0,
      roomRent: 0,
      isAvailable: true,
      active: true
    };
  }

  // Apply filter on input change
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); // This triggers filtering
  }
}
