import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { BlogService, Blog, Comment } from '../../services/blog.service';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.css']
})
export class BlogCardComponent implements OnInit, OnChanges {
  @Input() blog!: Blog;

  @Input() likedBlogIds: string[] = [];
  @Input() currentUserId: string = '';
  isOwner: boolean = false;

  expanded: boolean = false;
  liked: boolean = false;
  likeCount: number = 0;
  commentCount: number = 0;

  comments: Comment[] = [];
  commentsLoaded: boolean = false;
  newCommentText: string = '';

  isFollowing: boolean = false;

  editingCommentId: string | null = null;
  editingCommentText: string = '';

  showDeleteBlogModal: boolean = false;
  showDeleteCommentModal: boolean = false;
  showUnfollowModal: boolean = false;
  commentToDelete: string | null = null;

  blogAuthor: any = null;
  commentAuthors: { [userId: string]: any } = {};

  editingBlog: boolean = false;
  editTitle: string = '';
  editDescription: string = '';

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.isOwner = this.currentUserId === this.blog.userId;
    this.liked = this.likedBlogIds.includes(this.blog.id);
    this.loadLikes();
    this.loadCommentCount();
    this.loadBlogAuthor();
    if (!this.isOwner) {
      this.loadFollowingState();
    }
  }

  ngOnChanges(): void {
    this.isOwner = this.currentUserId === this.blog.userId;
  }

  loadLikes(): void {
    this.blogService.getLikes(this.blog.id).subscribe({
      next: (res) => {
        this.likeCount = res.total ?? res.count ?? res.likes ?? 0;
      }
    });
  }

  loadBlogAuthor(): void {
    this.blogService.getUser(this.blog.userId).subscribe({
      next: (user) => {
        console.log('blog author', user);
        this.blogAuthor = user;
      }
    });
  }

  loadCommentAuthors(): void {
    const uniqueUserIds = [...new Set(this.comments.map(c => c.user_id))];
    uniqueUserIds.forEach(userId => {
      if (!this.commentAuthors[userId]) {
        this.blogService.getUser(userId).subscribe({
          next: (user) => { this.commentAuthors[userId] = user; }
        });
      }
    });
  }

  loadCommentCount(): void {
    this.blogService.getCommentCount(this.blog.id).subscribe({
      next: (res) => {
        this.commentCount = res.total ?? 0;
      }
    });
  }

  loadFollowingState(): void {
    this.blogService.getFollowing(this.currentUserId).subscribe({
      next: (res) => {
        const following: string[] = res.following ?? res ?? [];
        this.isFollowing = following.includes(this.blog.userId);
      }
    });
  }

  toggleExpand(): void {
    this.expanded = !this.expanded;
    if (this.expanded && !this.commentsLoaded) {
      this.loadComments();
    }
  }

  loadComments(): void {
    this.blogService.getComments(this.blog.id).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.commentsLoaded = true;
        this.loadCommentAuthors();
      }
    });
  }

  toggleLike(): void {
    if (this.liked) {
      this.blogService.unlikeBlog(this.blog.id).subscribe({
        next: () => { this.liked = false; this.likeCount--; }
      });
    } else {
      this.blogService.likeBlog(this.blog.id).subscribe({
        next: () => { this.liked = true; this.likeCount++; }
      });
    }
  }

  submitComment(): void {
    if (!this.newCommentText.trim()) return;
    this.blogService.addComment(this.blog.id, this.newCommentText).subscribe({
      next: () => {
        this.newCommentText = '';
        this.loadComments();
        this.blogService.getCommentCount(this.blog.id).subscribe({
          next: (res) => this.commentCount = res.total ?? 0
        });
      }
    });
  }

  startEditComment(comment: Comment): void {
    this.editingCommentId = comment._id;
    this.editingCommentText = comment.text;
  }

  saveEditComment(comment: Comment): void {
    this.blogService.editComment(comment._id, this.editingCommentText).subscribe({
      next: () => {
        comment.text = this.editingCommentText;
        this.editingCommentId = null;
      }
    });
  }

  cancelEditComment(): void {
    this.editingCommentId = null;
  }

  confirmDeleteComment(commentId: string): void {
    this.commentToDelete = commentId;
    this.showDeleteCommentModal = true;
  }

  deleteComment(): void {
    if (!this.commentToDelete) return;
    this.blogService.deleteComment(this.commentToDelete).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c._id !== this.commentToDelete);
        this.commentCount--;
        this.showDeleteCommentModal = false;
        this.commentToDelete = null;
      }
    });
  }

  toggleFollow(): void {
    if (this.isFollowing) {
      this.showUnfollowModal = true;
    } else {
      this.blogService.followUser(this.blog.userId).subscribe({
        next: () => { this.isFollowing = true; }
      });
    }
  }

  confirmUnfollow(): void {
    this.blogService.unfollowUser(this.blog.userId).subscribe({
      next: () => {
        this.isFollowing = false;
        this.showUnfollowModal = false;
      }
    });
  }

  startEditBlog(): void {
    this.editingBlog = true;
    this.editTitle = this.blog.title;
    this.editDescription = this.blog.description;
  }

  saveEditBlog(): void {
    this.blogService.editBlog(this.blog.id, {
      title: this.editTitle,
      description: this.editDescription
    }).subscribe({
      next: () => {
        this.blog.title = this.editTitle;
        this.blog.description = this.editDescription;
        this.editingBlog = false;
      }
    });
  }

  cancelEditBlog(): void {
    this.editingBlog = false;
  }

  deleteBlog(): void {
    this.blogService.deleteBlog(this.blog.id).subscribe({
      next: () => {
        this.showDeleteBlogModal = false;
      }
    });
  }
}
