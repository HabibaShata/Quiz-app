import { Component, EventEmitter, Input, output, Output, signal } from '@angular/core';
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
  @Input() title!: string;
  @Input() showButton = false;
  @Input() linkUrl?: string;
  @Input() linkLabel!: string;
  @Input() buttonLabel!: string;

  @Input() boxTitle!: string;
  @Input() showBoxButton = false;
  @Input() boxLinkUrl?: string;
  @Input() boxButtonLabel!: string;

  @Output() buttonClick = new EventEmitter<void>();
  @Output() boxButtonClick = new EventEmitter<void>();

  @Output() typeChange = new EventEmitter<QuestionType | ''>();
  @Output() difficultyChange = new EventEmitter<QuestionDifficulty | ''>();
  // @Output() boxSearch = new EventEmitter<void>();
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
    { label: 'Hard', value: DifficultyEnum.HARD },
    { label: 'Mediuim', value: DifficultyEnum.MEDIUM },
  ];

  onButtonClick() { this.buttonClick.emit(); }
  onBoxButtonClick() { this.boxButtonClick.emit(); }

  onSearch(value: string): void {
    this.searchValue.set(value);
    this.boxSearch.emit(value);
  }

  onTypeChange(type: QuestionType | '') {
    this.typeChange.emit(type);
  }

  onDifficultyChange(diffculty: QuestionDifficulty | '') {
    this.difficultyChange.emit(diffculty);
  }
}
