import { Component, Input, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'quiz-app-dashboard-widget',
  imports: [RouterLink],
  templateUrl: './dashboard-widget.html',
  styleUrl: './dashboard-widget.scss',
})
export class DashboardWidget {
  title = input.required<string>();
  actionLink = input<string | null>(null);
  actionLabel = input<string | null>(null);
  imgSrc = input<string>('/images/quizImage.png');
}
