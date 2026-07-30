import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IJoinQuizRequest, IJoinQuizResponse, IQuestionResponse, ISubmitData, ISubmitQuizResponse } from '../interfaces/exam';

@Injectable({
  providedIn: 'root',
})

export class ExamService {
  private http = inject(HttpClient);

  joinQuiz(data: IJoinQuizRequest): Observable<IJoinQuizResponse> {
    return this.http.post<IJoinQuizResponse>('quiz/join', data);
  }

  submitQuiz(id: string | null, data: ISubmitData): Observable<ISubmitQuizResponse> {
    return this.http.post<ISubmitQuizResponse>(`quiz/submit/${id}`,data);
  }

  getQuestionsWithoutAnswers(id: string): Observable<IQuestionResponse> {
    return this.http.get<IQuestionResponse>(`quiz/without-answers/${id}`);
  }
}
