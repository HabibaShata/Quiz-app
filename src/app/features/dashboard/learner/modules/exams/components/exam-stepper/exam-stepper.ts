import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { QuizHeader } from "../quiz-header/quiz-header";
import { ExamService } from '../../services/exam.service';
import { IQuestionResponse, IQuestionsData, IQuizQuestion } from '../../interfaces/exam';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { QuestionAnswer } from '../../../../../instructor/modules/questions/interfaces/questions';
import { QuizSuccessDialog } from "../quiz-success-dialog/quiz-success-dialog";

@Component({
  selector: 'quiz-app-exam-stepper',
  imports: [Button, StepperModule, QuizHeader, TranslatePipe, QuizSuccessDialog],
  templateUrl: './exam-stepper.html',
  styleUrl: './exam-stepper.scss',
})
export class ExamStepper implements OnInit {
  private readonly examService = inject(ExamService)
  private readonly messageService = inject(MessageService);
  private translate = inject(TranslateService);
  readonly optionKeys: QuestionAnswer[] = ['A', 'B', 'C', 'D'];

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

  totalQuestions = computed(() => this.questions().length);
  answeredCount = computed(
    () => Object.keys(this.selectedAnswers()).length
  );

  ngOnInit(): void {
    this.getQuestionsWithoutAnswers();
  }

  getQuestionsWithoutAnswers(): void {
    this.examService
      .getQuestionsWithoutAnswers('6a6a6f2cd7f5a2bf34bdce03')
      .subscribe({
        next: (res: IQuestionResponse) => {
          this.quizData.set(res.data)
          this.questions.set(this.quizData().questions);
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
    this.examService.submitQuiz('6a6a6f2cd7f5a2bf34bdce03', { answers: payload }).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('common.success'),
          detail: res.message || this.translate.instant('quiz-details.Success'),
        });
        this.successDialogVisible.set(true)
        console.log(res);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('common.error'),
          detail: err.error?.message || this.translate.instant('common.something_went_wrong'),
        });
        console.log(err)
      }
    })
    // console.log('Submitting answers', payload);
  }

  startQuiz() {
    this.isQuizStarted.set(true)
  }

  // onTimeChange(secondsLeft: number) {
  //   // optional: sync with a parent-level state/store
  //   if (secondsLeft === 0) {
  //     this.submitQuiz();
  //   }
  // }
}
