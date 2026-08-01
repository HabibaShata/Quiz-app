import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { LanguageService } from './core/services/language.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('quiz-app');
  private readonly languageService = inject(LanguageService);

  ngOnInit() {
    this.languageService.initializeLanguage();
  }
}
