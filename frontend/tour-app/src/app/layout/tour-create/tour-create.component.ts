import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TourService } from '../../services/tour.service';

@Component({
  selector: 'app-tour-create',
  templateUrl: './tour-create.component.html'
})
export class TourCreateComponent {
  tourForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tourService: TourService,
    private router: Router
  ) {
    this.tourForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      difficulty: ['Easy', Validators.required],
      tags: ['']
    });
  }

  onSubmit() {
    if (this.tourForm.valid) {
      this.tourService.createTour(this.tourForm.value).subscribe((newTour) => {
        // Redirect to the edit page with the new tour ID
        this.router.navigate(['/tour/edit', newTour.ID]);
      });
    }
  }
}