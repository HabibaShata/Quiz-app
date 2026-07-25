import { Component, inject,signal } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { QuizzesService } from '../../services/quizzes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizDetails } from '../../interfaces/quiz';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'quiz-app-view-quiz',
  imports: [BreadcrumbModule, CheckboxModule, ButtonModule, DatePipe],
  templateUrl: './view-quiz.html',
  styleUrl: './view-quiz.scss',
})
export class ViewQuiz {
  private quizzesService = inject(QuizzesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  quiz = signal<QuizDetails | null>(null);


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
      label: 'Quizzes',
      routerLink: ['/dashboard/instructor/quizzes'],
    },
    {
      label: this.quiz()?.title ?? '',
    },
  ];
}

  ngOnInit(): void {
  this.home = {
    label: 'Home',
    routerLink: '/',
  };

  const id = this.route.snapshot.paramMap.get('id');

  if (!id) return;

  this.quizzesService.getQuizById(id).subscribe({
  next: (res) => {
    this.quiz.set(res);
    this.buildBreadcrumbs();
  },
});
}

  editQuiz() {
   const quiz = this.quiz();

if (!quiz) return;

this.router.navigate(['/dashboard/instructor/quizzes/add-quiz'], {
  queryParams: {
    id: quiz._id,
  },
});
  }
}
