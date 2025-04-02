import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuDataService {
  private dataUrl = `${environment.HOST_URL}menus/`;  // The URL to the backend endpoint  
  constructor(private http: HttpClient) { }        // Inject HttpClient to make HTTP requests 
  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.dataUrl);    // Fetch data from the backend
  }
}
