import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IMenu } from '../../../interfaces/menu';

@Injectable({
  providedIn: 'root'
})

export class MenuService {
  private apiUrl = `${environment.HOST_URL}api/menus/`;
  constructor(private http: HttpClient) { }

  getMenuItems(): Observable<IMenu[]> {
    return this.http.get<IMenu[]>(this.apiUrl).pipe(
      map((backendItems: IMenu[]) => {
        return backendItems.map((item: any) => ({
          id: item.MN_Id,
          name: item.MN_Name,
          path: item.MN_Path,
          icon: item.MN_Icon,
          category: item.MN_Category,
        }))
      })
    );
  }

  getMenuItem(id: string): Observable<IMenu> {
    return this.http.get<IMenu>(`${this.apiUrl}/${id}`);
  }

  createMenu(menuData: IMenu): Observable<IMenu> {
    return this.http.post<IMenu>(this.apiUrl, menuData);
  }
}

