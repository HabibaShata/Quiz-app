import { Component, computed, inject, signal } from '@angular/core';
import { ResultsService } from '../../../../../instructor/modules/results/services/results.service';
import { PageLayout } from '../../../../../../../shared/layouts/page-layout/page-layout';
import { Loader } from '../../../../../../../shared/components/loader/loader';
import { EmptyStateComponent } from '../../../../../../../shared/components/empty-state/empty-state.component';
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
export class LearnerResaultsList {
  private resultsService = inject(ResultsService);
  private authService = inject(AuthService);

  allResults = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  currentStudentId = signal<string>(
    this.authService.getCurrentUser()?._id || this.getStudentIdFromToken(),
  );

  studentResults = computed(() => {
    const studentId = this.currentStudentId();
    if (!studentId) return [];

    return this.allResults()
      .map((quizResult) => {
        const myParticipantData = quizResult.participants?.find(
          (p: any) =>
            p.participant?._id === studentId || p.participant === studentId || p._id === studentId,
        );

        if (!myParticipantData) return null;

        return {
          quiz: quizResult.quiz,
          score: myParticipantData.score,
          myParticipantData,
        };
      })
      .filter((item) => item !== null);
  });

  ngOnInit(): void {
    this.fetchResults();
  }

  private getStudentIdFromToken(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try {
      const decoded: any = jwtDecode(token);
      return decoded.sub || decoded._id || decoded.userId || '';
    } catch {
      return '';
    }
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
  // isLoading = signal<boolean>(false);
  // resultsList = signal<IResultsResponse[]>([]);

  // ngOnInit(): void {
  //   this.fetchMyResults();
  // }

  // fetchMyResults() {
  //   this.isLoading.set(true);
  //   const currentUserId = this.authService.getCurrentUser()?._id;
  //   console.log(currentUserId);

  //   this.resultsService
  //     .getAllResults()
  //     .pipe(
  //       tap((results) => {
  //         console.log(results);
  //         const myResults = results.filter((result) =>
  //           result.participants.some((p: any) => p.participant === currentUserId),
  //         );
  //         this.resultsList.set(myResults);
  //       }),
  //     )
  //     .subscribe({
  //       next: () => this.isLoading.set(false),
  //       error: () => this.isLoading.set(false),
  //     });
  // }
}
