import { IQuiz } from "../../quizzes/interfaces/quiz";

export interface IResultsResponse {
  quiz: IQuiz;
  participants: any[];
}

