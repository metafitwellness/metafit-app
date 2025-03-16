import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    // Check if required fields exist and if admin is '1'
    if (userData.id && userData.name && userData.phoneNumber && (userData.admin === '1' || userData.admin === 1)) {
      // All conditions are met, allow access
      return true;
    } else {
      // If any condition fails, redirect to an error or login page
      this.router.navigate(['/login']); // or '/login' or wherever you need to redirect
      return false;
    }
  }
}
