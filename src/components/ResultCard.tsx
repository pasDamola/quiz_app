import React from 'react';
// Types
import { AnswerObject } from '../App';
// Styles
import { Wrapper } from './ResultCard.style';

type Props = {
    answers: AnswerObject[];
}

const ResultCard: React.FC<Props> = ({
    answers,
  }) => (
    <Wrapper>
      {/* <ul>
        {answers.map((answer) => (

            <li key={answer.question} className={answer.correct ? 'correct' :'incorrect'}>
                <span dangerouslySetInnerHTML={{ __html: answer.question }} />
            </li>
        ))}
      </ul> */}
      <>
        <div>
            <h3 className="correct">Correct</h3>
            {answers.map(({correct, question}, id) => (
                correct && (
                    <li key={id} >
                        <span dangerouslySetInnerHTML={{ __html: question }} />
                    </li>
                    )
                ))
            }
        </div>
        <div>
            <h3 className="incorrect">Incorrect</h3>
            {answers.map(({correct, question}, id) => (
                !correct && (
                    <li key={id}>
                        <span dangerouslySetInnerHTML={{ __html: question }} />
                    </li>
                )
                
                ))
            }
        </div>
      </>
      
    </Wrapper>
  );

export default ResultCard;