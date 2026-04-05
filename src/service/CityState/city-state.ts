import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CityState {
  cities = signal<{id: number, name: string}[]>([]);

  setCities(cities: {id: number, name: string}[]) {
    this.cities.set(cities);
  }

  getCities() {
    return this.cities();
  }
}
