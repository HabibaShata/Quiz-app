import { Component, computed, inject,signal } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { QuizzesService } from '../../services/quizzes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizDetails } from '../../interfaces/quiz';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { Delete } from '../../../../../../../shared/components/delete/delete/delete';
import { DeleteConfig } from '../../../../../../../shared/components/delete/interfaces/delete';

@Component({
  selector: 'quiz-app-view-quiz',
  imports: [BreadcrumbModule, CheckboxModule, ButtonModule, DatePipe, Delete],
  templateUrl: './view-quiz.html',
  styleUrl: './view-quiz.scss',
})
export class ViewQuiz {
  private quizzesService = inject(QuizzesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  quiz = signal<QuizDetails | null>(null);

  showDeleteDialog = signal(false);


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


// openDeleteDialog() {
//   this.showDeleteDialog.set(true);
// }

// deleteConfig = computed<DeleteConfig>(() => ({
//   title: 'Delete Quiz',
//   confirmMessage: 'Are you sure you want to delete this quiz?',
//   warningNote: 'This action cannot be undone.',
//   item: {
//     name: this.quiz()?.title ?? '',
//     subtitle: 'Quiz',
//     icon: 'pi pi-book',
//     iconBg: 'dark',
//   },
// }));




// deleteQuiz(): void {
//   const quizId = this.quiz()?._id;

//   if (!quizId) return;

//   this.quizzesService.deleteQuiz(quizId).subscribe({
//     next: () => {
//       this.router.navigate(['/dashboard/instructor/quizzes']);
//     },
//     error: (error: unknown) => {
//       console.error('Failed to delete quiz:', error);
//     },
//   });
// }

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
