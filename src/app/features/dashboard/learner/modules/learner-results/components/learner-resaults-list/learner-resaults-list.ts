import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ResultsService } from '../../../../../instructor/modules/results/services/results.service';
import { PageLayout } from '../../../../../../../shared/layouts/page-layout/page-layout';
import { Loader } from '../../../../../../../shared/components/general/loader/loader';
import { EmptyStateComponent } from '../../../../../../../shared/components/general/empty-state/empty-state.component';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'quiz-app-learner-resaults-list',
  imports: [
    DatePipe,
    TranslatePipe,
    PageLayout,
    Loader,
    EmptyStateComponent,
    TableModule,
    Button,
    RouterLink,
  ],
  templateUrl: './learner-resaults-list.html',
  styleUrl: './learner-resaults-list.scss',
})
export class LearnerResaultsList implements OnInit {
  private resultsService = inject(ResultsService);

  allResults = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  studentResults = computed(() => {
    return this.allResults().map((item) => {
      return {
        quiz: item.quiz,
        score: item.result?.score ?? 0,
        myParticipantData: item.result,
      };
    });
  });

  ngOnInit(): void {
    this.fetchResults();
  }

  fetchResults(): void {
    this.isLoading.set(true);

    this.resultsService.getAllResults().subscribe({
      next: (res: any) => {
        const data = res?.data || res || [];
        this.allResults.set(data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }
}
