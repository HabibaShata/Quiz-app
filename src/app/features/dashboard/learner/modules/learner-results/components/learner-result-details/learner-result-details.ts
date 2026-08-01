import { Component, inject, signal } from '@angular/core';
import { PageLayout } from '../../../../../../../shared/layouts/page-layout/page-layout';
import { Loader } from '../../../../../../../shared/components/general/loader/loader';
import { TableModule } from 'primeng/table';
import { EmptyStateComponent } from '../../../../../../../shared/components/general/empty-state/empty-state.component';
import { ActivatedRoute } from '@angular/router';
import { ResultsService } from '../../../../../instructor/modules/results/services/results.service';
import { DatePipe } from '@angular/common';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'quiz-app-learner-result-details',
  imports: [
    DatePipe,
    PageLayout,
    Loader,
    TableModule,
    EmptyStateComponent,
    Breadcrumb,
    TranslatePipe,
  ],
  templateUrl: './learner-result-details.html',
  styleUrl: './learner-result-details.scss',
})
export class LearnerResultDetails {
  private route = inject(ActivatedRoute);
  private resultsService = inject(ResultsService);
  private translate = inject(TranslateService);

  isLoading = signal<boolean>(true);
  resultData = signal<any>(null);

  breadcrumbs: MenuItem[] = [];

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.buildBreadcrumbs();
    });

    const stateData = history.state?.resultData;

    if (stateData) {
      this.resultData.set(stateData);
      this.buildBreadcrumbs();
      this.isLoading.set(false);
    } else {
      const quizId = this.route.snapshot.paramMap.get('id');
      if (quizId) {
        this.fetchResultFromList(quizId);
      } else {
        this.isLoading.set(false);
      }
    }
  }

  buildBreadcrumbs(): void {
    const quizTitle = this.resultData()?.quiz?.title ?? '';

    this.breadcrumbs = [
      {
        label: this.translate.instant('result_details.results'),
        routerLink: ['/dashboard/learner/results'],
      },
      {
        label: quizTitle,
      },
    ];
  }

  fetchResultFromList(quizId: string): void {
    this.isLoading.set(true);

    this.resultsService.getAllResults().subscribe({
      next: (res: any) => {
        const list: any[] = res?.data || res || [];
        const matchedResult = list.find((item) => String(item.quiz?._id) === String(quizId));

        this.resultData.set(matchedResult || null);
        this.buildBreadcrumbs();
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }
}
