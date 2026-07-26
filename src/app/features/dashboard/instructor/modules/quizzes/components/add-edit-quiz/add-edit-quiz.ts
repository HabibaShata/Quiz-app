import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TranslatePipe } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { GroupOption, IQuiz, IQuizPayload } from '../../interfaces/quiz';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DifficultyEnum, QuestionType } from '../../../../../../../shared/enums/question.enum';

@Component({
  selector: 'quiz-app-add-edit-quiz',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    DatePickerModule,
    TranslatePipe,
  ],
  templateUrl: './add-edit-quiz.html',
  styleUrl: './add-edit-quiz.scss',
})
export class AddEditQuiz {
  private fb = inject(FormBuilder);

  visible = input.required<boolean>();
  visibleChange = output<boolean>();

  loading = input<boolean>(false);
  quizToEdit = input<IQuiz | null>(null);
  groups = input.required<GroupOption[]>();

  submitForm = output<IQuizPayload>();

  isEditMode = false;

  difficultyOptions = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
  ];

  categoryTypeOptions = [
    { label: 'FE', value: 'FE' },
    { label: 'BE', value: 'BE' },
    { label: 'DO', value: 'DO' },
  ];

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.required]],
    duration: [10, [Validators.required, Validators.min(1)]],
    questions_number: [1, [Validators.required, Validators.min(1)]],
    score_per_question: [1, [Validators.required, Validators.min(1)]],
    schadule: [null as Date | null, [Validators.required]],
    difficulty: ['' as DifficultyEnum | '', [Validators.required]],
    type: ['' as QuestionType | '', [Validators.required]],
    group: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      const quiz = this.quizToEdit();
      this.isEditMode = !!quiz;

      if (quiz) {
        const scheduleDate = new Date(quiz.schadule);
        this.form.patchValue({
          title: quiz.title,
          description: quiz.description,
          duration: Number(quiz.duration),
          questions_number: quiz.questions_number,
          score_per_question: Number(quiz.score_per_question),
          schadule: scheduleDate,
          difficulty: quiz.difficulty,
          type: quiz.type,
          group: this.extractGroupId(quiz.group),
        });
      } else {
        this.form.reset({ duration: 10, questions_number: 1, score_per_question: 1 });
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitForm.emit(this.buildPayload());
  }

  close(): void {
    this.visibleChange.emit(false);
  }

  private buildPayload(): IQuizPayload {
    const value = this.form.getRawValue();
    console.log(value);
    const scheduleDate = new Date(value.schadule!);

    return {
      title: value.title!,
      description: value.description!,
      group: value.group!,
      questions_number: value.questions_number!,
      difficulty: value.difficulty as DifficultyEnum,
      type: value.type as QuestionType,
      schadule: value.schadule!,
      duration: value.duration!,
      score_per_question: value.score_per_question!,
    };
  }

  private extractGroupId(group: string | GroupOption | undefined): string {
    if (!group) return '';
    return typeof group === 'string' ? group : group.value;
  }
}
