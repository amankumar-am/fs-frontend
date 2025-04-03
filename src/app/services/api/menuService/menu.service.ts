import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface MenuType {
  MenuID: number;
  Name: string;
  Path?: string;
  Icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private dataUrl = `${environment.HOST_URL}menus/`;  // The URL to the backend endpoint  
  constructor(private http: HttpClient) { }        // Inject HttpClient to make HTTP requests 
  // getData(): Observable<any[]> {
  //   return this.http.get<any[]>(this.dataUrl);    // Fetch data from the backend
  // }
  getMenuItems(): Observable<MenuType[]> {
    return this.http.get<MenuType[]>(this.dataUrl);
  }

  getMenuItem(id: string): Observable<MenuType> {
    return this.http.get<MenuType>(`${this.dataUrl}/${id}`);
  }
}

