import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '../../../contexts/ProgressContext';

interface PatternDetectiveProps {
    grade: number;
}

// Define pattern types with increasing complexity
type PatternType = 'sequence' | 'alternating' | 'fibonacci' | 'geometric' | 'conditional';

interface Pattern {
    items: (string | number)[];
    nextItems: (string | number)[];
    type: PatternType;
    description: string;
    difficulty: number; // 1-5 scale
}

// Helper function to generate patterns based on grade level
const generatePatterns = (grade: number): Pattern[] => {
    // Basic patterns for younger students (Class 5-6)
    const basicPatterns: Pattern[] = [
        {
            items: [2, 4, 6, 8],
            nextItems: [10, 12],
            type: 'sequence',
            description: 'Count by 2s',
            difficulty: 1
        },
        {
            items: [1, 3, 5, 7],
            nextItems: [9, 11],
            type: 'sequence',
            description: 'Count by odd numbers',
            difficulty: 1
        },
        {
            items: ['🔴', '🔵', '🔴', '🔵'],
            nextItems: ['🔴', '🔵'],
            type: 'alternating',
            description: 'Alternating colors',
            difficulty: 1
        },
        {
            items: ['🔺', '🔻', '🔺', '🔻'],
            nextItems: ['🔺', '🔻'],
            type: 'alternating',
            description: 'Alternating shapes',
            difficulty: 1
        },
        {
            items: [5, 10, 15, 20],
            nextItems: [25, 30],
            type: 'sequence',
            description: 'Count by 5s',
            difficulty: 2
        },
    ];

    // Intermediate patterns for middle grades (Class 7-8)
    const intermediatePatterns: Pattern[] = [
        {
            items: [1, 1, 2, 3, 5],
            nextItems: [8, 13],
            type: 'fibonacci',
            description: 'Fibonacci sequence',
            difficulty: 3
        },
        {
            items: [2, 6, 18, 54],
            nextItems: [162, 486],
            type: 'geometric',
            description: 'Multiply by 3',
            difficulty: 3
        },
        {
            items: ['🔴🔵', '🔵🔴', '🔴🔵', '🔵🔴'],
            nextItems: ['🔴🔵', '🔵🔴'],
            type: 'alternating',
            description: 'Alternating pairs',
            difficulty: 3
        },
        {
            items: [100, 90, 80, 70],
            nextItems: [60, 50],
            type: 'sequence',
            description: 'Decreasing by 10',
            difficulty: 2
        },
        {
            items: [3, 6, 12, 24],
            nextItems: [48, 96],
            type: 'geometric',
            description: 'Multiply by 2',
            difficulty: 3
        },
    ];

    // Advanced patterns for older students (Class 9-10)
    const advancedPatterns: Pattern[] = [
        {
            items: [1, 4, 9, 16, 25],
            nextItems: [36, 49],
            type: 'sequence',
            description: 'Square numbers',
            difficulty: 4
        },
        {
            items: [1, 8, 27, 64],
            nextItems: [125, 216],
            type: 'sequence',
            description: 'Cube numbers',
            difficulty: 4
        },
        {
            items: [2, 6, 12, 20, 30],
            nextItems: [42, 56],
            type: 'sequence',
            description: 'Increasing differences',
            difficulty: 5
        },
        {
            items: ['🔴🔵🔴', '🔵🔴🔵', '🔴🔵🔴', '🔵🔴🔵'],
            nextItems: ['🔴🔵🔴', '🔵🔴🔵'],
            type: 'alternating',
            description: 'Alternating triplets',
            difficulty: 4
        },
        {
            items: [3, 6, 5, 10, 9, 18],
            nextItems: [17, 34],
            type: 'conditional',
            description: 'Alternating operations (×2, -1)',
            difficulty: 5
        },
    ];

    // Select patterns based on grade level
    let availablePatterns: Pattern[] = [];

    if (grade <= 6) {
        // For grades 5-6, use only basic patterns
        availablePatterns = basicPatterns;
    } else if (grade <= 8) {
        // For grades 7-8, use basic and intermediate patterns
        availablePatterns = [...basicPatterns, ...intermediatePatterns];
    } else {
        // For grades 9-10, use all patterns
        availablePatterns = [...basicPatterns, ...intermediatePatterns, ...advancedPatterns];
    }

    // Further adjust difficulty based on exact grade
    return availablePatterns.filter(pattern => {
        if (grade === 5) return pattern.difficulty <= 2;
        if (grade === 6) return pattern.difficulty <= 3;
        if (grade === 7) return pattern.difficulty <= 3;
        if (grade === 8) return pattern.difficulty <= 4;
        if (grade === 9) return pattern.difficulty <= 5;
        if (grade === 10) return pattern.difficulty <= 5;
        return true;
    });
};

