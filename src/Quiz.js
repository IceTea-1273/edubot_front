import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from './UserContext';
import styles from './Quiz.module.css';

function Quiz() {
    const { selectedContinent, selectedDifficulty, token } = useUserContext();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [startTime] = useState(new Date().toISOString());
    const [elapsedTime, setElapsedTime] = useState(0);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!selectedContinent || !selectedDifficulty) {
            console.error('Continent or Difficulty not selected!');
            navigate('/select-continent');
            return;
        }

        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/eduBot/questions/${selectedContinent}/${selectedDifficulty}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setQuestions(response.data);
            } catch (error) {
                console.error('Failed to fetch questions:', error);
            }
        };

        fetchQuestions();

        const timer = setInterval(() => {
            setElapsedTime(Math.floor((new Date() - new Date(startTime)) / 1000));
        }, 1000);

        return () => clearInterval(timer); // Cleanup interval on unmount
    }, [selectedContinent, selectedDifficulty, navigate, token, startTime]);

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    const handleAnswer = async (selectedAnswer) => {
        const currentQuestion = questions[currentQuestionIndex];

        if (selectedAnswer === currentQuestion.correctAnswer) {
            setScore(prev => prev + (currentQuestion.points || 0));
            setCorrectAnswers(prev => prev + 1);
        }

        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            await submitQuiz();
        }
    };

    const submitQuiz = async () => {
        const end = new Date();
        const durationMs = end - new Date(startTime);

        const minutes = Math.floor(durationMs / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000);
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        try {
            const quizData = {
                user: { id: user.id },
                result: score,
                correctAnswers: correctAnswers,
                startTime: startTime,
                endTime: end.toISOString(),
                completed: true
            };

            await axios.post('http://localhost:8080/eduBot/quiz', quizData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // 🟢 NEW: Update highscore if current score is higher
            if (score > user.highscore) {
                await axios.patch(`http://localhost:8080/eduBot/user/highscore/${user.id}/${score}`, null, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Update localStorage too
                const updatedUser = { ...user, highscore: score };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            navigate('/results', {
                state: {
                    total: questions.length,
                    correct: correctAnswers,
                    time: formattedTime
                }
            });
        } catch (error) {
            console.error('Failed to submit quiz:', error);
        }
    };


    if (questions.length === 0) {
        return <div>Loading questions...</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className={styles.container}>
            {/* Header (orange bar) */}
            <div className={styles.questionInfoBar}>
                <div className={styles.questionCount}>
                    QUESTION {currentQuestionIndex + 1} OF {questions.length}
                </div>
                <div className={styles.continent}>{selectedContinent}</div>
                <div className={styles.timer}>{formatTime(elapsedTime)}</div>
            </div>

            <div className={styles.content}>
                <div className={styles.card}>
                    <p className={styles.question}>{currentQuestion.question}</p>
                    <div className={styles.answers}>
                        {Object.entries(currentQuestion.answers).map(([key, value]) => (
                            <button
                                key={key}
                                className={styles.answerButton}
                                onClick={() => handleAnswer(key)}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Quiz;
