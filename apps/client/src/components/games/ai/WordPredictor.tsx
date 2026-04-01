import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { useProgress } from '../../../contexts/ProgressContext';

interface WordPredictorProps {
  grade: number;
}

interface Sentence {
  text: string;
  missingWord: string;
  options: string[];
  context?: string; // Additional context for higher grades
  difficulty: number; // 1-5 scale
}

// Generate sentences with missing words based on grade level
const generateSentences = (grade: number): Sentence[] => {
  // Basic sentences for younger students (Class 5-6)
  const basicSentences: Sentence[] = [
    {
      text: "The sky is _____.",
      missingWord: "blue",
      options: ["blue", "green", "yellow", "purple"],
      difficulty: 1
    },
    {
      text: "I like to eat _____ for breakfast.",
      missingWord: "cereal",
      options: ["cereal", "pizza", "cake", "candy"],
      difficulty: 1
    },
    {
      text: "The dog likes to _____ in the park.",
      missingWord: "play",
      options: ["play", "sleep", "read", "cook"],
      difficulty: 1
    },
    {
      text: "She wears a _____ on her head when it's cold.",
      missingWord: "hat",
      options: ["hat", "shoe", "glove", "sock"],
      difficulty: 2
    },
    {
      text: "The cat is _____ on the sofa.",
      missingWord: "sleeping",
      options: ["sleeping", "cooking", "driving", "swimming"],
      difficulty: 2
    }
  ];

  // Intermediate sentences for middle grades (Class 7-8)
  const intermediateSentences: Sentence[] = [
    {
      text: "The scientist conducted an _____ to test the hypothesis.",
      missingWord: "experiment",
      options: ["experiment", "adventure", "exercise", "exhibition"],
      context: "Topic: Science class",
      difficulty: 3
    },
    {
      text: "The ancient civilization built _____ to honor their gods.",
      missingWord: "temples",
      options: ["temples", "hospitals", "schools", "libraries"],
      context: "Topic: History lesson",
      difficulty: 3
    },
    {
      text: "The author used _____ to describe the character's feelings.",
      missingWord: "metaphors",
      options: ["metaphors", "calculators", "telescopes", "thermometers"],
      context: "Topic: English literature",
      difficulty: 3
    },
    {
      text: "The ecosystem's _____ was disrupted by the invasive species.",
      missingWord: "balance",
      options: ["balance", "temperature", "color", "name"],
      context: "Topic: Environmental science",
      difficulty: 4
    },
    {
      text: "The politician's speech was designed to _____ the audience.",
      missingWord: "persuade",
      options: ["persuade", "confuse", "bore", "frighten"],
      context: "Topic: Public speaking",
      difficulty: 4
    }
  ];

  // Advanced sentences for older students (Class 9-10)
  const advancedSentences: Sentence[] = [
    {
      text: "The economic _____ led to widespread unemployment and financial instability.",
      missingWord: "recession",
      options: ["recession", "celebration", "renovation", "expedition"],
      context: "Topic: Economics - The article discusses the impact of market downturns on society.",
      difficulty: 4
    },
    {
      text: "The novel's protagonist undergoes a significant _____ as the plot develops.",
      missingWord: "transformation",
      options: ["transformation", "transportation", "transaction", "translation"],
      context: "Topic: Literary analysis - Character development in modern fiction.",
      difficulty: 4
    },
    {
      text: "Quantum physics challenges our _____ of reality at the subatomic level.",
      missingWord: "perception",
      options: ["perception", "celebration", "decoration", "plantation"],
      context: "Topic: Physics - Discussion of quantum mechanics principles.",
      difficulty: 5
    },
    {
      text: "The philosophical _____ examines the nature of knowledge and its limitations.",
      missingWord: "discourse",
      options: ["discourse", "discord", "discount", "discovery"],
      context: "Topic: Philosophy - Epistemological debates among scholars.",
      difficulty: 5
    },
    {
      text: "The algorithm's _____ allows it to improve its performance over time without explicit programming.",
      missingWord: "learning",
      options: ["learning", "lighting", "limiting", "listing"],
      context: "Topic: Computer Science - Introduction to machine learning concepts.",
      difficulty: 5
    }
  ];

  // Select sentences based on grade level
  let availableSentences: Sentence[] = [];

  if (grade <= 6) {
    // For grades 5-6, use only basic sentences
    availableSentences = basicSentences;
  } else if (grade <= 8) {
    // For grades 7-8, use basic and intermediate sentences
    availableSentences = [...basicSentences, ...intermediateSentences];
  } else {
    // For grades 9-10, use all sentences
    availableSentences = [...basicSentences, ...intermediateSentences, ...advancedSentences];
  }

  // Further adjust difficulty based on exact grade
  return availableSentences.filter(sentence => {
    if (grade === 5) return sentence.difficulty <= 2;
    if (grade === 6) return sentence.difficulty <= 3;
    if (grade === 7) return sentence.difficulty <= 3;
    if (grade === 8) return sentence.difficulty <= 4;
    if (grade === 9) return sentence.difficulty <= 5;
    if (grade === 10) return sentence.difficulty <= 5;
    return true;
  });
};

