import { Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from "primeng/inputtext";
import { Select } from 'primeng/select';
import { QuestionDifficulty, IQuestion } from '../../../features/dashboard/instructor/modules/questions/interfaces/questions';
import { QuestionType, DifficultyEnum } from '../../enums/question.enum';

@Component({
  selector: 'app-page-layout',
  imports: [Button, RouterLink, TranslatePipe, InputIcon, IconField, InputText, Select],
  templateUrl: './page-layout.html',
  styleUrl: './page-layout.scss',
})
export class PageLayout {
  layoutClass = input<string>('');
  title = input<string>();
  showButton = input(false);
  linkUrl = input<string>();
  linkLabel = input<string>();
  buttonLabel = input<string>();

  boxTitle = input<string>();
  showBoxButton = input(false);
  boxLinkUrl = input<string>();
  boxButtonLabel = input<string>();

  buttonClick = output<void>();
  boxButtonClick = output<void>();

  typeChange = output<QuestionType | ''>();
  difficultyChange = output<QuestionDifficulty | ''>();
  boxSearch = output<string>();

  searchValue = signal('');

  selectedType = signal<QuestionType | ''>('');
  selectedDifficulty = signal<QuestionDifficulty | ''>('');
  filteredQuestions = signal<IQuestion[]>([]);

  questionTypes = [
    { label: 'FE', value: QuestionType.FE },
    { label: 'BE', value: QuestionType.BE },
    { label: 'DO', value: QuestionType.DO },
  ];

  questionDifficulty = [
    { label: 'Easy', value: DifficultyEnum.EASY },
    { label: 'Medium', value: DifficultyEnum.MEDIUM },
    { label: 'Hard', value: DifficultyEnum.HARD },
  ];

  onButtonClick(): void {
    this.buttonClick.emit();
  }

  onBoxButtonClick(): void {
    this.boxButtonClick.emit();
  }

  onSearch(value: string): void {
    this.searchValue.set(value);
    this.boxSearch.emit(value);
  }

  onTypeChange(type: QuestionType | ''): void {
    this.selectedType.set(type);
    this.typeChange.emit(type);
  }

  onDifficultyChange(difficulty: QuestionDifficulty | ''): void {
    this.selectedDifficulty.set(difficulty);
    this.difficultyChange.emit(difficulty);
  }
}
