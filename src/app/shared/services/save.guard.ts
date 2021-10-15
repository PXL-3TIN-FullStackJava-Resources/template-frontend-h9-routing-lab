import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AddStudentComponent } from 'src/app/components/add-student/add-student.component';

@Injectable({
  providedIn: 'root'
})
export class SaveGuard implements CanDeactivate<unknown> {
  canDeactivate(
    component: AddStudentComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(component.addForm.dirty && !component.isSubmitted){
      return window.confirm("Unsaved changes, are you sure you want to leave?");
    }
    return true;
  }
  
}
