import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-learner-home',
  imports: [Button, RouterLink, TranslatePipe],
  templateUrl: './learner-home.html',
  styleUrl: './learner-home.scss',
})
export class LearnerHome {
  private authService = inject(AuthService);
  private translate = inject(TranslateService);
  fullName = computed(() => {
    const user = this.authService.getCurrentUser();
    return user ? `${user.first_name} ${user.last_name}` : '';
  });
}
