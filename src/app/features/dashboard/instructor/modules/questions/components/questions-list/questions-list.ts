import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { EmptyStateComponent } from '../../../../../../../shared/components/general/empty-state/empty-state.component';
import { Loader } from '../../../../../../../shared/components/general/loader/loader';
import { TableModule } from 'primeng/table';
import { PageLayout } from '../../../../../../../shared/layouts/page-layout/page-layout';
import { AddEditQuestion } from '../add-edit-question/add-edit-question';
import { ICreateQuestionData, IQuestion, QuestionDifficulty } from '../../interfaces/questions';
import { QuestionsService } from '../../services/questions.service';
import { MessageService } from 'primeng/api';
import { DeleteConfig } from '../../../../../../../shared/components/general/delete/interfaces/delete';
import { AlertDeleteService } from '../../../../../../../shared/components/general/delete/services/alert-delete-sevice';
import { ViewQuestion } from '../view-question/view-question';
import { Button } from 'primeng/button';
import { finalize } from 'rxjs';
import { QuestionType } from '../../../../../../../shared/enums/question.enum';
@Component({
  selector: 'app-questions-list',
  imports: [
    PageLayout,
    Paginator,
    TranslatePipe,
    Loader,
    FormsModule,
    EmptyStateComponent,
    TableModule,
    ViewQuestion,
    Button,
    AddEditQuestion,
  ],
  templateUrl: './questions-list.html',
  styleUrl: './questions-list.scss',
})
export class QuestionsList {
  private questionService = inject(QuestionsService);
  private readonly messageService = inject(MessageService);
  private translate = inject(TranslateService);
  private deleteService = inject(AlertDeleteService);
  allQuestions = signal<IQuestion[]>([]);
  isLoading = signal<boolean>(true);
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  selectedQuestion = signal<IQuestion | null>(null);
  questionLoading = signal(false);
  visible = signal(false);
  showDialog = false;
  addEditLoad = signal(false);
  groupToDelete = signal<IQuestion | null>(null);
  showDeleteDialog = signal(false);
  deleteConfig = signal<DeleteConfig | null>(null);
  deleteLoading = signal(false);
  searchValue = signal('');
  selectedType = signal<QuestionType | ''>('');
  selectedDifficulty = signal<QuestionDifficulty | ''>('');

  filteredQuestions = computed(() => {
    const search = this.searchValue().trim().toLowerCase();
    const type = this.selectedType();
    const difficulty = this.selectedDifficulty();

    return this.allQuestions().filter((q) => {
      const matchesSearch =
        !search ||
        q.title.toLowerCase().includes(search) ||
        q.description.toLowerCase().includes(search);
      const matchesType = !type || q.type === type;
      const matchesDifficulty = !difficulty || q.difficulty === difficulty;
      return matchesSearch && matchesType && matchesDifficulty;
    });
  });

  totalRecords = computed(() => this.filteredQuestions().length);

  questionsList = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredQuestions().slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.fetchQuestionsData();
  }

  fetchQuestionsData() {
    this.isLoading.set(true);
    this.questionService.getAllQuestions().subscribe({
      next: (res: IQuestion[]) => {
        this.allQuestions.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log(err);
      },
    });
  }

  onFilterChange(): void {
    this.currentPage.set(1); // reset to page 1 on any filter change
  }

  onTypeChange(type: QuestionType | '') {
    this.selectedType.set(type);
    this.onFilterChange();
  }

  onDifficultyChange(difficulty: QuestionDifficulty | '') {
    this.selectedDifficulty.set(difficulty);
    this.onFilterChange();
  }

  onSearch(value: string) {
    this.searchValue.set(value);
    this.onFilterChange();
  }

  onPageChange(event: PaginatorState) {
    this.currentPage.set((event.page ?? 0) + 1);
    this.pageSize.set(event.rows ?? 10);
  }

  viewQuestion(question: IQuestion) {
    this.selectedQuestion.set(null);
    this.questionLoading.set(true);
    this.visible.set(true);
    this.questionService.getQuestionDetails(question._id).subscribe({
      next: (res: IQuestion) => {
        this.selectedQuestion.set(res);
        this.questionLoading.set(false);
      },
      error: () => {
        this.questionLoading.set(false);
        this.visible.set(false);
      },
    });
  }

  onHideViewDialog() {
    this.visible.set(false);
    this.selectedQuestion.set(null);
  }

  openEditDialog(question: IQuestion): void {
    this.selectedQuestion.set(structuredClone(question));
    this.showDialog = true;
  }

  openAddDialog() {
    this.selectedQuestion.set(null);
    this.showDialog = true;
  }

  saveQuestion(data: ICreateQuestionData) {
    this.addEditLoad.set(true);
    const isEdit = !!this.selectedQuestion();
    const request$ = isEdit
      ? this.questionService.updateQuestion(this.selectedQuestion()!._id, data)
      : this.questionService.createQuestion(data);

    request$.pipe(finalize(() => this.addEditLoad.set(false))).subscribe({
      next: () => {
        this.showDialog = false;
        this.fetchQuestionsData();
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('common.success'),
          detail: this.translate.instant(
            isEdit ? 'questions.update_success' : 'questions.create_success',
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

  openDeleteDialog(question: IQuestion): void {
    this.deleteService.open({
      config: {
        title: this.translate.instant('questions.delete_title'),
        confirmMessage: this.translate.instant('questions.delete_confirm_message'),
        warningNote: this.translate.instant('questions.delete_warning_note'),
        item: {
          name: question.title,
          subtitle: `${question.type} | ${question.difficulty}`,
          icon: 'pi pi-question-circle',
          iconBg: 'dark',
        },
      },
      request: () => this.questionService.deleteQuestion(question._id),
      successMessage: this.translate.instant('questions.delete_success'),
      onSuccess: () => this.fetchQuestionsData(),
    });
  }
}
