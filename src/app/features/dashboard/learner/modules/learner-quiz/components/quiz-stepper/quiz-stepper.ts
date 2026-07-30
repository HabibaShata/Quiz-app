import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { QuestionAnswer } from '../../../../../instructor/modules/questions/interfaces/questions';
import { IQuestionsData, IQuizQuestion, IQuestionResponse } from '../../interfaces/exam';
import { ExamService } from '../../services/exam.service';
import { QuizHeader } from '../quiz-header/quiz-header';
import { QuizSuccessDialog } from '../quiz-success-dialog/quiz-success-dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'quiz-app-quiz-stepper',
  imports: [Button, StepperModule, QuizHeader, TranslatePipe, QuizSuccessDialog],
  templateUrl: './quiz-stepper.html',
  styleUrl: './quiz-stepper.scss',
})
export class QuizStepper {
  private readonly examService = inject(ExamService)
  private readonly messageService = inject(MessageService);
  private translate = inject(TranslateService);
  readonly optionKeys: QuestionAnswer[] = ['A', 'B', 'C', 'D'];
  private route = inject(ActivatedRoute);
  quizId!: string | null;

  quizData = signal<IQuestionsData>({} as IQuestionsData);
  currentQuestionIndex = 0;
  questions = signal<IQuizQuestion[]>([]);

  /** 1-based index of the step currently shown by p-stepper */
  activeStep = signal<number>(1);

  /** questionId -> selected option key */
  selectedAnswers = signal<Record<string, QuestionAnswer>>({});

  successDialogVisible = signal(false);
  isQuizStarted = signal(false);
  quizTimeInSeconds = signal(0); // adjust to your real quiz duration

  isSubmitted = signal(false);
  totalResult = signal(0);
  studentResult = signal(0);

  totalQuestions = computed(() => this.questions().length);
  answeredCount = computed(
    () => Object.keys(this.selectedAnswers()).length
  );

  ngOnInit(): void {
     this.route.paramMap.subscribe(params => {
      this.quizId = params.get('id');
      if (this.quizId) {
        this.getQuestionsWithoutAnswers(this.quizId);
      }
    });
  }

  getQuestionsWithoutAnswers(id:string): void {
    this.examService.getQuestionsWithoutAnswers(id).subscribe({
        next: (res: IQuestionResponse) => {
          this.quizData.set(res.data)
          this.questions.set(this.quizData().questions);
          this.totalResult.set(this.quizData().questions_number * this.quizData().score_per_question)
          this.quizTimeInSeconds.set(this.quizData().duration * 60)
          this.startQuiz()
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  selectOption(questionId: string, key: QuestionAnswer): void {
    this.selectedAnswers.update((answers) => ({
      ...answers,
      [questionId]: key,
    }));
    console.log(this.selectedAnswers());
  }

  onStepChange(value: number | undefined): void {
    if (value !== undefined) {
      this.activeStep.set(value);
    }
  }

  isOptionSelected(questionId: string, key: QuestionAnswer): boolean {
    return this.selectedAnswers()[questionId] === key;
  }

  isAnswered(questionId: string): boolean {
    return !!this.selectedAnswers()[questionId];
  }

  // auto submit quiz
  onTimeUp(): void {
    this.submitQuiz();
  }

  submitQuiz(): void {
    const payload = this.questions().map((q) => ({
      question: q._id,
      answer: this.selectedAnswers()[q._id] ?? "",
    }));
    this.isSubmitted.set(true);
    this.examService.submitQuiz(this.quizId, { answers: payload }).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('common.success'),
          detail: res.message || this.translate.instant('quiz-details.Success'),
        });
        this.studentResult.set(res.data.score)
        this.successDialogVisible.set(true)
       // console.log(res);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('common.error'),
          detail: err.error?.message || this.translate.instant('common.something_went_wrong'),
        });
        //console.log(err)
      },
      complete : ()=>{this.isSubmitted.set(false)}
    })
  }

  startQuiz() {
    this.isQuizStarted.set(true)
  }
}