const PatternDetective: React.FC<PatternDetectiveProps> = ({ grade }) => {
    const [patterns, setPatterns] = useState<Pattern[]>([]);
    const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds per pattern
    const [streak, setStreak] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const { recordActivity } = useProgress();

    // Get current pattern first
    const currentPattern = patterns[currentPatternIndex];
    
    // Generate options for the next item in the pattern using useMemo to prevent regeneration
    const options = useMemo((): (string | number)[] => {
        if (!currentPattern) return [];

        const correctAnswer = currentPattern.nextItems[0];
        let optionsArray: (string | number)[] = [correctAnswer];

        // Generate 3 incorrect options
        while (optionsArray.length < 4) {
            let incorrectOption: string | number;

            if (typeof correctAnswer === 'number') {
                // For number patterns, create plausible wrong answers
                const variation = Math.floor(correctAnswer * 0.3) + 1;
                incorrectOption = correctAnswer + (Math.random() > 0.5 ? variation : -variation);
            } else {
                // For string patterns (emojis), use other emojis
                const emojis = ['🔴', '🔵', '🔺', '🔻', '⭐', '🟢', '🟣', '🟡', '⚫'];
                incorrectOption = emojis[Math.floor(Math.random() * emojis.length)];
            }

            // Ensure no duplicates
            if (!optionsArray.includes(incorrectOption)) {
                optionsArray.push(incorrectOption);
            }
        }

        // Shuffle options
        return optionsArray.sort(() => 0.5 - Math.random());
    }, [currentPattern, currentPatternIndex]); // Regenerate only when pattern changes
    
    // Define handleSubmit after currentPattern and options are available
    const handleSubmit = useCallback(() => {
        if (!currentPattern || selectedOption === null) return;

        const isCorrect = options[selectedOption] === currentPattern.nextItems[0];

        // Update score based on correctness and time
        if (isCorrect) {
            const timeBonus = Math.floor(timeRemaining / 10);
            const difficultyBonus = currentPattern.difficulty;
            const newScore = score + 10 + timeBonus + difficultyBonus;
            setScore(newScore);
            setStreak(streak + 1);
        } else {
            setStreak(0);
        }

        setShowFeedback(true);
        setTimeRemaining(0);
    }, [currentPattern, selectedOption, options, timeRemaining, score, setScore, streak, setStreak, setShowFeedback, setTimeRemaining]);

    // Initialize patterns based on grade
    useEffect(() => {
        const generatedPatterns = generatePatterns(grade);
        // Shuffle and take 5 patterns
        const shuffled = [...generatedPatterns].sort(() => 0.5 - Math.random());
        setPatterns(shuffled.slice(0, 5));
    }, [grade]);

    // Timer effect
    useEffect(() => {
        if (gameCompleted || patterns.length === 0 || showFeedback) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameCompleted, patterns.length, showFeedback, handleSubmit]);

    const handleOptionSelect = (index: number) => {
        if (showFeedback) return;
        setSelectedOption(index);
    };

    const handleNextPattern = () => {
        if (currentPatternIndex < patterns.length - 1) {
            setCurrentPatternIndex(currentPatternIndex + 1);
            setSelectedOption(null);
            setShowFeedback(false);
            setTimeRemaining(60); // Reset timer
        } else {
            setGameCompleted(true);
            // Record activity in progress context
            const xpEarned = calculateXpEarned();
            recordActivity({
                gamePlayed: true,
                gameCompleted: true,
                xpEarned
            });
        }
    };

    // Calculate XP earned based on score and grade level
    const calculateXpEarned = () => {
        const baseXp = 10; // Base XP for completing the game
        const scoreXp = score / 5; // XP from score
        const gradeMultiplier = grade / 5; // Higher grades earn more XP

        return Math.round(baseXp + (scoreXp * gradeMultiplier));
    };

    if (patterns.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (gameCompleted) {
        const xpEarned = calculateXpEarned();

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto"
            >
                <h2 className="text-3xl font-bold text-white mb-6 text-center">🎉 Pattern Detective Completed!</h2>
                <div className="text-center">
                    <p className="text-xl text-gray-300 mb-4">Your Score:</p>
                    <p className="text-4xl font-bold text-purple-400 mb-6">{score}</p>
                    <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((score / (patterns.length * 20)) * 100, 100)}%` }}
                        ></div>
                    </div>
                    <p className="text-gray-400 mb-4">
                        {score >= patterns.length * 15 ? 'Pattern Master! 🏆' :
                            score >= patterns.length * 10 ? 'Great pattern recognition! 🌟' :
                                score >= patterns.length * 5 ? 'Good effort! 👍' : 'Keep practicing! 💪'}
                    </p>
                    <p className="text-green-400 font-semibold">+ {xpEarned} XP earned!</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Pattern Detective</h2>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Pattern {currentPatternIndex + 1} of {patterns.length}</p>
                    <p className="text-lg font-semibold text-purple-400">Score: {score}</p>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-white">Find the pattern:</p>
                    <div className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                        Time: {timeRemaining}s
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-6">
                    {currentPattern.items.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                transition: { delay: idx * 0.1 }
                            }}
                            className="w-16 h-16 flex items-center justify-center bg-white/20 rounded-lg text-2xl"
                        >
                            {item}
                        </motion.div>
                    ))}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, transition: { delay: currentPattern.items.length * 0.1 } }}
                        className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-lg text-2xl border-2 border-dashed border-white/30"
                    >
                        ?
                    </motion.div>
                </div>

                <p className="text-gray-300 mb-4 text-center">What comes next in the pattern?</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {options.map((option, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-4 rounded-xl border-2 flex items-center justify-center text-2xl transition-all duration-200 ${selectedOption === idx
                                ? showFeedback
                                    ? option === currentPattern.nextItems[0]
                                        ? 'bg-green-500/20 border-green-500 text-green-300'
                                        : 'bg-red-500/20 border-red-500 text-red-300'
                                    : 'bg-purple-500/20 border-purple-500 text-white'
                                : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30'
                                }`}
                            onClick={() => handleOptionSelect(idx)}
                            disabled={showFeedback}
                        >
                            {option}
                        </motion.button>
                    ))}
                </div>

                {showFeedback ? (
                    <div className="text-center mb-4">
                        {selectedOption !== null && options[selectedOption] === currentPattern.nextItems[0] ? (
                            <p className="text-green-400">Correct! The pattern is: {currentPattern.description}</p>
                        ) : (
                            <p className="text-red-400">Not quite. The pattern is: {currentPattern.description}</p>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                            onClick={handleNextPattern}
                        >
                            {currentPatternIndex < patterns.length - 1 ? 'Next Pattern' : 'Finish Game'}
                        </motion.button>
                    </div>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSubmit}
                        disabled={selectedOption === null}
                    >
                        Submit Answer
                    </motion.button>
                )}

                {streak > 1 && (
                    <p className="text-yellow-400 text-center mt-2">🔥 {streak} streak!</p>
                )}
            </div>
        </motion.div>
    );
};

export default PatternDetective;