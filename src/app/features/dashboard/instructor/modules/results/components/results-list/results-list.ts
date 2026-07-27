import { Component, computed, inject, signal } from '@angular/core';
import { PageLayout } from "../../../../../../../shared/layouts/page-layout/page-layout";
import { ResultsService } from '../../services/results.service';
import { Loader } from "../../../../../../../shared/components/loader/loader";
import { EmptyStateComponent } from "../../../../../../../shared/components/empty-state/empty-state.component";
import { TranslatePipe,} from '@ngx-translate/core';
import { TableModule } from "primeng/table";
import { DatePipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { Button } from 'primeng/button';
import { GroupsService } from '../../../group/services/groups.service';
import { IGroupData } from '../../../group/interfaces/groups';
import { tap, switchMap } from 'rxjs';
import { IResultsResponse } from '../../interfaces/results';

@Component({
  selector: 'quiz-app-results-list',
  imports: [PageLayout, Loader, EmptyStateComponent, TranslatePipe, TableModule, DatePipe, RouterLink, Button],
  templateUrl: './results-list.html',
  styleUrl: './results-list.scss',
})
export class ResultsList {
  private resultsService = inject(ResultsService);
  private GroupsService = inject(GroupsService);
  groupsList = signal<IGroupData[]>([]);
  isLoading = signal<boolean>(false);
  currentPage = signal<number>(1);
  totalRecords = signal<number>(0)
  pageSize = signal<number>(10);
  resultsList = signal<IResultsResponse[]>([])


  ngOnInit(): void {
    this.fetchResultsWithGroup();
  }

  fetchResultsWithGroup() {
    this.isLoading.set(true)
    this.resultsService.getAllResults().pipe(
      tap(results => this.resultsList.set(results)),
      switchMap(() => this.GroupsService.getAllGroups())
    ).subscribe({
      next: groups => {
        this.isLoading.set(false);
        const groupIds = new Set(
          this.resultsList().map(r => r.quiz.group)
        );

        this.groupsList.set(
          groups.filter(group => groupIds.has(group._id))
        );
      }
    });
  }

  getGroupName(groupId: string): string {
    return this.groupsList().find(g => g._id === groupId)?.name ?? '-';
  }

  getPersonsCount(groupId: string): number {
    return this.groupsList().find(g => g._id === groupId)?.students.length ?? 0;
  }
}
