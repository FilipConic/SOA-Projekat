import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TourService } from "src/app/services/tour.service";
import { CreateReviewDTO, ReviewTour } from "src/app/models/tour.model";

@Component({
  selector: 'app-tour-review',
  templateUrl: './tour-review.component.html',
  styleUrls: ['./tour-review.component.css']
})
export class ReviewTourComponent implements OnInit {

  @Input() tourID: string = '';

  reviewForm!: FormGroup;
  reviews: ReviewTour[] = [];
  selectedImages: string[] = [];
  currentUserID = this.getUserIDFromToken();

  constructor(
    private fb: FormBuilder,
    private tourService: TourService
  ) {}

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required],
      visitDate: ['', Validators.required]
    });

    this.loadReviews();
  }

  loadReviews(): void {
    this.tourService.getReviewsByTour(this.tourID).subscribe({
      next: (res) => {
        this.reviews = res;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onImagesSelected(event: any): void {
    const files = event.target.files;
    this.selectedImages = [];

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImages.push(reader.result as string);
      };
      reader.readAsDataURL(files[i]);
    }
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const review: CreateReviewDTO = {
      tourist_id: this.getUserIDFromToken(),
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment,
      visit_date: new Date(this.reviewForm.value.visitDate).toISOString(),
      images: this.selectedImages
    };

    this.tourService.addReview(this.tourID, review).subscribe({
      next: () => {
        this.reviewForm.reset({
          rating: 5,
          comment: '',
          visitDate: ''
        });
        this.selectedImages = [];
        this.loadReviews();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getStars(rating: number): number[] {
    return Array(rating || 0).fill(0);
  }

  deleteReview(reviewID: string): void {
    this.tourService.deleteReview(reviewID).subscribe({
        next: () => this.loadReviews(),
        error: (err) => console.error('Failed to delete review:', err)
    });
  }


  getUserIDFromToken(): string {
    const token = localStorage.getItem('access-token');
    if(!token) {return '';}

    try{
        const payload = JSON.parse(atob(token.split('.')[1]));

        return payload.user_id || '';

    }catch{
        return '';
    }
  }

}