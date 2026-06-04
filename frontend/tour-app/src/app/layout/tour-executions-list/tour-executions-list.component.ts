import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TourExecutionService } from '../../services/tour-execution.service';
import { TourExecutionDTO } from '../../models/tour-execution.model';

@Component({
  selector: 'xp-tour-executions-list',
  templateUrl: './tour-executions-list.component.html',
  styleUrls: ['./tour-executions-list.component.css']
})
export class TourExecutionsListComponent implements OnInit {
  executions: TourExecutionDTO[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private tourExecutionService: TourExecutionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTourExecutions();
  }

  loadTourExecutions(): void {
    this.tourExecutionService.getMyTourExecutions().subscribe({
      next: (data: TourExecutionDTO[]) => {
        this.executions = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Greška pri učitavanju egzekucija:', err);
        this.errorMessage = 'Nije moguće učitati vaše ture. Pokušajte ponovo kasnije.';
        this.isLoading = false;
      }
    });
  }

  resumeTour(executionId: string): void {
    // Navigacija na stranicu gde se izvršava tura i prikazuje mapa
    this.router.navigate(['/tour-execution', executionId]);
  }

  getStatusClass(status: string): string {
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'status-active';
      case 'COMPLETED': return 'status-completed';
      case 'ABANDONED': return 'status-abandoned';
      default: return '';
    }
  }
}