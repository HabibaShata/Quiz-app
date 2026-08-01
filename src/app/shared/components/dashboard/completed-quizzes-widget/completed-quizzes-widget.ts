import { Component, input } from '@angular/core';
import { EmptyStateComponent } from '../../general/empty-state/empty-state.component';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { IQuiz } from '../../../../features/dashboard/instructor/modules/quizzes/interfaces/quiz';

export type CompletedQuizRow = IQuiz & { groupName: string };

@Component({
  selector: 'quiz-app-completed-quizzes-widget',
  imports: [EmptyStateComponent, TranslatePipe, RouterLink, TableModule, DatePipe],
  templateUrl: './completed-quizzes-widget.html',
  styleUrl: './completed-quizzes-widget.scss',
})
export class CompletedQuizzesWidget {
  quizzes = input.required<CompletedQuizRow[]>();

  resultsLink = input<string[]>(['../results']);

  titleKey = input<string>('QUIZZES.COMPLETED_QUIZZES');
}
