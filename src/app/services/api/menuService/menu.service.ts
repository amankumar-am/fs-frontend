import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IMenu, IUserMenu } from '../../../interfaces/menu';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = `${environment.HOST_URL}api/menus`; // Removed trailing slash
  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.currentToken;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  getUserMenuItems(): Observable<IUserMenu[]> {
    return this.http.get<IUserMenu[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      map((backendItems: any[]) => {
        return backendItems.map((item: any) => ({
          userId: item.USM_Id,
          userLoginId: item.USM_LoginID.trim(),
          userName: item.USM_Name.trim(),
          userEmail: item.USM_Email.trim(),
          userProfileImage: item.USM_ProfileImage.trim(),
          menuId: item.MN_Id,
          menuName: item.MN_Name.trim(),
          menuPath: item.MN_Path.trim(),
          menuIcon: item.MN_Icon.trim(),
          menuCategory: item.MN_Category,
          canAdd: item.RD_CanAdd,
          canDelete: item.RD_CanDelete,
          canUpdate: item.RD_CanUpdate,
          canView: item.RD_CanView,
        }));
      }),
      catchError(this.handleError)
    )
  }
  getMenuItems(): Observable<IMenu[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      map((backendItems: any[]) => {
        return backendItems.map((item: any) => ({
          id: item.MN_Id,
          name: item.MN_Name,
          path: item.MN_Path,
          icon: item.MN_Icon,
          category: item.MN_Category,
        }));
      }),
      catchError(this.handleError)
    );
  }

  getMenuItem(id: number): Observable<IMenu> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      map((item: any) => ({
        id: item.MN_Id,
        name: item.MN_Name,
        path: item.MN_Path,
        icon: item.MN_Icon,
        category: item.MN_Category,
      })),
      catchError(this.handleError)
    );
  }

  createMenu(menuData: IMenu): Observable<any> {
    const backendFormat = {
      MN_Name: menuData.name,
      MN_Path: menuData.path,
      MN_Icon: menuData.icon,
      MN_Category: menuData.category
    };

    return this.http.post(this.apiUrl, backendFormat, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateMenu(id: number, menuData: IMenu): Observable<any> {
    const backendFormat = {
      MN_Name: menuData.name,
      MN_Path: menuData.path,
      MN_Icon: menuData.icon,
      MN_Category: menuData.category
    };
    return this.http.put(`${this.apiUrl}/${id}`, backendFormat, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteMenuItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else if (error.error?.message) {
      // Server-side error with message
      errorMessage = error.error.message;
    } else if (error.message) {
      // Other error with message
      errorMessage = error.message;
    }
    return throwError(() => new Error(errorMessage));
  }

  checkMenuNameExists(menuName: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/checkNameExits/${menuName}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }
}