import { Component, computed, inject, signal } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { QuizzesService } from '../../services/quizzes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizDetails } from '../../interfaces/quiz';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { Loader } from '../../../../../../../shared/components/loader/loader';
import { finalize } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { GroupsService } from '../../../group/services/groups.service';
import { AlertDeleteService } from '../../../../../../../shared/components/delete/services/alert-delete-sevice';
@Component({
  selector: 'quiz-app-view-quiz',
  imports: [BreadcrumbModule, CheckboxModule, ButtonModule, DatePipe, Loader, TranslatePipe],
  templateUrl: './view-quiz.html',
  styleUrl: './view-quiz.scss',
})
export class ViewQuiz {
  private quizzesService = inject(QuizzesService);
  private groupsService = inject(GroupsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private alertDeleteService = inject(AlertDeleteService);
  quiz = signal<QuizDetails | null>(null);
  groupName = signal('');

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
          this.loadGroupName(res.group);
        },
        error: (error) => {
          console.error('Failed to load quiz:', error);
        },
      });
  }

  openDeleteDialog(): void {
    const currentQuiz = this.quiz();
    if (!currentQuiz?._id) return;

    this.alertDeleteService.open({
      config: {
        title: this.translate.instant('quiz_details.delete_title'),
        confirmMessage: this.translate.instant('quiz_details.delete_confirm_message'),
        warningNote: this.translate.instant('quiz_details.delete_warning_note'),
        item: {
          name: currentQuiz.title,
          subtitle: this.translate.instant('quiz_details.quizzes'),
          icon: 'pi pi-book',
          iconBg: 'dark',
        },
      },
      request: () => this.quizzesService.deleteQuiz(currentQuiz._id),
      successMessage: this.translate.instant('quiz_details.delete_success'),
      onSuccess: () => {
        this.router.navigate(['/dashboard/instructor/quizzes']);
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

  loadGroupName(groupId: string) {
    this.groupsService.getAllGroups().subscribe((groups) => {
      const group = groups.find((g) => g._id === groupId);
      this.groupName.set(group?.name ?? '');
    });
  }
}
