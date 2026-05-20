import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  isGuide: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.checkIfUserExists();
    this.authService.user$.subscribe((user) => {
      // If the user has an ID or username, they are logged in
      this.isLoggedIn = !!user.id;
      this.isGuide = user.role === 'GUIDE';
    });
  }

  onProfileClick(): void {
    this.router.navigate(['/profile']);
  }

  onLoginClick(): void {
    this.router.navigate(['/login']);
  }

  onMyToursClick(): void {
    this.router.navigate(['/my-tours']);
  }

  onLogoutClick(): void {
    this.authService.logout();
  }
}
