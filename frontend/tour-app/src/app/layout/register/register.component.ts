import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Registration } from '../../models/registration.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registrationForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    role: new FormControl('TOURIST', [Validators.required])
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {
    if (this.registrationForm.valid) {
      const registration: Registration = {
        username: this.registrationForm.value.username || '',
        email: this.registrationForm.value.email || '',
        password: this.registrationForm.value.password || '',
        role: this.registrationForm.value.role || 'TOURIST',
      };

      this.authService.register(registration).subscribe({
        next: () => {
          // After successful registration, route to login or home
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration failed', err);
        }
      });
    }
  }
}
