import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { SimpleUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FollowersService {
    private baseUrl = environment.apiHost + 'followers';
    private baseGrpcUrl = 'http://localhost:8080/v1/followers';
    constructor(private http: HttpClient) {}

    getRecommendations(): Observable<SimpleUser[]> {
        return this.http.get<SimpleUser[]>(`${this.baseUrl}/recommendations`);
    }

    followUser(userId: string): Observable<void> {
        return this.http.post<void>(`${this.baseGrpcUrl}/follow/${userId}`, {});
    }

    unfollowUser(userId: string): Observable<void> {
        return this.http.delete<void>(`${this.baseGrpcUrl}/unfollow/${userId}`, {});
    }
}
