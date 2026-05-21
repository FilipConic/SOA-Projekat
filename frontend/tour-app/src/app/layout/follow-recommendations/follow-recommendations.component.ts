import { Component, OnInit } from '@angular/core';
import { FollowersService } from 'src/app/services/followers.service';
import { SimpleUser } from 'src/app/models/user.model';

@Component({
  selector: 'app-follow-recommendations',
  templateUrl: './follow-recommendations.component.html',
  styleUrls: ['./follow-recommendations.component.css']
})
export class FollowRecommendationsComponent implements OnInit {
  users: SimpleUser[] = [];
  isLoading = true;
  
  // Tracks followed user IDs locally to toggle button states instantly
  followedUserIds = new Set<string>();

  constructor(private followersService: FollowersService) {}

  ngOnInit() {
    this.followersService.getRecommendations().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching recommendations:', err);
        this.isLoading = false;
      }
    });
  }

  toggleFollow(user: SimpleUser) {
    const isFollowing = this.followedUserIds.has(user.id);

    if (isFollowing) {
      // If already followed, perform unfollow action
      this.followersService.unfollowUser(user.id).subscribe({
        next: () => {
          this.followedUserIds.delete(user.id);
          console.log(`Unfollowed ${user.username}`);
        },
        error: (err) => console.error(`Failed to unfollow ${user.username}:`, err)
      });
    } else {
      // If not followed, perform follow action
      this.followersService.followUser(user.id).subscribe({
        next: () => {
          this.followedUserIds.add(user.id);
          console.log(`Followed ${user.username}`);
        },
        error: (err) => console.error(`Failed to follow ${user.username}:`, err)
      });
    }
  }

  isUserFollowed(userId: string): boolean {
    return this.followedUserIds.has(userId);
  }
}