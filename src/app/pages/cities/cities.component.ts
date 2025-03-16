import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {
  cities: any = [];
  selectedCity: any = null;
  newCity = { city_name: '', state_id: null, active: 0 };
  states: any[] = [];

  displayedColumns: string[] = ['city_name', 'active', 'actions'];
  dataSource: MatTableDataSource<any>;

  constructor(private cityService: UsersService) { }

  ngOnInit(): void {
    this.loadCities();
  }

  loadCities() {
    this.cityService.getCities().subscribe((data: any) => {
      this.cities = data.city;
      this.states = data.state;
      this.dataSource = new MatTableDataSource(this.cities);
    });
  }

  addCity() {
    this.cityService.addCity(this.newCity).subscribe(response => {
      this.loadCities();
      this.newCity = { city_name: '', state_id: null, active: 0 };
    });
  }

  editCity(city: any) {
    this.newCity = { ...city };
    this.selectedCity = { ...city };
  }

  updateCity() {
    if (this.selectedCity) {
      this.cityService.updateCity(this.selectedCity.id, this.newCity).subscribe(response => {
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
