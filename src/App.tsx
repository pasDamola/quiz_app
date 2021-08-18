import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';
// Components
import QuestionCard from './components/QuestionCard';
import ResultCard from './components/ResultCard';
// types
import { QuestionsState, Difficulty } from './API';
// Styles
import { GlobalStyle, Wrapper} from './App.styles';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const TOTAL_QUESTIONS = 10;

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionsState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [welcomeState, setWelcomeState] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);
    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.HARD
    );
    if(Array.isArray(newQuestions) === false) {
      setIsError(true);
      setErrorMessage("Network error, failed to fetch... try again");
      setLoading(false);
      setWelcomeState(false);
    } else if(Array.isArray(newQuestions)) {
      setQuestions(newQuestions);
      setScore(0);
      setUserAnswers([]);
      setNumber(0);
      setLoading(false);
      setWelcomeState(false);
      setIsError(false);
      setShowResult(false);
    }
  };

  const checkAnswer = (e: any) => {
    if (!gameOver) {
      // User's answer
      const answer = e.currentTarget.value;
      // Check answer against correct answer
      const correct = questions[number].correct_answer === answer;
      // Add score if answer is correct
      if (correct) setScore((prev) => prev + 1);
      // Save the answer in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const showAnswers = (e: any) => {
    e.preventDefault();
    setShowResult(true);
  }

  const nextQuestion = () => {
    // Move on to the next question if not the last question
    const nextQ = number + 1;

    if (nextQ === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQ);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
      <h1>The Trivia Challenge!</h1>
      {
        isError && (
          <>
          <p className="welcome-message">{errorMessage}</p>
          <button className='start' onClick={startTrivia}>
              TRY AGAIN
          </button>
          </>
        )
      }
      {
        showResult ? (
          <>
            <button className='start' onClick={startTrivia}>PLAY AGAIN?</button>
            <p className='score'>Score: {score}</p>
            <ResultCard
             answers={userAnswers}
            />
          </>
        ) : (
          <>
          {welcomeState && (
            <>
            <p className="welcome-message"> You will be presented with 10 True or False questions</p>
            <p className="welcome-message">Can you score 100?</p>
            <p className="beware">Please Beware! You have only one attempt at each question</p>
            <button className='start' onClick={startTrivia}>
              BEGIN
            </button>
            </>
            )
          }
          {loading ? <p>Loading Questions...</p> : null}
          {!loading && !gameOver && !isError && (
            <QuestionCard
              category={questions[number].category}
              questionNr={number + 1}
              totalQuestions={TOTAL_QUESTIONS}
              question={questions[number].question}
              answers={questions[number].answers}
              userAnswer={userAnswers ? userAnswers[number] : undefined}
              callback={checkAnswer}
            />
          )}
          {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
            <button className='next' onClick={nextQuestion}>
              Next Question
            </button>
          ) : null}
          {userAnswers.length === TOTAL_QUESTIONS && ( <button className='start' onClick={showAnswers}>SEE RESULTS</button>)}
        </>
        )
      }
      </Wrapper>
    </>
  );
};

export default App;
