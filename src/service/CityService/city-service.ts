import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CityModelRead } from '../../model/CityModel/city-model-read';
import { CityModelCreate } from '../../model/CityModel/city-model-create';
import { CityModelUpdate } from '../../model/CityModel/city-model-update';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private backUrl="http://localhost:5009/api/City"
  constructor(private http: HttpClient){}

  getAllCity(): Observable<CityModelRead[]>{
    return this.http.get<CityModelRead[]>(this.backUrl)
  }
  getByIdCity(id: number): Observable<CityModelRead>{
    return this.http.get<CityModelRead>(`${this.backUrl}/${id}`)
  }
  createCity(city: CityModelCreate): Observable<CityModelCreate>{
    return this.http.post<CityModelCreate>(this.backUrl, city)
  }
  updateCity(id: number, city: CityModelUpdate): Observable<CityModelUpdate>{
    return this.http.put<CityModelUpdate>(`${this.backUrl}/${id}`, city)
  }
  deleteCity(id: number): Observable<void>{
    return this.http.delete<void>(`${this.backUrl}/${id}`)
  }
}
