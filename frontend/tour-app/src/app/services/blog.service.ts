import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Blog {
  id: string;
  userId: string;
  title: string;
  description: string;
  images: string[];
}

export interface Comment {
  _id: string;
  blog_id: string;
  user_id: string;
  text: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private base = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getLikes(blogId: string): Observable<any> {
    return this.http.get(`${this.base}/api/blog/likes/${blogId}`);
  }

  getUserLikes(userId: string): Observable<any> {
    return this.http.get(`${this.base}/api/blog/likes/find_all/${userId}`);
  }

  createBlog(data: { title: string; description: string; user_id: string; images: string[] }): Observable<any> {
    return this.http.post(`${this.base}/v1/blog/new`, {
      user: {
        userId: data.user_id
      },
      title: data.title,
      description: data.description,
      images: data.images
    });
  }

  likeBlog(blogId: string): Observable<any> {
    return this.http.post(`${this.base}/api/blog/like/${blogId}`, {});
  }

  unlikeBlog(blogId: string): Observable<any> {
    return this.http.delete(`${this.base}/api/blog/rm_like/${blogId}`);
  }

  getCommentCount(blogId: string): Observable<any> {
    return this.http.get(`${this.base}/api/blog/comments/count/${blogId}`);
  }

  getComments(blogId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.base}/api/blog/comments/find_all/${blogId}`);
  }

  addComment(blogId: string, text: string): Observable<any> {
    return this.http.post(`${this.base}/api/blog/comments/new/${blogId}`, { text });
  }

  editComment(commentId: string, text: string): Observable<any> {
    return this.http.put(`${this.base}/api/blog/comments/edit/${commentId}`, { text });
  }

  deleteComment(commentId: string): Observable<any> {
    return this.http.delete(`${this.base}/api/blog/comments/delete/${commentId}`);
  }

  editBlog(blogId: string, data: Partial<Blog>): Observable<any> {
    return this.http.put(`${this.base}/api/blog/edit/${blogId}`, data);
  }

  deleteBlog(blogId: string): Observable<any> {
    return this.http.delete(`${this.base}/api/blog/delete/${blogId}`);
  }

  getFollowing(userId: string): Observable<any> {
    return this.http.get(`${this.base}/api/followers/following/${userId}`);
  }

  followUser(followedId: string): Observable<any> {
    return this.http.post(`${this.base}/api/followers/follow/${followedId}`, {});
  }

  unfollowUser(followedId: string): Observable<any> {
    return this.http.delete(`${this.base}/api/followers/unfollow/${followedId}`);
  }

  getAllBlogs(): Observable<any> {
    return this.http.get(`${this.base}/v1/blog/all`);
  }

  getUser(userId: string): Observable<any> {
    return this.http.get(`${this.base}/api/users/${userId}/`);
  }
}
