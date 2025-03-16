import { UsersService } from './../../services/users.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-my-subscriptions',
  templateUrl: './my-subscriptions.component.html',
  styleUrls: ['./my-subscriptions.component.scss'],
})
export class MySubscriptionsComponent implements OnInit {
  displayedColumns: string[] = ['subscriptionID', 'plan', 'planId', 'dateAdded', 'status'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    const userData = this.usersService.getData('userData');
    this.usersService.get_subscriptions(userData.id).subscribe((res: any) => {
      const data = res.data;

      data.map((d: any) => {
        if (parseInt(userData.onboardingAmount) > 0) {
          // d.plan = 'Plan 1500';
        } else {
          d.plan = 'FREE';
        }
      })

      this.dataSource = res.data;
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
