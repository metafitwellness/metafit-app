import { UsersService } from './../../services/users.service';
import { InvoiceService } from './../../services/invoice.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userDetails: any = '';

  usedLimit: any = 0;
  availableLimit: any = 0;
  totalLimit: any = 0;
  usedPer: any = 0;

  loanAmount: any = 0;
  totalCustomers: any = 0;

  invoices:any = [];

  isAdmin:boolean = false;
  userEnabled: boolean = true;

  constructor(private invoiceService: InvoiceService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.userDetails = this.usersService.getData('userData');

    this.isAdmin = this.userDetails.admin == 1 ? true : false;
    this.totalLimit = this.userDetails.creditLimit;

    if(this.isAdmin){
      // this.loadAdminDashboard();
    }else{
      if(this.userDetails.accountStatus == 'active'){
        // this.loadDashboard();
      }else{
        this.userEnabled = false;
      }
    }
  }
  loadDashboard() {
    this.invoiceService.loadDashboard(this.userDetails.id).subscribe((res: any) => {
      if(res.status == 200){
        this.invoices = res.res.invoices;
        this.usedLimit = res.res.usedLimit;
        this.calculateChart();
      }
    });
  }
  loadAdminDashboard() {
    this.invoiceService.loadAdminDashboard().subscribe((res: any) => {
      if(res.status == 200){
        console.log(res)
        this.totalCustomers = res.res.activeCustomers;
        this.loanAmount = res.res.loanAmount;
      }
    })
  }
  calculateChart(){
    this.availableLimit = this.totalLimit - this.usedLimit;
    this.usedPer = (this.usedLimit / this.totalLimit) * 100;
    if (this.usedPer > 100) {
      this.usedPer = 100;
    }
  }

}
