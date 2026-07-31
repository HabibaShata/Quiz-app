import { Injectable } from '@angular/core';
import { QuestionAnswer } from '../../../../instructor/modules/questions/interfaces/questions';

export interface IQuizProgress {
  selectedAnswers: Record<string, QuestionAnswer>;
  activeStep: number;
  timeLeft: number;
}

@Injectable({
  providedIn: 'root',
})

export class QuizProgressService {
  private readonly storagePrefix = 'quiz-progress-';

  private key(quizId: string): string {
    return `${this.storagePrefix}${quizId}`;
  }

  save(quizId: string, progress: IQuizProgress): void {
    if (!quizId) return;
    try {
      localStorage.setItem(this.key(quizId), JSON.stringify(progress));
    } catch (err) {
      console.error('Failed to save quiz progress', err);
    }
  }

  load(quizId: string): IQuizProgress | null {
    if (!quizId) return null;
    try {
      const raw = localStorage.getItem(this.key(quizId));
      return raw ? (JSON.parse(raw) as IQuizProgress) : null;
    } catch (err) {
      console.error('Failed to load quiz progress', err);
      return null;
    }
  }

  clear(quizId: string): void {
    if (!quizId) return;
    localStorage.removeItem(this.key(quizId));
  }
}
