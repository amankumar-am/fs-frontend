import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RoleType {
  RoleID: number;
  Name: string;
}

@Injectable({
  providedIn: 'root'
})

export class RoleService {
  private dataUrl = `${environment.HOST_URL}roles/`;

  constructor(private http: HttpClient) { }

  getRoleItems(): Observable<RoleType[]> {
    return this.http.get<RoleType[]>(this.dataUrl);
  }
}
