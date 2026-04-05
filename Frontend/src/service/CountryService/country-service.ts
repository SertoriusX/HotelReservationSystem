import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CountryModelRead } from '../../model/CountryModel/country-model-read';
import { CountryModelCreate } from '../../model/CountryModel/country-model-create';
import { CountryModelUpdate } from '../../model/CountryModel/country-model-update';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private backUrl="http://localhost:5009/api/Country"
  constructor(private http: HttpClient){}
  getAllCountry(): Observable<CountryModelRead[]>{
    return this.http.get<CountryModelRead[]>(this.backUrl)
  }
  getByIdCountry(id: number): Observable<CountryModelRead>{
    return this.http.get<CountryModelRead>(`${this.backUrl}/${id}`)
  }
  createCountry(addCountry: CountryModelCreate): Observable<CountryModelCreate>{
    return this.http.post<CountryModelCreate>(this.backUrl, addCountry)
  }
  updateCountry(id: number, updateCountry: CountryModelUpdate): Observable<CountryModelUpdate>{
    return this.http.put<CountryModelUpdate>(`${this.backUrl}/${id}`, updateCountry)
  }
  deleteCountry(id: number): Observable<void>{
    return this.http.delete<void>(`${this.backUrl}/${id}`)
  }
}
