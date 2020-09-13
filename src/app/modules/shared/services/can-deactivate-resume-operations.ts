import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export interface CanComponentDeactivate {
    isDataSaved: () => boolean;
  }

@Injectable()
export class CanDeactivateResume implements CanDeactivate<CanComponentDeactivate> {
    canDeactivate(component: CanComponentDeactivate, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean {
        if(nextState.url === '/dashboard/design-template' || nextState.url == '/dashboard/resume-operations') return true;

        return component.isDataSaved();
    }
}