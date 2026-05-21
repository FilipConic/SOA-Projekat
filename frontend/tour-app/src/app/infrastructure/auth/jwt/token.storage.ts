import { Injectable } from "@angular/core";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER } from "src/constants/constants";

@Injectable({
  providedIn: 'root'
})
export class TokenStorage {
  constructor() { }

  public saveToken(token: string): void {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.setItem(ACCESS_TOKEN, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  public saveRefreshToken(token: string): void {
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.setItem(REFRESH_TOKEN, token);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN); // Clean up on logout
    localStorage.removeItem(USER);
  }
}