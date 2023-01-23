import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { getToken } from '../util/context';

@Injectable({
   providedIn: 'root'
})
export class AuthGuard implements CanActivate {

   constructor(private router: Router) { }

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      if (this.getResolvedUrl(route).includes("login") || this.getResolvedUrl(route).includes("register/client")) {
         return !this.isLoggedIn();
      }
      return this.isLoggedIn();
   }

   public isLoggedIn(): boolean {
      if (getToken()) {
         return true;
      }
      return false;
   }

   private getResolvedUrl(route: ActivatedRouteSnapshot): string {
      return route.pathFromRoot
          .map(v => v.url.map(segment => segment.toString()).join('/'))
          .join('/');
  }
} 
