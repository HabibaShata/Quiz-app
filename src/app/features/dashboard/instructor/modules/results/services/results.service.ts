import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResultsResponse } from '../interfaces/results';

@Injectable({
  providedIn: 'root',
})
export class ResultsService {
  private http = inject(HttpClient);

  getAllResults(): Observable<IResultsResponse[]> {
    return this.http.get<IResultsResponse[]>(`quiz/result`);
  }
}
