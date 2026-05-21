import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService, Blog } from '../../services/blog.service';
import { TokenStorage } from '../../infrastructure/auth/jwt/token.storage';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];
  loading: boolean = false;
  likedBlogIds: string[] | null = null;
  currentUserId: string = '';

  constructor(private blogService: BlogService, private tokenStorage: TokenStorage, private router: Router) {}

  ngOnInit(): void {
    this.decodeCurrentUser();
    this.loadLikesThenBlogs();
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

  loadLikes(): void {
    if (!this.currentUserId) return;
    this.blogService.getUserLikes(this.currentUserId).subscribe({
      next: (res: string[]) => {
        this.likedBlogIds = res ?? [];
      }
    });
  }

  loadLikesThenBlogs(): void {
    this.blogService.getUserLikes(this.currentUserId).subscribe({
      next: (res: string[]) => {
        this.likedBlogIds = res ?? [];
        this.loadBlogs();
      }
    });
  }

  loadBlogs(): void {
    this.loading = true;
    this.blogService.getAllBlogs().subscribe({
      next: (res) => {
        this.blogs = res.blogs ?? res ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onCreateClick(): void {
    this.router.navigate(['/blogs/create']);
  }
}
