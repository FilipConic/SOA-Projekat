import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, throwError } from "rxjs";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { TokenStorage } from "./token.storage";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    // Tracks whether a token refresh operation is currently running
    private isRefreshing = false;
    // Holds the new token value once it arrives, releasing queued requests
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private tokenStorage: TokenStorage) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {
        
        const token = this.tokenStorage.getToken();
        const isRefreshRequest = request.url.includes('/api/auth/refresh');

        if (token && !isRefreshRequest) {
            request = this.addTokenHeader(request, token);
        }
        console.log("Intercepted request:", request);
        
        return next.handle(request).pipe(
            catchError((error) => {
                // If the error status code is 401, attempt to refresh tokens
                if (error instanceof HttpErrorResponse && error.status === 401 && !isRefreshRequest) {
                    return this.handle401Error(request, next);
                }
                return throwError(() => error);
            })
        );
    }

    // Helper method to clone requests and append the Bearer header
    private addTokenHeader(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            const refreshToken = this.tokenStorage.getRefreshToken();

            if (refreshToken) {
                const refreshRequest = new HttpRequest('POST', 'http://localhost:8080/api/auth/refresh', {
                    refresh: refreshToken
                });

                return next.handle(refreshRequest).pipe(
                    filter((event): event is HttpResponse<any> => event instanceof HttpResponse),
                    switchMap((response) => {
                        this.isRefreshing = false;

                        const newAccessToken = response.body.access;
                        this.tokenStorage.saveToken(newAccessToken);
                        
                        if (response.body.refresh) {
                            this.tokenStorage.saveRefreshToken(response.body.refresh);
                        }

                        // Release all queued requests with the new access token
                        this.refreshTokenSubject.next(newAccessToken);

                        // Retry the original request that failed with the fresh token
                        return next.handle(this.addTokenHeader(request, newAccessToken));
                    }),
                    catchError((err) => {
                        this.isRefreshing = false;
                        return throwError(() => err);
                    })
                );
            }
        }

        return this.refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((jwtToken) => next.handle(this.addTokenHeader(request, jwtToken)))
        );
    }
}