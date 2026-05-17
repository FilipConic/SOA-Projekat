import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    user$ = new BehaviorSubject<User>({id: '', email: '', username: ''});
}