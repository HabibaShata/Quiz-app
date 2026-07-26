import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { EmptyStateComponent } from '../../../../../../../shared/components/empty-state/empty-state.component';
import { QuizzesService } from '../../services/quizzes.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { GroupOption, IQuiz, IQuizPayload } from '../../interfaces/quiz';
import { AddEditQuiz } from '../add-edit-quiz/add-edit-quiz';
import { GroupsService } from '../../../group/services/groups.service';
import { finalize } from 'rxjs';
@Component({
  selector: 'quiz-app-quiz-list',
  imports: [
    TableModule,
    CardModule,
    ButtonModule,
    CommonModule,
    RouterLink,
    EmptyStateComponent,
    Toast,
    TranslatePipe,
    AddEditQuiz,
  ],
  providers: [MessageService],
  templateUrl: './quiz-list.html',
  styleUrl: './quiz-list.scss',
})
export class QuizList implements OnInit {
  private quizzesService = inject(QuizzesService);
  private groupsService = inject(GroupsService);
  private messageService = inject(MessageService);
  private translate = inject(TranslateService);

  upcomingQuizzes = signal<IQuiz[]>([]);
  allQuizzes = signal<IQuiz[]>([]);

  completedQuizzes = signal<IQuiz[]>([]);
  selectedQuizForEdit = signal<IQuiz | null>(null);
  groupsOptions = signal<GroupOption[]>([]);

  showDialog = signal(false);
  addEditLoad = signal(false);

  ngOnInit(): void {
    this.getIncomingQuizzes();
    this.getCompletedQuizzes();
    this.loadGroups();
    // this.loadQuizzes();
  }

  getIncomingQuizzes(): void {
    this.quizzesService.getFirstFiveIncomming().subscribe({
      next: (res) => {
        this.upcomingQuizzes.set(res);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('COMMON.ERROR'),
          detail: err?.error?.message || 'Failed to load upcoming quizzes',
        });
      },
    });
  }

  getCompletedQuizzes(): void {
    this.quizzesService.getLastFiveCompleted().subscribe({
      next: (res) => {
        console.log(res);
        console.log(res[0].group);

        this.completedQuizzes.set(res);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('COMMON.ERROR'),
          detail: err?.error?.message || 'Failed to load completed quizzes',
        });
      },
    });
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
  openAddDialog(): void {
    this.selectedQuizForEdit.set(null);
    this.showDialog.set(true);
  }
  onQuizSaved(): void {
    this.showDialog.set(false);
  }
  openEditDialog(quiz: IQuiz): void {
    this.selectedQuizForEdit.set(quiz);
    this.showDialog.set(true);
  }
  saveQuiz(data: IQuizPayload): void {
    this.addEditLoad.set(true);
    const isEdit = !!this.selectedQuizForEdit();
    console.log(isEdit);

    const request$ = isEdit
      ? this.quizzesService.updateQuiz(this.selectedQuizForEdit()!._id!, data)
      : this.quizzesService.createQuiz(data);

    request$.pipe(finalize(() => this.addEditLoad.set(false))).subscribe({
      next: () => {
        this.showDialog.set(false);
        this.showDialog.set(false);
        this.getIncomingQuizzes();
        this.getCompletedQuizzes();
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('common.success'),
          detail: this.translate.instant(
            isEdit ? 'quizzes.update_success' : 'quizzes.create_success',
          ),
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('common.error'),
          detail: err.error?.message || this.translate.instant('common.something_went_wrong'),
        });
        console.error(err);
      },
    });
  }
  // private loadQuizzes(): void {
  //   this.quizzesService.getAllQuizzes().subscribe({
  //     next: (quizzes) => {
  //       this.allQuizzes.set(quizzes);
  //     },
  //     error: (err) => console.error('Failed to load quizzes', err),
  //   });
  // }
}
