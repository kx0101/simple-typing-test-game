import React, { useEffect, useState } from 'react';
import { words } from '../data/words';
import { shuffle } from '../utils/generalUtils';

export const Game = () => {
    const TIMER_DURATION = 10;

    const [typedWord, setTypedWord] = useState('');
    const [score, setScore] = useState(0);

    const [timer, setTimer] = useState(TIMER_DURATION);

    const [shuffledWords, setShuffledWords] = useState([]);

    const [isTypingStarted, setIsTypingStarted] = useState(false);
    const [finished, setFinished] = useState(false);

    const [index, setIndex] = useState(0);
    const [correctWords, setCorrectWords] = useState<string[]>([]);

    useEffect(() => {
        setShuffledWords(shuffle(words));
    }, []);

    useEffect(() => {
        if (isTypingStarted && timer > 0) {
            const timerId = setInterval(() => {
                setTimer((prevCount) => prevCount - 1);
            }, 1000);

            return () => {
                clearInterval(timerId);
            };
        }
    }, [isTypingStarted, timer]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();

                checkWord();

                setIndex((index) => index + 1);
                setTypedWord('');
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [typedWord]);

    const onChange = (e) => {
        if (!isTypingStarted) {
            setIsTypingStarted(true);
        }

        setTypedWord(e.target.value);
    };

    const checkWord = () => {
        if (typedWord.length === 0) {
            return;
        }

        if (typedWord.trim() === shuffledWords[index].trim()) {
            setScore((prevScore) => prevScore + 1);
            setCorrectWords((prevWords) => [...prevWords, typedWord]);
        }

        if (timer === 0 || index === shuffledWords.length - 1) {
            setIsTypingStarted(false);
            setFinished(true);
        }
    }

    const calculateWPM = () => {
        if (timer === TIMER_DURATION) {
            return 0;
        }

        const totalTimeInSeconds = TIMER_DURATION - timer;
        const wpm = (score / totalTimeInSeconds) * 60;

        return Math.round(wpm);
    };

    const renderWords = () => {
        return shuffledWords.map((word) => {
            const isCorrect = correctWords.includes(word);
            const className = isCorrect ? "bg-green-400" : "bg-red-400";

            return (
                <p
                    key={word}
                    className={`mt-4 p-2 text-black rounded-md ${className}`}
                >
                    {word}
                </p>
            );
        });
    };

    const restartGame = () => {
        setTypedWord('');
        setScore(0);
        setTimer(TIMER_DURATION);
        setShuffledWords(shuffle(words));
        setIsTypingStarted(false);
        setFinished(false);
        setIndex(0);
        setCorrectWords([]);
    };

    return (
        <div className="flex flex-col justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-500 min-h-screen">
            <div className="max-w-md mx-auto">
                <h1 className="text-4xl text-center font-bold text-white mb-4 mt-4">Typing Game</h1>

                <div className="bg-white rounded-lg shadow-lg p-4 mb-24">
                    <p className="text-lg font-semibold text-gray-800">Score: {score}/{words.length}</p>
                    <p className="text-lg text-gray-800">WPM: {calculateWPM()}</p>

                    {finished && (
                        <button
                            className="mt-4 border-4 border-gray-800 text-center px-6 py-3 text-lg font-bold bg-green-400 text-black rounded-lg hover:border-red-600"
                            onClick={restartGame}
                        >
                            Restart
                        </button>
                    )}
                </div>


                {!finished && (
                    <div>
                        <p className="text-4xl text-center font-bold text-white mb-8">Timer: {timer}</p>
                        <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
                            <p className="text-4xl text-center font-bold text-gray-800">{shuffledWords[index]}</p>
                        </div>
                    </div>
                )}

                {finished && (
                    <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
                        {renderWords()}
                    </div>
                )}

                <input
                    className="w-full h-16 text-3xl px-4 border border-gray-400 rounded-lg"
                    type="text"
                    value={typedWord}
                    onChange={onChange}
                    disabled={finished}
                    placeholder='Start typing here!'
                />
            </div>
        </div>
    );
};
