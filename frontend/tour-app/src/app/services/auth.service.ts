import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { User } from "../models/user.model";
import { HttpClient } from "@angular/common/http";
import { TokenStorage } from "../infrastructure/auth/jwt/token.storage";
import { Router } from "@angular/router";
import { AuthResponse } from "../models/auth-response";
import { environment } from "src/env/environment";
import { Login } from "../models/login.model";
import { Registration } from "../models/registration.model";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    user$ = new BehaviorSubject<User>({id: '', email: '', username: ''});

    get currentUser(): User {
        return this.user$.value;
    }

    constructor(private http: HttpClient,
                private tokenStorage: TokenStorage,
                private router: Router) { }

    login(login: Login): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(environment.apiHost + 'auth/login', login)
            .pipe(
                tap(response => {
                    this.tokenStorage.saveToken(response.accessToken);
                    this.tokenStorage.saveRefreshToken(response.refreshToken);
                    this.setUser();
        }));
    }

    register(registration: Registration): Observable<string> {
        return this.http.post(environment.apiHost + 'users/', 
                registration,
                { responseType: 'text' }
            );
    }

    logout(): void {
        this.router.navigate(['/home']).then(_ => {
                this.tokenStorage.clear();
                this.user$.next({email: "", id: '', username: ""});
            }
        );
    }

    private setUser(): void {
        const jwtHelperService = new JwtHelperService();
        const accessToken = this.tokenStorage.getToken() || "";
        const decodedToken = jwtHelperService.decodeToken(accessToken);
        const user: User = {
            id: decodedToken.key,
            email: decodedToken.sub,
            username: decodedToken.username
        };

        this.user$.next(user);
    }

    checkIfUserExists(): void {
        const accessToken = this.tokenStorage.getToken();
        if (accessToken == null) {
            return;
        }
        this.setUser();
    }

    isLoggedIn(): boolean {
        const accessToken = this.tokenStorage.getToken();
        const refreshToken = this.tokenStorage.getRefreshToken();

        if (!accessToken && !refreshToken) {
            return false;
        }

        const jwtHelperService = new JwtHelperService();

        if (accessToken && !jwtHelperService.isTokenExpired(accessToken)) {
            return true;
        }

        if (refreshToken && !jwtHelperService.isTokenExpired(refreshToken)) {
            return true;
        }

        return false;
    }
}