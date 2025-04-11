// name-exists.validator.ts
import { Injectable } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, debounceTime, switchMap } from 'rxjs/operators';
import { MenuService } from '../../services/api/menuService/menu.service';

@Injectable({ providedIn: 'root' })
export class NameExistsValidator implements AsyncValidator {
    constructor(private apiService: MenuService) { }

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        return of(control.value).pipe(
            debounceTime(500), // wait for 500ms after the last change
            switchMap(name => {
                if (!name || name.length === 0) {
                    return of(null);
                }
                return this.apiService.checkNameExists(name).pipe(
                    map(exists => (exists ? { nameExists: true } : null)),
                    catchError(() => of(null))
                );
            })
        );
    }
}