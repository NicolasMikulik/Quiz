import { useState } from "react";
import { resultInitalState } from "./constants";
import { firestore  } from "./firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";

const Quiz = ({ questions }) => {

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answerIdx, setAnswerIdx] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [result, setResult] = useState(resultInitalState);
    const { image, question, choices, correctAnswer } = questions[currentQuestion];
    const [showResult, setShowResult] = useState(false);

    const [name, setName] = useState("");
    const [nameInvalid, setNameInvalid] = useState(false);
    const [isNameFilled, setIsNameFilled] = useState(false);

    const resultsCollectionRef = collection( firestore, "firstresults");

    const onAnswerClick = (answer, index) => {
        setAnswerIdx(index);
        if (answer === correctAnswer) {
            setAnswer(true);
        } else {
            setAnswer(false);
        }
    }

    const onClickNext = () => {
        setAnswerIdx(null);
        setResult((prev) =>
            answer ? {
                ...prev,
                score: prev.score + 1,
                correctAnswers: prev.correctAnswers + 1,
            } : {
                ...prev,
                wrongAnswers: prev.wrongAnswers + 1,
            }
        )

        if (currentQuestion !== questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        } else {
            setCurrentQuestion(0);
            setShowResult(true);
            saveResults();
        }
    };
    
    const onTryAgain = () => {
        setResult(resultInitalState);
        setShowResult(false);
    }

    const onSubmitName = (e) => {
        e.preventDefault();
        if (name.length < 3) {
            setNameInvalid(true);
        } else {
            setIsNameFilled(true);
            setNameInvalid(false);
        }
    }

    const saveResults = async () => {
        var date = new Date();
        const score = Number(result.correctAnswers) + 1;
        await addDoc(resultsCollectionRef, {
            name: name, score: score, time: date
        });
        console.log(new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(date));
    }

    return (
        <>
            {!isNameFilled ?
                <div>
                    
                        <form onSubmit={onSubmitName}>
                            <div className="centered-div">
                                <input onChange={e => setName(e.target.value)}
                                       className="form-field"
                                       placeholder="Zadajte meno" />
                                       {nameInvalid ?
                                            <>
                                                <br></br>
                                                <label>Meno musí mať aspoň 3 znaky</label>
                                            </> : ""
                                       }
                            </div>
                            <div>
                                <br></br>
                                <button onClick={onSubmitName}
                                    className="button">Začať kvíz</button>
                            </div>
                        </form>
                </div>  
                :
                <div className="quiz-container">
                    {!showResult ? (
                        <>
                            <span className="active-question-no">{currentQuestion + 1}</span>
                            <span className="total-question">/{questions.length}</span>
                            <img src={image} />
                            <h2>{question}</h2>
                            <ul>
                                {
                                    choices.map((answer, index) => (
                                        <li
                                            onClick={() => onAnswerClick(answer, index)}
                                            key={answer}
                                            className={answerIdx === index ? 'selected-answer' : null}                            >
                                            {answer}
                                        </li>
                                    )
                                    )
                                }
                            </ul>
                            <div className="footer">
                                <button onClick={onClickNext} disabled={answerIdx === null}>
                                    {currentQuestion === questions.length - 1 ? "Vyhodnotenie" : "Ďalšia otázka"}
                                </button>
                            </div>
                        </>)
                        :
                        <div className="result">
                            <h3>Result</h3>
                            <p>Počet otázok: <span> {questions.length} </span></p>
                            {/* <p>Total Score: <span> {result.score} </span></p>*/}
                            <p>Správne odpovede: <span> {result.correctAnswers} </span></p>
                            <p>Nesprávne odpovede: <span> {result.wrongAnswers} </span></p>
                            {/*<button onClick={onTryAgain}>Try Again</button>*/}
                        </div>}

                </div>
            }
        </>    );
}

export default Quiz;