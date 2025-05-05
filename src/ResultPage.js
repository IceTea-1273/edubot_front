import React from 'react';
import { useUserContext } from './UserContext';
import styles from './ResultPage.module.css';
import { useLocation, useNavigate } from 'react-router-dom';

function ResultPage() {
    const location = useLocation();
    const state = location.state || {};
    const navigate = useNavigate();
    const { selectedContinent } = useUserContext();

    const totalQuestions = state.total || 10;
    const correct = state.correct || 0;
    const incorrect = totalQuestions - correct;
    const percentage = Math.round((correct / totalQuestions) * 100);

    // Format time (MM:SS)
    const rawTime = state.time || '0:00'; // expect duration string like "125 sec" or "2 min 5 sec"
    let formattedTime = '00:00';

    if (typeof rawTime === 'string' && rawTime.includes('min')) {
        // Support older "2 min 5 sec" format
        const minMatch = rawTime.match(/(\d+)\s*min/);
        const secMatch = rawTime.match(/(\d+)\s*sec/);
        const min = minMatch ? parseInt(minMatch[1]) : 0;
        const sec = secMatch ? parseInt(secMatch[1]) : 0;
        const paddedMin = String(min).padStart(2, '0');
        const paddedSec = String(sec).padStart(2, '0');
        formattedTime = `${paddedMin}:${paddedSec}`;
    } else if (typeof rawTime === 'string' && rawTime.includes(':')) {
        // Already in MM:SS
        formattedTime = rawTime;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.score}>{correct}/{totalQuestions}</div>
                <div className={styles.continent}>{selectedContinent}</div>
            </div>

            <h2 className={styles.title}>Your test results</h2>
            <p className={styles.time}>Your time: {formattedTime}</p>

            <div className={styles.resultsGrid}>
                <div className={styles.chart}>
                    <svg width="150" height="150" viewBox="0 0 36 36">
                        <circle
                            className={styles.circleBg}
                            cx="18" cy="18" r="15.9155"
                        />
                        <circle
                            className={styles.circle}
                            cx="18" cy="18" r="15.9155"
                            strokeDasharray={`${percentage}, 100`}
                        />
                        <text x="18" y="20.35" className={styles.percentText} textAnchor="middle">
                            {percentage}%
                        </text>
                    </svg>
                </div>

                <div className={styles.stats}>
                    <p><strong>Correct</strong> <span className={styles.correctBox}>{correct}</span></p>
                    <p><strong>Incorrect</strong> <span className={styles.incorrectBox}>{incorrect}</span></p>
                </div>
            </div>

            <div className={styles.buttons}>
                <button onClick={() => navigate('/quiz')}>Retake test</button>
                <button onClick={() => navigate('/select-continent')}>Next test</button>
                <button onClick={() => navigate('/leaderboard')}>Leaderboard</button>
            </div>
        </div>
    );
}

export default ResultPage;
