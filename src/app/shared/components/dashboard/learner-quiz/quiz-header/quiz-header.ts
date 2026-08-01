import {Component,OnDestroy,signal,effect,input,output} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ProgressBar } from 'primeng/progressbar';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-quiz-header',
  templateUrl: './quiz-header.html',
  imports: [ProgressBar,TranslatePipe],
  styleUrls: ['./quiz-header.scss']
})
export class QuizHeader implements OnDestroy {
  /** Inputs */
  quizTime = input(0);
  isQuizStarted = input(false);
  currentQuestion = input(1);
  totalQuestions = input(1);
  quizTitle = input('Quiz');
  quizType = input('');
  quizLevel = input('');
  timeChange = output<number>();

  /** Outputs */
  timeUp = output<void>();

  /** Internal state */
  timeLeft = signal(0);

  private timerSub?: Subscription;
  private hasStarted = false;

  constructor() {
    effect(() => {
      const duration = this.quizTime();

      if (!this.hasStarted) {
        this.timeLeft.set(duration);
      }
    });

    effect(() => {
      if (this.isQuizStarted() && !this.hasStarted) {
        this.startTimer();
      }
    });
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }

  private startTimer(): void {
    this.hasStarted = true;
    this.timeLeft.set(this.quizTime());

    this.timerSub = interval(1000).subscribe(() => {
      this.timeLeft.update(v => Math.max(v - 1, 0));
      this.timeChange.emit(this.timeLeft());

      if (this.timeLeft() === 0) {
        this.timerSub?.unsubscribe();
        this.timeUp.emit();
      }
    });
  }

  /** mm:ss formatted countdown */
  get formattedTime(): string {
    const time = this.timeLeft();

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  /** 0-100 value driving the question progress bar */
  get questionProgress(): number {
    if (!this.totalQuestions) {
      return 0;
    }
    return Math.round((this.currentQuestion() / this.totalQuestions()) * 100);
  }

  /** Switches the timer bar into a warning/danger look as time runs low */
  get timerSeverity(): 'success' | 'warning' | 'danger' {
    const ratio = this.quizTime ? this.timeLeft() / this.quizTime() : 0;
    if (ratio <= 0.15) {
      return 'danger';
    }
    if (ratio <= 0.4) {
      return 'warning';
    }
    return 'success';
  }
}
