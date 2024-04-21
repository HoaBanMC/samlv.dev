import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthGuard {
    constructor(private router: Router) { }

    canActivate(
        _router: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot
    ) {
        if (localStorage.getItem('token')) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}