// Generate a sequence of sentences for a paragraph prediction task (higher grades)
const generateParagraph = (grade: number): { sentences: string[], missingWords: string[], options: string[][] } => {
  if (grade <= 7) {
    // Simple paragraph for grade 7
    return {
      sentences: [
        "The students went on a field trip to the museum.",
        "They saw many interesting _____.",
        "The guide explained the history of each _____.",
        "Everyone enjoyed learning new _____."
      ],
      missingWords: ["exhibits", "artifact", "facts"],
      options: [
        ["exhibits", "games", "teachers", "buses"],
        ["artifact", "student", "building", "ticket"],
        ["facts", "songs", "jokes", "games"]
      ]
    };
  } else if (grade <= 9) {
    // More complex paragraph for grade 8-9
    return {
      sentences: [
        "The scientific method provides a systematic approach to research.",
        "It begins with making an _____ about a phenomenon.",
        "Researchers then design _____ to test their hypotheses.",
        "Data collection and _____ follow the experimental phase.",
        "Finally, scientists draw _____ based on their findings."
      ],
      missingWords: ["observation", "experiments", "analysis", "conclusions"],
      options: [
        ["observation", "argument", "investment", "objection"],
        ["experiments", "celebrations", "advertisements", "tournaments"],
        ["analysis", "synthesis", "paralysis", "dialysis"],
        ["conclusions", "confusions", "contusions", "collusions"]
      ]
    };
  } else {
    // Advanced paragraph for grade 10
    return {
      sentences: [
        "Artificial intelligence systems utilize various algorithms to process information.",
        "Neural networks mimic the _____ of the human brain to recognize patterns.",
        "Machine learning models improve their _____ through exposure to more data.",
        "Natural language processing enables computers to _____ and generate human language.",
        "Computer vision algorithms can _____ and interpret visual information from the world.",
        "These technologies continue to _____ our understanding of what machines can accomplish."
      ],
      missingWords: ["structure", "performance", "understand", "detect", "expand"],
      options: [
        ["structure", "schedule", "sculpture", "stricture"],
        ["performance", "permanence", "preference", "persistence"],
        ["understand", "undermine", "undertake", "underline"],
        ["detect", "deflect", "defect", "deject"],
        ["expand", "expend", "explode", "explain"]
      ]
    };
  }
};

