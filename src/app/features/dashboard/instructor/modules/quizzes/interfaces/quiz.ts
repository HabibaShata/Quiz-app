import { ApiResponse } from '../../../../../../core/interfaces/api-response.model';
import { QuestionDifficulty, QuestionType } from '../../../../../../shared/enums/question.enum';

export interface IQuiz {
import { IQuestion } from '../../questions/interfaces/questions';


export interface Quiz {
  _id: string;
  title: string;
  code: string;
  description: string;
  status: 'closed' | 'open' | string;
  instructor: string;
  group: string;
  questions_number: number;
  questions: string[];
  schadule: Date;
  duration: number;
  score_per_question: number;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  createdAt: string;
  updatedAt: string;
  participants: number;
  closed_at?: string;
  __v?: number;
}

export interface GroupInfo {
  _id: string;
  name: string;
}

export interface IQuizPayload {
  title: string;
  description: string;
  group: string;
  questions_number: number;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  schadule: Date;
  duration: number;
  score_per_question: number;
}

export interface GroupOption {
  label: string;
  value: string;
}

// ====== API Response Types ======
export type IQuizResponse = ApiResponse<IQuiz>;
export type UpcomingQuiz = IQuiz;
export type CompletedQuiz = IQuiz;
export type UpcomingQuiz = Quiz;
export type CompletedQuiz = Quiz;





export interface QuizDetails extends Omit<Quiz, 'questions'> {
  questions: IQuestion[];
}
