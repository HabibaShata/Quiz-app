import { Component, computed, inject, input, model } from '@angular/core';
import { Router } from '@angular/router';
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
  private router = inject(Router);
  visible = model(true);
  result = input.required<number>();
  totalResult = input.required<number>();
  isPassed = computed(() => {
    return (this.result() / this.totalResult()) >= 0.5;
  });

  close(){
    this.visible.set(false);
    this.router.navigate(['/dashboard/learner/quizzes']);
  }
}
