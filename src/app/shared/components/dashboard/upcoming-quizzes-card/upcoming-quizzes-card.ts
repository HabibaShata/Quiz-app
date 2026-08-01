import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IQuiz } from '../../../../features/dashboard/instructor/modules/quizzes/interfaces/quiz';
import { TranslatePipe } from '@ngx-translate/core';
export interface QuizSummary {
  id: string;
  title: string;
  date: Date;
  time: string;
  enrolledCount: number;
  image: string;
}
@Component({
  selector: 'quiz-app-upcoming-quizzes-card',
  imports: [RouterLink, DatePipe,TranslatePipe],
  templateUrl: './upcoming-quizzes-card.html',
  styleUrl: './upcoming-quizzes-card.scss',
})
export class UpcomingQuizzesCard {
  quiz = input.required<IQuiz>();
  routingLink = input<string>('/view-quiz');
  showRouting = input<boolean>(true)
  imgSrc = input<string>('/images/quizImage.png');
}
