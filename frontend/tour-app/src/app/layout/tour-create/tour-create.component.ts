import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { CreateTourDTO, TourDifficulty } from 'src/app/models/tour.model';

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
      const tags = this.tourForm.value.tags.split(',').map((tag: string) => tag.trim());
      const payload: CreateTourDTO = {
        title: this.tourForm.value.title,
        description: this.tourForm.value.description,
        difficulty: TourDifficulty[this.tourForm.value.difficulty as keyof typeof TourDifficulty],
        tags: tags
      }
      this.tourService.createTour(payload).subscribe((newTour) => {
        this.router.navigate(['/tour/edit', newTour.id]);
      });
    }
  }
}
