import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { TokenStorage } from '../../infrastructure/auth/jwt/token.storage';

@Component({
  selector: 'app-blog-create',
  templateUrl: './blog-create.component.html',
  styleUrls: ['./blog-create.component.css']
})
export class BlogCreateComponent {
  title: string = '';
  description: string = '';
  images: string[] = [];
  currentUserId: string = '';
  submitting: boolean = false;
  error: string = '';

  constructor(
    private blogService: BlogService,
    private tokenStorage: TokenStorage,
    private router: Router
  ) {
    this.decodeCurrentUser();
  }


  private decodeCurrentUser(): void {
    const token = this.tokenStorage.getToken();
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUserId = payload.user_id;
    } catch {
      this.currentUserId = '';
    }
  }

  onSubmit(): void {
    console.log('submitting with userId', this.currentUserId);
    if (!this.title.trim() || !this.description.trim()) {
      this.error = 'Title and description are required.';
      return;
    }
    this.submitting = true;
    this.error = '';
    this.blogService.createBlog({
      title: this.title,
      description: this.description,
      user_id: this.currentUserId,
      images: this.images
    }).subscribe({
      next: () => {
        this.router.navigate(['/blogs']);
      },
      error: () => {
        this.error = 'Failed to create blog. Please try again.';
        this.submitting = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/blogs']);
  }
}
