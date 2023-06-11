import React, { useEffect, useState } from 'react';
import { words } from '../data/words';
import { shuffle } from '../utils/generalUtils';

export const Game = () => {
    const [typedWord, setTypedWord] = useState('');
    const [score, setScore] = useState(0);

    const [timer, setTimer] = useState(10);

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
        if (typedWord.length == 0) {
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
        if (timer === 10) {
            return 0;
        }

        const totalTimeInSeconds = 10 - timer;
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

    return (
        <>
            <div className="flex flex-col justify-center">
                <h1>Typing game</h1>

                <p className="mt-8 text-2xl">Score: {score}/{words.length}</p>
                <p className="mt-4">WPM: {calculateWPM()}</p>

                {!finished && <p className="mt-16 text-2xl">Timer: {timer}</p>}

                <div>
                    {finished && (
                        <div className="flex justify-center">
                            <div>
                                {renderWords()}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex flex-row justify-center text-2xl font-bold">
                    <p>{shuffledWords[index]}</p>
                </div>

                <input
                    className="mt-8 h-16 text-3xl"
                    type="text"
                    value={typedWord}
                    onChange={onChange}
                    disabled={finished}
                />
            </div>
        </>
    );
};
