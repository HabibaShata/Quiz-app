import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudentSummary } from '../../../features/dashboard/instructor/components/instructor-home/instructor-home';

@Component({
  selector: 'quiz-app-top-students-card',
  imports: [RouterLink],
  templateUrl: './top-students-card.html',
  styleUrl: './top-students-card.scss',
})
export class TopStudentsCard {
  student = input.required<StudentSummary>();
  studentLink = input.required<string>();
}