const WordPredictor: React.FC<WordPredictorProps> = ({ grade }) => {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 seconds per sentence
  const [gameMode, setGameMode] = useState<'sentence' | 'paragraph'>('sentence');
  const [paragraph, setParagraph] = useState<{ sentences: string[], missingWords: string[], options: string[][] } | null>(null);
  const [paragraphAnswers, setParagraphAnswers] = useState<string[]>([]);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [showParagraphFeedback, setShowParagraphFeedback] = useState(false);

  const { currentUser } = useAuth();
  const { recordActivity } = useProgress();

  // Initialize game based on grade
  useEffect(() => {
    // For higher grades, offer paragraph mode
    if (grade >= 7) {
      setGameMode(Math.random() > 0.5 ? 'sentence' : 'paragraph');
    } else {
      setGameMode('sentence');
    }

    // Generate sentences
    const generatedSentences = generateSentences(grade);
    // Shuffle and take up to 5 sentences
    const shuffled = [...generatedSentences].sort(() => 0.5 - Math.random());
    setSentences(shuffled.slice(0, 5));

    // Generate paragraph if in paragraph mode
    if (grade >= 7) {
      const generatedParagraph = generateParagraph(grade);
      setParagraph(generatedParagraph);
      setParagraphAnswers(new Array(generatedParagraph.missingWords.length).fill(''));
    }
  }, [grade]);

  // Timer effect
  useEffect(() => {
    if (gameCompleted ||
      (gameMode === 'sentence' && (sentences.length === 0 || showFeedback)) ||
      (gameMode === 'paragraph' && (paragraph === null || showParagraphFeedback))) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (gameMode === 'sentence') {
            handleSubmit();
          } else {
            handleParagraphSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameCompleted, sentences.length, showFeedback, gameMode, paragraph, showParagraphFeedback]);

  const currentSentence = sentences[currentSentenceIndex];

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleParagraphOptionSelect = (option: string, index: number) => {
    const newAnswers = [...paragraphAnswers];
    newAnswers[index] = option;
    setParagraphAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (!currentSentence || !selectedOption) return;

    const isCorrect = selectedOption === currentSentence.missingWord;
    const sentenceScore = isCorrect ? 10 + (currentSentence.difficulty * 2) : 0;
    const timeBonus = Math.floor(timeRemaining / 5);

    setScore(score + sentenceScore + timeBonus);
    setShowFeedback(true);
    setTimeRemaining(0);
  };

  const handleParagraphSubmit = () => {
    if (!paragraph) return;

    let correctCount = 0;
    paragraph.missingWords.forEach((word, index) => {
      if (paragraphAnswers[index] === word) {
        correctCount++;
      }
    });

    const paragraphScore = correctCount * (10 + Math.floor(grade / 2));
    const timeBonus = Math.floor(timeRemaining / 3);

    setScore(score + paragraphScore + timeBonus);
    setShowParagraphFeedback(true);
    setTimeRemaining(0);
  };

  const handleNextSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setTimeRemaining(30); // Reset timer
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

  const handleFinishParagraph = () => {
    setGameCompleted(true);
    // Record activity in progress context
    const xpEarned = calculateXpEarned();
    recordActivity({
      gamePlayed: true,
      gameCompleted: true,
      xpEarned
    });
  };

  // Calculate XP earned based on score and grade level
  const calculateXpEarned = () => {
    const baseXp = 15; // Base XP for completing the game
    const scoreXp = score / 2; // XP from score
    const gradeMultiplier = grade / 5; // Higher grades earn more XP

    return Math.round(baseXp + (scoreXp * gradeMultiplier));
  };

  // Render sentence with blank
  const renderSentenceWithBlank = (sentence: string) => {
    return sentence.replace('_____', '______');
  };

  // Render paragraph with blanks
  const renderParagraphWithBlanks = () => {
    if (!paragraph) return null;

    return (
      <div className="space-y-2">
        {paragraph.sentences.map((sentence, index) => {
          if (index === 0 || !sentence.includes('_____')) {
            return <p key={index} className="text-white">{sentence}</p>;
          }

          const blankIndex = index - 1;
          const parts = sentence.split('_____');

          return (
            <p key={index} className="text-white flex items-center flex-wrap">
              {parts[0]}
              <span className="inline-block mx-1 px-2 py-1 bg-white/10 rounded min-w-[80px] text-center">
                {showParagraphFeedback ? (
                  <span className={paragraphAnswers[blankIndex] === paragraph.missingWords[blankIndex] ? 'text-green-400' : 'text-red-400'}>
                    {paragraphAnswers[blankIndex] || '______'}
                  </span>
                ) : (
                  paragraphAnswers[blankIndex] || '______'
                )}
              </span>
              {parts[1]}
            </p>
          );
        })}
      </div>
    );
  };

  if ((gameMode === 'sentence' && sentences.length === 0) ||
    (gameMode === 'paragraph' && paragraph === null)) {
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
        <h2 className="text-3xl font-bold text-white mb-6 text-center">🔤 Word Predictor Completed!</h2>
        <div className="text-center">
          <p className="text-xl text-gray-300 mb-4">Your Score:</p>
          <p className="text-4xl font-bold text-purple-400 mb-6">{score}</p>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((score / (gameMode === 'sentence' ? sentences.length * 20 : 100)) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-gray-400 mb-4">
            {score >= (gameMode === 'sentence' ? sentences.length * 15 : 80) ? 'Word Prediction Expert! 🏆' :
              score >= (gameMode === 'sentence' ? sentences.length * 10 : 60) ? 'Great predictor! 🌟' :
                score >= (gameMode === 'sentence' ? sentences.length * 5 : 40) ? 'Good effort! 👍' : 'Keep practicing! 💪'}
          </p>
          <p className="text-green-400 font-semibold">+ {xpEarned} XP earned!</p>
          <p className="text-gray-300 mt-4 text-sm">
            You've learned how AI uses natural language processing to predict words based on context!
          </p>
        </div>
      </motion.div>
    );
  }

  if (gameMode === 'sentence') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Word Predictor</h2>
          <div className="text-right">
            <p className="text-sm text-gray-400">Sentence {currentSentenceIndex + 1} of {sentences.length}</p>
            <p className="text-lg font-semibold text-purple-400">Score: {score}</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <p className="text-white text-lg">Predict the missing word</p>
            <div className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
              Time: {timeRemaining}s
            </div>
          </div>

          {currentSentence.context && grade >= 7 && (
            <div className="bg-white/5 p-3 rounded-lg mb-4">
              <p className="text-gray-300 text-sm">{currentSentence.context}</p>
            </div>
          )}

          <div className="bg-white/10 p-6 rounded-xl mb-6 text-center">
            <p className="text-white text-xl">{renderSentenceWithBlank(currentSentence.text)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {currentSentence.options.map(option => (
              <motion.button
                key={option}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg text-center ${selectedOption === option ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'}`}
                onClick={() => handleOptionSelect(option)}
                disabled={showFeedback}
              >
                <span className="text-white">{option}</span>
              </motion.button>
            ))}
          </div>

          {showFeedback ? (
            <div className="text-center mb-4">
              <div className={`p-4 rounded-lg mb-4 ${selectedOption === currentSentence.missingWord ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <p className="text-white mb-2">
                  {selectedOption === currentSentence.missingWord ?
                    '✓ Correct prediction!' :
                    `✗ Incorrect. The correct word is "${currentSentence.missingWord}"`}
                </p>
                {grade >= 8 && (
                  <p className="text-sm text-gray-300">
                    {selectedOption === currentSentence.missingWord ?
                      'You correctly identified the most likely word based on the context!' :
                      'Look for context clues to make better predictions next time.'}
                  </p>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                onClick={handleNextSentence}
              >
                {currentSentenceIndex < sentences.length - 1 ? 'Next Sentence' : 'Finish Game'}
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={!selectedOption}
            >
              Submit Prediction
            </motion.button>
          )}

          {grade >= 9 && !showFeedback && (
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <p className="text-white text-sm mb-2">NLP Prediction Tips:</p>
              <ul className="text-gray-300 text-xs list-disc pl-4">
                <li>Consider the overall context of the sentence</li>
                <li>Look for grammatical patterns that might narrow down the options</li>
                <li>Think about which word would make the most logical sense</li>
                <li>Consider the topic or theme of the text</li>
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    );
  } else {
    // Paragraph mode
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Paragraph Predictor</h2>
          <div className="text-right">
            <p className="text-sm text-gray-400">Advanced Mode</p>
            <p className="text-lg font-semibold text-purple-400">Score: {score}</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <p className="text-white text-lg">Predict the missing words in the paragraph</p>
            <div className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
              Time: {timeRemaining}s
            </div>
          </div>

          <div className="bg-white/10 p-6 rounded-xl mb-6">
            {renderParagraphWithBlanks()}
          </div>

          {!showParagraphFeedback && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Word {currentParagraphIndex + 1}:</h3>
              <div className="grid grid-cols-2 gap-3">
                {paragraph && paragraph.options[currentParagraphIndex].map(option => (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg text-center ${paragraphAnswers[currentParagraphIndex] === option ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'}`}
                    onClick={() => handleParagraphOptionSelect(option, currentParagraphIndex)}
                  >
                    <span className="text-white">{option}</span>
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-transparent border border-white/20 text-white rounded-full hover:bg-white/10 transition-colors"
                  onClick={() => setCurrentParagraphIndex(Math.max(0, currentParagraphIndex - 1))}
                  disabled={currentParagraphIndex === 0}
                >
                  Previous Word
                </motion.button>
                {currentParagraphIndex < (paragraph?.missingWords.length || 0) - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                    onClick={() => setCurrentParagraphIndex(currentParagraphIndex + 1)}
                  >
                    Next Word
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                    onClick={handleParagraphSubmit}
                  >
                    Submit All Predictions
                  </motion.button>
                )}
              </div>
            </div>
          )}

          {showParagraphFeedback && (
            <div className="text-center mb-4">
              <div className="p-4 rounded-lg mb-4 bg-white/5">
                <p className="text-white mb-2">
                  You correctly predicted {paragraph?.missingWords.filter((word, index) => word === paragraphAnswers[index]).length || 0}
                  out of {paragraph?.missingWords.length || 0} words!
                </p>
                {paragraph && paragraph.missingWords.map((word, index) => (
                  <p key={index} className="text-sm">
                    <span className="text-gray-400">Word {index + 1}: </span>
                    <span className={paragraphAnswers[index] === word ? 'text-green-400' : 'text-red-400'}>
                      {paragraphAnswers[index] || '[blank]'}
                    </span>
                    {paragraphAnswers[index] !== word && (
                      <span className="text-gray-400"> (correct: <span className="text-green-400">{word}</span>)</span>
                    )}
                  </p>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                onClick={handleFinishParagraph}
              >
                Finish Game
              </motion.button>
            </div>
          )}

          {grade >= 9 && !showParagraphFeedback && (
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <p className="text-white text-sm mb-2">Advanced NLP Tips:</p>
              <ul className="text-gray-300 text-xs list-disc pl-4">
                <li>Consider the flow of ideas throughout the paragraph</li>
                <li>Look for thematic consistency across sentences</li>
                <li>Pay attention to technical terminology that fits the subject</li>
                <li>Consider how each sentence connects to the ones before and after it</li>
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    );
  }
};

export default WordPredictor;