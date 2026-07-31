import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { finalize } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Loader } from '../../../../../../../shared/components/loader/loader';
import { ResultsService } from '../../services/results.service';
import { IResultsResponse } from '../../interfaces/results';
import { TableModule } from "primeng/table";
import { PageLayout } from "../../../../../../../shared/layouts/page-layout/page-layout";


@Component({
  selector: 'quiz-app-view-result',
  imports: [BreadcrumbModule, TranslatePipe, Loader, TableModule, PageLayout],
  templateUrl: './view-result.html',
  styleUrl: './view-result.scss',
})
export class ViewResult { private resultsService = inject(ResultsService);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);

  result = signal<IResultsResponse | null>(null);
  isLoading = signal(true);

  breadcrumbs: MenuItem[] = [];

  buildBreadcrumbs() {
    this.breadcrumbs = [
      {
        label: this.translate.instant('quiz_details.quizzes'),
        routerLink: ['/dashboard/instructor/results'],
      },
      {
        label: this.result()?.quiz.title ?? '',
      },
    ];
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.buildBreadcrumbs();
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.isLoading.set(false);
      return;
    }

    this.fetchAllResult(id);
  }

  fetchAllResult(id: string): void {
    this.isLoading.set(true);

    this.resultsService
      .getAllResults()
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (results) => {console.log('route id:', id);
  console.log('first result:', results[0]);

  const result = results.find(r => r.quiz._id === id);

  console.log('matched result:', result);

  if (result) {
    this.result.set(result);
  console.log('signal value:', this.result());
  this.buildBreadcrumbs();
  }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
 // ngOnInit(): void {
   //id router params
   //if id call endpoint for results
   // this.fetchAllresult(id)
  //}

  //fetchAllresult(id){
  // resultList.find(result => result.id === id)
  //}

