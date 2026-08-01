import { Component, computed, inject, signal } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem, MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { QuizzesService } from '../../services/quizzes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupOption, IQuiz, IQuizPayload, QuizDetails } from '../../interfaces/quiz';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { Loader } from '../../../../../../../shared/components/general/loader/loader';
import { finalize } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { GroupsService } from '../../../group/services/groups.service';
import { AlertDeleteService } from '../../../../../../../shared/components/delete/services/alert-delete-sevice';
import { Toast } from 'primeng/toast';
import { AddEditQuiz } from '../add-edit-quiz/add-edit-quiz';
@Component({
  selector: 'quiz-app-view-quiz',
  imports: [
    BreadcrumbModule,
    CheckboxModule,
    ButtonModule,
    DatePipe,
    Loader,
    TranslatePipe,
    Toast,
    AddEditQuiz,
  ],
  providers: [MessageService],
  templateUrl: './view-quiz.html',
  styleUrl: './view-quiz.scss',
})
export class ViewQuiz {
  private quizzesService = inject(QuizzesService);
  private groupsService = inject(GroupsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private translate = inject(TranslateService);
  private alertDeleteService = inject(AlertDeleteService);
  quiz = signal<QuizDetails | null>(null);
  selectedQuizForEdit = signal<IQuiz | null>(null);
  groupName = signal('');

  isLoading = signal(true);

  showDeleteDialog = signal(false);
  showDialog = signal(false);
  addEditLoad = signal(false);
  groupsOptions = signal<GroupOption[]>([]);

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
    this.loadGroups();
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
          this.selectedQuizForEdit.set(res as unknown as IQuiz);
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

  loadGroupName(groupId: string) {
    this.groupsService.getAllGroups().subscribe((groups) => {
      const group = groups.find((g) => g._id === groupId);
      this.groupName.set(group?.name ?? '');
    });
  }

  openEditDialog(): void {
    this.showDialog.set(true);
  }
  loadGroups() {
    this.groupsService.getGroupOptions().subscribe({
      next: (options) => {
        this.groupsOptions.set(options);
        console.log('options', options);
      },
      error: (err) => console.error('Failed to load groups', err),
    });
  }
  editQuiz(data: IQuizPayload): void {
    this.addEditLoad.set(true);

    this.quizzesService.createQuiz(data).subscribe({
      next: () => {
        this.addEditLoad.set(false);
        this.showDialog.set(false);
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('common.success'),
          detail: this.translate.instant('quizzes.create_success'),
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('common.error'),
          detail: err.error?.message || this.translate.instant('common.something_went_wrong'),
        });
        this.addEditLoad.set(false);
        console.error(err);
      },
    });
  }
}
