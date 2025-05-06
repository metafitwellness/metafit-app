
import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { MatTableDataSource } from '@angular/material/table';

declare const tinymce: any;

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'name', 'status', 'footer_status', 'action'];
  dataSource = new MatTableDataSource<any>();

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.userService.getBlogs().subscribe((res: any) => {
      this.dataSource.data = res.data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
