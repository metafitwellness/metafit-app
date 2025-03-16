import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.scss']
})
export class SegmentsComponent implements OnInit {
  cities: any = [];
  selectedCity: any = null;
  newCity = { segement: '', active: 1 };
  states: any[] = [];

  displayedColumns: string[] = ['city_name', 'actions'];
  dataSource: MatTableDataSource<any>;

  constructor(private cityService: UsersService) { }

  ngOnInit(): void {
    this.loadCities();
  }

  loadCities() {
    this.cityService.getSegments().subscribe((data: any) => {
      this.cities = data;
      this.dataSource = new MatTableDataSource(this.cities);
    });
  }

  addCity() {
    this.cityService.addSegment(this.newCity).subscribe(response => {
      this.loadCities();
      this.newCity = { segement: '', active: 0 };
    });
  }

  editCity(city: any) {
    this.newCity = { ...city };
    this.selectedCity = { ...city };
  }

  updateCity() {
    if (this.selectedCity) {
      this.cityService.updateSegment(this.selectedCity.id, this.newCity).subscribe(response => {
        this.loadCities();
        this.selectedCity = null;
      });
    }
  }

  deleteCity(id: number) {
    this.cityService.deleteCity(id).subscribe(response => {
      this.loadCities();
    });
  }
}
