import { Component, input, model } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'quiz-app-quiz-success-dialog',
  imports: [Dialog, Button, TranslatePipe],
  templateUrl: './quiz-success-dialog.html',
  styleUrl: './quiz-success-dialog.scss',
})
export class QuizSuccessDialog {
  visible = model(false);
  result = input.required<number>();
  totalResult = input.required<number>();
  isPassed = input.required<boolean>();
}
