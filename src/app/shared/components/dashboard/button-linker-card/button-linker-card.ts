import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'quiz-app-button-linker-card',
  imports: [CommonModule],
  templateUrl: './button-linker-card.html',
  styleUrl: './button-linker-card.scss',
})
export class ButtonLinkerCard {
  private readonly router = inject(Router);

  @Input() icon!: string;
  @Input() title!: string;
  @Input() routerLink?: string | any[];
  @Output() cardClick = new EventEmitter<void>();

  handleClick() {
    if (this.routerLink) {
      this.router.navigate(Array.isArray(this.routerLink) ? this.routerLink : [this.routerLink]);
    } else {
      this.cardClick.emit();
    }
  }
}
