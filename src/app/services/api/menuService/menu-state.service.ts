import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MenuStateService {
  private menuUpdated = new BehaviorSubject<void>(undefined);

  // Observable to subscribe to menu updates
  menuUpdated$ = this.menuUpdated.asObservable();

  // Call this after any CRUD operation
  notifyMenuUpdated() {
    this.menuUpdated.next();
  }
}