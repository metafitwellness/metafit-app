import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-wizard-steps',
  templateUrl: './wizard-steps.component.html',
  styleUrls: ['./wizard-steps.component.scss']
})
export class WizardStepsComponent implements OnInit {
  @Input() steps: any;
  @Input() activeStep: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
