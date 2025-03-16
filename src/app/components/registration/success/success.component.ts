import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  @Input() title: string = 'Account created successfully!';
  constructor() { }

  ngOnInit(): void {
  }

}
