import { ApiResponse } from '../../../../../../core/interfaces/api-response.model';

export interface ISubmitData {
  answers: Answer[];
}

interface Answer {
  question: string;
  answer: string;
}

export interface IJoinQuizRequest {
  code: string;
}


interface IJoinQuizResponseData {
  quiz: string;
  participant: string;
  score: number;
  started_at: string;
  _id: string;
  updatedAt: string;
  createdAt: string;
  __v: number;
}

export interface IQuestionResponse{
  data: IQuestionsData;
}

interface IQuestionsData {
  _id: string;
  code: string;
  title: string;
  description: string;
  status: string;
  instructor: string;
  group: string;
  questions_number: number;
  questions:  IQuizQuestion[];
  schadule: string;
  duration: number;
  score_per_question: number;
  type: string;
  difficulty: string;
  updatedAt: string;
  createdAt: string;
  __v: number;
}

interface IQuizQuestion {
  _id: string;
  title: string;
  options: Options;
}

interface Options {
  A: string;
  B: string;
  C: string;
  D: string;
  _id: string;
}

// Submit Interface
interface ISubmitQuizData {
  _id: string;
  quiz: string;
  participant: string;
  score: number;
  started_at: string;
  finished_at: string;
  questions: ISubmitQuestion[];
}

interface ISubmitQuestion {
  _id: string;
  title: string;
  options: Options;
  answer: string;
}


// ====== API Response Types ======
export type IJoinQuizResponse = ApiResponse<IJoinQuizResponseData>;
export type ISubmitQuizResponse = ApiResponse<ISubmitQuizData>;
