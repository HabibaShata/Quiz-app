import { Component, computed, inject, signal } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { QuizzesService } from '../../services/quizzes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizDetails } from '../../interfaces/quiz';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { Delete } from '../../../../../../../shared/components/delete/delete/delete';
import { DeleteConfig } from '../../../../../../../shared/components/delete/interfaces/delete';
import { Loader } from '../../../../../../../shared/components/loader/loader';
import { finalize } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'quiz-app-view-quiz',
  imports: [
    BreadcrumbModule,
    CheckboxModule,
    ButtonModule,
    DatePipe,
    Delete,
    Loader,
    TranslatePipe,
  ],
  templateUrl: './view-quiz.html',
  styleUrl: './view-quiz.scss',
})
export class ViewQuiz {
  private quizzesService = inject(QuizzesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private messageService = inject(MessageService);
  quiz = signal<QuizDetails | null>(null);

  isLoading = signal(true);

  showDeleteDialog = signal(false);

  home!: MenuItem;
  breadcrumbs: MenuItem[] = [
    {
      label: 'Quizzes',
      routerLink: ['/dashboard/instructor/quizzes'],
    },
  ];

  buildBreadcrumbs() {
    this.breadcrumbs = [
      {
        label: this.translate.instant('quiz_details.quizzes'),
        routerLink: ['/dashboard/instructor/quizzes'],
      },
      {
        label: this.quiz()?.title ?? '',
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

    this.isLoading.set(true);

    this.quizzesService
      .getQuizById(id)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.quiz.set(res);
          this.buildBreadcrumbs();
        },
        error: (error) => {
          console.error('Failed to load quiz:', error);
        },
      });
  }

  openDeleteDialog() {
    this.showDeleteDialog.set(true);
  }

  deleteConfig = computed<DeleteConfig>(() => ({
    title: this.translate.instant('quiz_details.delete_title'),
    confirmMessage: this.translate.instant('quiz_details.delete_confirm_message'),
    warningNote: this.translate.instant('quiz_details.delete_warning_note'),
    item: {
      name: this.quiz()?.title ?? '',
      subtitle: this.translate.instant('quiz_details.quizzes'),
      icon: 'pi pi-book',
      iconBg: 'dark',
    },
  }));

  deleteQuiz(): void {
    const quizId = this.quiz()?._id;

    if (!quizId) return;

    this.quizzesService.deleteQuiz(quizId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('common.success'),
          detail: this.translate.instant('quiz_details.delete_success'),
        });

        this.router.navigate(['/dashboard/instructor/quizzes']);
      },

      error: (error: unknown) => {
        console.error('Failed to delete quiz:', error);

        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('common.error'),
          detail: this.translate.instant('common.something_went_wrong'),
        });
      },
    });
  }

  editQuiz() {
    const quiz = this.quiz();

    if (!quiz) return;

    this.router.navigate(['/dashboard/instructor/quizzes/add-quiz'], {
      queryParams: {
        id: quiz._id,
      },
    });
  }
}
