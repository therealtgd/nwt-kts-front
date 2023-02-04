import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { ContextData } from '../dto/context-data';
import { getSession, getToken } from '../util/context';

@Injectable({
   providedIn: 'root'
})
export class AuthGuard implements CanActivate {

   constructor(private router: Router) { }

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      const url: string = this.getResolvedUrl(route);
      const roles: string[] = route.data['roles'];

      if (url.includes("login") || url.includes("register/client") || url.includes("password")) {
         return !this.isLoggedIn();
      }

      return this.isLoggedIn() && roles.includes(this.getRole());
   }

   private isLoggedIn(): boolean {
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

   private getRole(): string {
      const session: ContextData | undefined = getSession();
      if (session !== undefined) {
        return session.role;
      }
      return '';
   }
   
} 
