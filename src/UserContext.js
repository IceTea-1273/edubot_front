import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [token, setTokenState] = useState(localStorage.getItem('token') || '');
    const [selectedContinent, setSelectedContinent] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [questions, setQuestions] = useState([]);
    const [correctQuestions, setCorrectQuestions] = useState([]);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [user, setUser] = useState({
        id: null,
        name: '',
        highscore: null
    });

    // Centralized token setter that syncs with localStorage
    const setToken = (newToken) => {
        if (newToken) {
            localStorage.setItem('token', newToken);
        } else {
            localStorage.removeItem('token');
        }
        setTokenState(newToken);
    };

    // Optional: Ensure token in localStorage is always reflected in state (once on mount)
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken && !token) {
            setToken(savedToken);
        }
    }, []);

    const contextValue = useMemo(() => ({
        token,
        setToken,
        selectedContinent,
        setSelectedContinent,
        selectedDifficulty,
        setSelectedDifficulty,
        questions,
        setQuestions,
        correctQuestions,
        setCorrectQuestions,
        quizCompleted,
        setQuizCompleted,
        user,
        setUser
    }), [
        token,
        selectedContinent,
        selectedDifficulty,
        questions,
        correctQuestions,
        quizCompleted,
        user
    ]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
