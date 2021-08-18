export type Question = {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
};

export enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}


export type QuestionsState = Question & { answers: string[] };

export const fetchQuizQuestions = async (amount: number, difficulty: Difficulty): Promise<QuestionsState[]> => {
  try {
    const endpoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=boolean`;
    const data = await (await fetch(endpoint)).json();
    return data.results.map((question: Question) => ({
      ...question,
      answers: ["True", "False"],
    }))
  } catch (error) {
    return error;
  }
};
