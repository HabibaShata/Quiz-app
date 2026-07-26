import { Component, Input, input } from '@angular/core';
import { IQuiz } from '../../../features/dashboard/instructor/modules/quizzes/interfaces/quiz';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'quiz-app-dashboard-widget',
  imports: [RouterLink],
  templateUrl: './dashboard-widget.html',
  styleUrl: './dashboard-widget.scss',
})
export class DashboardWidget {
  title = input.required<string>();
  actionLabel = input<string>('View All');
  actionLink = input.required<string>();
  imgSrc = input<string>('/images/quizImage.png');
  // component.ts
}
