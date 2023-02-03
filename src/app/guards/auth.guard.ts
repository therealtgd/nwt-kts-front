import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { ContextData } from '../dto/context-data';
import { getToken, getSession } from '../util/context';

@Injectable({
   providedIn: 'root'
})
export class AuthGuard implements CanActivate {

   constructor(private router: Router) { }

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      // handle logged in/out
      let url = this.getResolvedUrl(route);
      if (url.includes("login") || url.includes("register/client") || url.includes("password")) {
         return !this.isLoggedIn();
      }
      // handle roles
      return this.isLoggedIn();
   }

   private isLoggedIn(): boolean {
      if (getToken()) {
         return true;
      }
      return false;
   }

   private getRole(): string {
      const context: ContextData | undefined = getSession();
      if (context !== undefined) {
         return context.role;
      }
      return '';
   }

   private getResolvedUrl(route: ActivatedRouteSnapshot): string {
      return route.pathFromRoot
         .map(v => v.url.map(segment => segment.toString()).join('/'))
         .join('/');
   }
} 
