import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  signal,
  effect,
  input,
  output
} from '@angular/core';
import { ProgressBar } from 'primeng/progressbar';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-quiz-header',
  templateUrl: './quiz-header.html',
  imports: [ProgressBar],
  styleUrls: ['./quiz-header.scss']
})
export class QuizHeader implements  OnDestroy {
    /** Inputs */
  quizTime = input(0);
  isQuizStarted = input(false);
  currentQuestion = input(1);
  totalQuestions = input(1);
  quizTitle = input('Quiz');

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
  /** Total time allotted for the quiz, in seconds */
//   @Input() quizTime = 0;

//   /** Set to true (from the parent) the moment the quiz should start counting down */
//   @Input() isQuizStarted = false;

//   /** Current question number (1-based) */
//   @Input() currentQuestion = 1;

//   /** Total number of questions in the quiz */
//   @Input() totalQuestions = 1;

//   /** Quiz title shown on the left side of the header */
//   @Input() quizTitle = 'Quiz';

//   /** Emits every second with the seconds remaining */
//  // @Output() timeChange = new EventEmitter<number>();

//   /** Emits once, when the countdown reaches 0 */
//   @Output() timeUp = new EventEmitter<void>();

//  timeLeft = signal(0);
//   private timerSub?: Subscription;
//   private hasStarted = false;

//   ngOnInit(): void {
//     this.timeLeft.set(this.quizTime);
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     // Reset the clock if the quiz duration is (re)configured before start
//     if (changes['quizTime'] && !this.hasStarted) {
//       this.timeLeft.set(this.quizTime);
//     }

//     // Kick off the countdown the moment the parent flips isQuizStarted to true
//     if (changes['isQuizStarted'] && this.isQuizStarted && !this.hasStarted) {
//       this.startTimer();
//     }
//   }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }

  private startTimer(): void {
    this.hasStarted = true;
    this.timeLeft.set(this.quizTime());

    this.timerSub = interval(1000).subscribe(() => {
      if (this.timeLeft() <= 0) {
        this.timerSub?.unsubscribe();
        this.timeUp.emit();
        return;
      }
      this.timeLeft.update(v => v - 1);
      //this.timeChange.emit(this.timeLeft());

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
  // get formattedTime(): string {
  //   const minutes = Math.floor(this.timeLeft / 60);
  //   const seconds = this.timeLeft % 60;
  //   return `${minutes.toString().padStart(2, '0')}:${seconds
  //     .toString()
  //     .padStart(2, '0')}`;
  // }

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
