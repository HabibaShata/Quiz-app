import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RoleEnum } from '../../../../core/enum/role.enum';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { TranslatePipe } from '@ngx-translate/core';

export interface NavItem {
  label: string;
  route: string;
  exact:boolean;
  icon: {
    default: string;
    active: string;
  };
}

export const INSTRUCTOR_NAV_ITEMS: NavItem[] = [
  {
    label: 'navigation.dashboard',
    route: 'instructor',
    exact: true,
    icon: {
      default: '/images/dashboard-icon.svg',
      active: '/images/dashboard-icon-white.svg',
    },
  },
  {
    label: 'navigation.students',
    route: 'instructor/students',
    exact: false,
    icon: {
      default: '/images/groups-icon.svg',
      active: '/images/groups-icon-white.svg',
    },
  },
  {
    label: 'navigation.questions',
    route: 'instructor/questions',
    exact: false,
    icon: {
      default: '/images/groups-icon.svg',
      active: '/images/groups-icon-white.svg',
    },
  },
  {
    label: 'navigation.quizzes',
    route: 'instructor/quizzes',
    exact: false,
    icon: {
      default: '/images/Quiz-icon.svg',
      active: '/images/Quiz-icon-white.svg',
    },
  },
  {
    label: 'navigation.groups',
    route: 'instructor/groups',
    exact: false,
    icon: {
      default: '/images/groups-icon.svg',
      active: '/images/groups-icon-white.svg',
    },
  },
  {
    label: 'navigation.results',
    route: 'instructor/results',
    exact: false,
    icon: {
      default: '/images/Results-icon.svg',
      active: '/images/Results-icon-white.svg',
    },
  },
];

export const STUDENT_NAV_ITEMS: NavItem[] = [
  {
    label: 'navigation.dashboard',
    route: 'learner',
    exact: true,
    icon: {
      default: '/images/dashboard-icon.svg',
      active: '/images/dashboard-icon-white.svg',
    },
  },
  {
    label: 'navigation.quizzes',
    route: 'learner/quizzes',
    exact: false,
    icon: {
      default: '/images/Quiz-icon.svg',
      active: '/images/Quiz-icon-white.svg',
    },
  },
  {
    label: 'navigation.results',
    route: 'learner/results',
    exact: false,
    icon: {
      default: '/images/Results-icon.svg',
      active: '/images/Results-icon-white.svg',
    },
  },
];
@Component({
  selector: 'app-navigation-sidebar',
  imports: [RouterLink, RouterLinkActive,TranslatePipe],
  templateUrl: './navigation-sidebar.html',
  styleUrl: './navigation-sidebar.scss',
})
export class NavigationSidebar {
  private authService = inject(AuthService);

  isCollapsed = signal(false);

  navItems = computed(() => {
    const role = this.authService.getRole();
    return role === RoleEnum.Instructor ? INSTRUCTOR_NAV_ITEMS : STUDENT_NAV_ITEMS;
  });

  toggleCollapse(): void {
    this.isCollapsed.update((v) => !v);
  }
}
