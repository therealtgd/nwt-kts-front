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
      if (this.isLoggedIn()) {
         return true;
      }
      this.router.navigate(['/login']);

      return false;
   }

   public isLoggedIn(): boolean {
      if (getToken()) {
         return true;
      }
      return false;
   }
} 
