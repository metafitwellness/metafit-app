import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-footerlink-manage',
  templateUrl: './footerlink-manage.component.html',
  styleUrls: ['./footerlink-manage.component.scss']
})
export class FooterlinkManageComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'name', 'url', 'status', 'footer_status', 'action'];
  dataSource = new MatTableDataSource<any>();

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.userService.getSeoPages().subscribe((res: any) => {
      this.dataSource.data = res.data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
