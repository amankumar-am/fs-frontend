import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IRole {
  RL_ID: number;
  RL_Name: string;
}

@Injectable({
  providedIn: 'root'
})

export class RoleService {
  private dataUrl = `${environment.HOST_URL}api/roles/`;
  constructor(private http: HttpClient) { }

  getRoleItems(): Observable<IRole[]> {
    return this.http.get<IRole[]>(this.dataUrl);
  }
}
