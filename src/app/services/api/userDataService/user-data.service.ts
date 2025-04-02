import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'  // This service is provided at the root level
})
export class UserDataService {
  private dataUrl = `${environment.HOST_URL}users/`;  // The URL to the backend endpoint  
  constructor(private http: HttpClient) { }        // Inject HttpClient to make HTTP requests 
  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.dataUrl);    // Fetch data from the backend
  }
}