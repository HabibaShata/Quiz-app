import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IQuiz, IQuizPayload, IQuizResponse } from '../interfaces/quiz';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class QuizzesService {
  private http = inject(HttpClient);

  getAllQuizzes(): Observable<IQuiz[]> {
    return this.http.get<IQuiz[]>(`quiz`);
  }
  getFirstFiveIncomming(): Observable<IQuiz[]> {
    return this.http.get<IQuiz[]>(`quiz/incomming`);
  }

  getLastFiveCompleted(): Observable<IQuiz[]> {
    return this.http.get<IQuiz[]>(`quiz/completed`);
  }

  createQuiz(newQuiz: IQuizPayload): Observable<IQuizResponse> {
    return this.http.post<IQuizResponse>(`quiz`, newQuiz);
  }

  updateQuiz(id: string, newQuiz: IQuizPayload): Observable<IQuizResponse> {
    return this.http.put<IQuizResponse>(`quiz/update/${id}`, newQuiz);
  }
}
