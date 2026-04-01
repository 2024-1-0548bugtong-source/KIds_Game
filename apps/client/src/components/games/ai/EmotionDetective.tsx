import React, { useState, useEffect, JSX } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { useProgress } from '../../../contexts/ProgressContext';

interface EmotionDetectiveProps {
  grade: number;
}

interface TextSample {
  text: string;
  emotion: string;
  difficulty: number; // 1-5 scale
  context?: string; // Additional context for higher grades
}

// Emotion emojis
const emotionEmojis: Record<string, string> = {
  'Happy': '😊',
  'Sad': '😢',
  'Angry': '😠',
  'Excited': '😃',
  'Afraid': '😨',
  'Surprised': '😲',
  'Confused': '😕',
  'Proud': '😌',
  'Disappointed': '😞',
  'Grateful': '🙏',
  'Jealous': '😒',
  'Hopeful': '🤞',
  'Anxious': '😰',
  'Bored': '😑',
};

// Generate text samples based on grade level
const generateTextSamples = (grade: number): TextSample[] => {
  // Basic samples for younger students (Class 5-6)
  const basicSamples: TextSample[] = [
    {
      text: "I got a new puppy today! I can't wait to play with him.",
      emotion: "Happy",
      difficulty: 1
    },
    {
      text: "My ice cream fell on the ground before I could eat it.",
      emotion: "Sad",
      difficulty: 1
    },
    {
      text: "My brother broke my favorite toy on purpose!",
      emotion: "Angry",
      difficulty: 1
    },
    {
      text: "We're going to the amusement park tomorrow!",
      emotion: "Excited",
      difficulty: 1
    },
    {
      text: "I heard a strange noise coming from the closet at night.",
      emotion: "Afraid",
      difficulty: 2
    },
    {
      text: "I didn't expect to see my best friend at the store.",
      emotion: "Surprised",
      difficulty: 2
    }
  ];

  // Intermediate samples for middle grades (Class 7-8)
  const intermediateSamples: TextSample[] = [
    {
      text: "I studied really hard for the test and got the highest score in class.",
      emotion: "Proud",
      difficulty: 3,
      context: "School achievement"
    },
    {
      text: "We practiced for weeks, but we still lost the championship game in the last minute.",
      emotion: "Disappointed",
      difficulty: 3,
      context: "Sports competition"
    },
    {
      text: "My grandmother sent me a care package with all my favorite snacks when I was feeling homesick.",
      emotion: "Grateful",
      difficulty: 3,
      context: "Family relationship"
    },
    {
      text: "Everyone was talking about the party I wasn't invited to. They all seemed to have so much fun.",
      emotion: "Jealous",
      difficulty: 3,
      context: "Social situation"
    },
    {
      text: "Even though I didn't make the team this year, I'm going to practice more and try again next season.",
      emotion: "Hopeful",
      difficulty: 4,
      context: "Personal challenge"
    }
  ];

  // Advanced samples for older students (Class 9-10)
  const advancedSamples: TextSample[] = [
    {
      text: "As the deadline for college applications approaches, I find myself constantly checking my email and second-guessing my essay choices.",
      emotion: "Anxious",
      difficulty: 4,
      context: "Academic pressure"
    },
    {
      text: "I've been scrolling through social media for hours, but nothing seems interesting anymore. I wish there was something new to do.",
      emotion: "Bored",
      difficulty: 4,
      context: "Digital fatigue"
    },
    {
      text: "Despite the challenges we faced during the project, our team managed to deliver an innovative solution that exceeded the client's expectations.",
      emotion: "Proud",
      difficulty: 5,
      context: "Professional achievement"
    },
    {
      text: "The news about climate change makes me wonder what kind of world we're leaving for future generations, but the recent innovations in renewable energy give me some optimism.",
      emotion: "Hopeful",
      difficulty: 5,
      context: "Environmental concerns"
    },
    {
      text: "After months of preparation and anticipation, the event was canceled at the last minute due to circumstances beyond our control.",
      emotion: "Disappointed",
      difficulty: 5,
      context: "Event planning"
    }
  ];

  // Mixed emotion samples for higher grades
  const mixedEmotionSamples: TextSample[] = [
    {
      text: "I'm moving to a new city for my dream job, but I'll miss my friends and family here.",
      emotion: "Mixed", // Could be excited and sad
      difficulty: 4,
      context: "Life transition"
    },
    {
      text: "I finally finished the marathon, but my time wasn't as good as I had hoped for.",
      emotion: "Mixed", // Could be proud and disappointed
      difficulty: 4,
      context: "Personal achievement"
    },
    {
      text: "My best friend is moving away. I'm organizing a goodbye party to celebrate our friendship.",
      emotion: "Mixed", // Could be sad and grateful
      difficulty: 5,
      context: "Friendship"
    }
  ];

  // Select samples based on grade level
  let availableSamples: TextSample[] = [];

  if (grade <= 6) {
    // For grades 5-6, use only basic samples
    availableSamples = basicSamples;
  } else if (grade <= 8) {
    // For grades 7-8, use basic and intermediate samples
    availableSamples = [...basicSamples, ...intermediateSamples];
  } else {
    // For grades 9-10, use all samples including mixed emotions
    availableSamples = [...basicSamples, ...intermediateSamples, ...advancedSamples];
    if (grade === 10) {
      availableSamples = [...availableSamples, ...mixedEmotionSamples];
    }
  }

  // Further adjust difficulty based on exact grade
  return availableSamples.filter(sample => {
    if (grade === 5) return sample.difficulty <= 2;
    if (grade === 6) return sample.difficulty <= 3;
    if (grade === 7) return sample.difficulty <= 3;
    if (grade === 8) return sample.difficulty <= 4;
    if (grade === 9) return sample.difficulty <= 5;
    if (grade === 10) return sample.difficulty <= 5;
    return true;
  });
};

// Get available emotions based on grade level
const getAvailableEmotions = (grade: number): string[] => {
  const basicEmotions = ['Happy', 'Sad', 'Angry', 'Excited', 'Afraid', 'Surprised'];
  const intermediateEmotions = ['Proud', 'Disappointed', 'Grateful', 'Jealous', 'Hopeful'];
  const advancedEmotions = ['Anxious', 'Bored', 'Confused'];

  if (grade <= 6) {
    return basicEmotions;
  } else if (grade <= 8) {
    return [...basicEmotions, ...intermediateEmotions];
  } else {
    return [...basicEmotions, ...intermediateEmotions, ...advancedEmotions];
  }
};

const EmotionDetective: React.FC<EmotionDetectiveProps> = ({ grade }) => {
  const [samples, setSamples] = useState<TextSample[]>([]);
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45); // 45 seconds per sample
  const [availableEmotions, setAvailableEmotions] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hintPenalty, setHintPenalty] = useState(0);
  const [multipleEmotions, setMultipleEmotions] = useState<string[]>([]);
  const [isMultipleSelection, setIsMultipleSelection] = useState(false);

  const { currentUser } = useAuth();
  const { recordActivity } = useProgress();

  // Initialize samples and emotions based on grade
  useEffect(() => {
    const generatedSamples = generateTextSamples(grade);
    // Shuffle and take up to 5 samples
    const shuffled = [...generatedSamples].sort(() => 0.5 - Math.random());
    setSamples(shuffled.slice(0, 5));

    // Set available emotions
    setAvailableEmotions(getAvailableEmotions(grade));

    // For grade 10, enable multiple emotion selection for mixed emotion samples
    setIsMultipleSelection(grade === 10);
  }, [grade]);

  // Timer effect
  useEffect(() => {
    if (gameCompleted || samples.length === 0 || showFeedback) return;

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
  }, [gameCompleted, samples.length, showFeedback]);

  const currentSample = samples[currentSampleIndex];

  const handleEmotionSelect = (emotion: string) => {
    if (isMultipleSelection && currentSample.emotion === 'Mixed') {
      // For multiple selection (grade 10)
      if (multipleEmotions.includes(emotion)) {
        setMultipleEmotions(multipleEmotions.filter(e => e !== emotion));
      } else if (multipleEmotions.length < 2) {
        setMultipleEmotions([...multipleEmotions, emotion]);
      }
    } else {
      // For single selection
      setSelectedEmotion(emotion);
    }
  };

  const handleSubmit = () => {
    if (!currentSample) return;

    let isCorrect = false;
    let partiallyCorrect = false;

    if (isMultipleSelection && currentSample.emotion === 'Mixed') {
      // For mixed emotions (grade 10), check if at least one emotion is reasonable
      // This is simplified - in a real app, you'd have a list of acceptable emotion combinations
      if (multipleEmotions.length > 0) {
        const acceptableEmotions = getAcceptableEmotionsForMixedSample(currentSampleIndex);
        const correctCount = multipleEmotions.filter(emotion => acceptableEmotions.includes(emotion)).length;

        if (correctCount === multipleEmotions.length && correctCount === 2) {
          isCorrect = true;
        } else if (correctCount > 0) {
          partiallyCorrect = true;
        }
      }
    } else {
      // For single emotion
      isCorrect = selectedEmotion === currentSample.emotion;
    }

    // Calculate score
    let sampleScore = 0;
    if (isCorrect) {
      sampleScore = 10 + (currentSample.difficulty * 2) - hintPenalty;
    } else if (partiallyCorrect) {
      sampleScore = 5 + currentSample.difficulty - hintPenalty;
    }

    const timeBonus = Math.floor(timeRemaining / 10);

    setScore(score + sampleScore + timeBonus);
    setShowFeedback(true);
    setTimeRemaining(0);
  };

  const handleNextSample = () => {
    if (currentSampleIndex < samples.length - 1) {
      setCurrentSampleIndex(currentSampleIndex + 1);
      setSelectedEmotion(null);
      setMultipleEmotions([]);
      setShowFeedback(false);
      setTimeRemaining(45); // Reset timer
      setShowHint(false);
      setHintPenalty(0);
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

  const handleShowHint = () => {
    setShowHint(true);
    setHintPenalty(5); // Penalty for using hint
  };

  // Get acceptable emotions for mixed emotion samples
  const getAcceptableEmotionsForMixedSample = (index: number): string[] => {
    // This would ideally come from a more sophisticated dataset
    // Here we're just hardcoding some reasonable combinations
    const mixedEmotionMap = [
      ['Excited', 'Sad'], // "I'm moving to a new city for my dream job, but I'll miss my friends and family here."
      ['Proud', 'Disappointed'], // "I finally finished the marathon, but my time wasn't as good as I had hoped for."
      ['Sad', 'Grateful'] // "My best friend is moving away. I'm organizing a goodbye party to celebrate our friendship."
    ];

    // Find which mixed emotion sample this is
    const mixedSampleIndex = samples.findIndex(s => s.emotion === 'Mixed');
    if (mixedSampleIndex === -1) return [];

    // Calculate which mixed emotion combination to use
    const combinationIndex = index % mixedEmotionMap.length;
    return mixedEmotionMap[combinationIndex];
  };

  // Generate hint based on text and emotion
  const generateHint = (text: string, emotion: string): string => {
    if (emotion === 'Happy') {
      return "Look for positive words and experiences that bring joy.";
    } else if (emotion === 'Sad') {
      return "Look for words that express loss or disappointment.";
    } else if (emotion === 'Angry') {
      return "Look for words that express frustration or unfairness.";
    } else if (emotion === 'Excited') {
      return "Look for words that express anticipation or enthusiasm.";
    } else if (emotion === 'Afraid') {
      return "Look for words that express worry or fear.";
    } else if (emotion === 'Surprised') {
      return "Look for words that express unexpected events.";
    } else if (emotion === 'Mixed') {
      return "This text contains more than one emotion. Look for contrasting feelings.";
    } else {
      return "Look for specific emotional words and the overall tone of the text.";
    }
  };

  // Calculate XP earned based on score and grade level
  const calculateXpEarned = () => {
    const baseXp = 15; // Base XP for completing the game
    const scoreXp = score / 2; // XP from score
    const gradeMultiplier = grade / 5; // Higher grades earn more XP

    return Math.round(baseXp + (scoreXp * gradeMultiplier));
  };

  // Highlight emotional words in text (for higher grades)
  const highlightEmotionalWords = (text: string): JSX.Element => {
    if (grade <= 6 || !showFeedback) return <span>{text}</span>;

    // This is a simplified version - in a real app, you'd use NLP to identify emotional words
    const emotionalWords = [
      { word: 'happy', emotion: 'Happy' },
      { word: 'sad', emotion: 'Sad' },
      { word: 'angry', emotion: 'Angry' },
      { word: 'excited', emotion: 'Excited' },
      { word: 'afraid', emotion: 'Afraid' },
      { word: 'surprised', emotion: 'Surprised' },
      { word: 'proud', emotion: 'Proud' },
      { word: 'disappointed', emotion: 'Disappointed' },
      { word: 'grateful', emotion: 'Grateful' },
      { word: 'jealous', emotion: 'Jealous' },
      { word: 'hopeful', emotion: 'Hopeful' },
      { word: 'anxious', emotion: 'Anxious' },
      { word: 'bored', emotion: 'Bored' },
      { word: 'love', emotion: 'Happy' },
      { word: 'hate', emotion: 'Angry' },
      { word: 'worry', emotion: 'Anxious' },
      { word: 'fear', emotion: 'Afraid' },
      { word: 'joy', emotion: 'Happy' },
      { word: 'thrill', emotion: 'Excited' },
      { word: 'miss', emotion: 'Sad' },
      { word: 'hope', emotion: 'Hopeful' },
      { word: 'dream', emotion: 'Hopeful' },
      { word: 'thank', emotion: 'Grateful' },
      { word: 'broke', emotion: 'Sad' },
      { word: 'lost', emotion: 'Sad' },
      { word: 'won', emotion: 'Happy' },
      { word: 'achieved', emotion: 'Proud' },
      { word: 'failed', emotion: 'Disappointed' },
    ];

    // Split text and highlight emotional words
    const words = text.split(' ');
    return (
      <span>
        {words.map((word, index) => {
          const cleanWord = word.toLowerCase().replace(/[.,!?;:'"]/, '');
          const emotionalWord = emotionalWords.find(ew => cleanWord.includes(ew.word));

          if (emotionalWord) {
            return (
              <span key={index}>
                <span className="bg-purple-500/30 px-1 rounded" title={emotionalWord.emotion}>
                  {word}
                </span>
                {' '}
              </span>
            );
          }

          return <span key={index}>{word} </span>;
        })}
      </span>
    );
  };

  if (samples.length === 0) {
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
        <h2 className="text-3xl font-bold text-white mb-6 text-center">🕵️ Emotion Detective Completed!</h2>
        <div className="text-center">
          <p className="text-xl text-gray-300 mb-4">Your Score:</p>
          <p className="text-4xl font-bold text-purple-400 mb-6">{score}</p>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((score / (samples.length * 20)) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-gray-400 mb-4">
            {score >= samples.length * 15 ? 'Emotion Detection Expert! 🏆' :
              score >= samples.length * 10 ? 'Great emotion detective! 🌟' :
                score >= samples.length * 5 ? 'Good effort! 👍' : 'Keep practicing! 💪'}
          </p>
          <p className="text-green-400 font-semibold">+ {xpEarned} XP earned!</p>
          <p className="text-gray-300 mt-4 text-sm">
            You've learned how AI uses sentiment analysis to detect emotions in text!
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Emotion Detective</h2>
        <div className="text-right">
          <p className="text-sm text-gray-400">Sample {currentSampleIndex + 1} of {samples.length}</p>
          <p className="text-lg font-semibold text-purple-400">Score: {score}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <p className="text-white text-lg">
            {isMultipleSelection && currentSample.emotion === 'Mixed'
              ? 'Detect the TWO emotions in this text'
              : 'Detect the emotion in this text'}
          </p>
          <div className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
            Time: {timeRemaining}s
          </div>
        </div>

        {currentSample.context && grade >= 7 && (
          <div className="bg-white/5 p-3 rounded-lg mb-4">
            <p className="text-gray-300 text-sm">Context: {currentSample.context}</p>
          </div>
        )}

        <div className="bg-white/10 p-6 rounded-xl mb-6">
          <p className="text-white text-lg">
            {showFeedback && grade >= 7
              ? highlightEmotionalWords(currentSample.text)
              : currentSample.text}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {availableEmotions.map(emotion => (
            <motion.button
              key={emotion}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-lg flex flex-col items-center justify-center ${isMultipleSelection && currentSample.emotion === 'Mixed'
                  ? multipleEmotions.includes(emotion) ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'
                  : selectedEmotion === emotion ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'
                }`}
              onClick={() => handleEmotionSelect(emotion)}
              disabled={showFeedback}
            >
              <span className="text-2xl mb-1">{emotionEmojis[emotion]}</span>
              <span className="text-white text-sm">{emotion}</span>
            </motion.button>
          ))}
        </div>

        {showFeedback ? (
          <div className="text-center mb-4">
            <div className={`p-4 rounded-lg mb-4 ${isMultipleSelection && currentSample.emotion === 'Mixed'
                ? multipleEmotions.length === 2 && getAcceptableEmotionsForMixedSample(currentSampleIndex).every(e => multipleEmotions.includes(e))
                  ? 'bg-green-500/20'
                  : multipleEmotions.some(e => getAcceptableEmotionsForMixedSample(currentSampleIndex).includes(e))
                    ? 'bg-yellow-500/20'
                    : 'bg-red-500/20'
                : selectedEmotion === currentSample.emotion
                  ? 'bg-green-500/20'
                  : 'bg-red-500/20'
              }`}>
              {isMultipleSelection && currentSample.emotion === 'Mixed' ? (
                <div>
                  <p className="text-white mb-2">
                    {multipleEmotions.length === 2 && getAcceptableEmotionsForMixedSample(currentSampleIndex).every(e => multipleEmotions.includes(e))
                      ? '✓ Perfect detection!'
                      : multipleEmotions.some(e => getAcceptableEmotionsForMixedSample(currentSampleIndex).includes(e))
                        ? '⚠️ Partially correct!'
                        : '✗ Incorrect detection.'}
                  </p>
                  <p className="text-sm text-gray-300">
                    This text expresses a mix of {getAcceptableEmotionsForMixedSample(currentSampleIndex).join(' and ')}.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-white mb-2">
                    {selectedEmotion === currentSample.emotion
                      ? '✓ Correct detection!'
                      : `✗ Incorrect. The emotion is ${currentSample.emotion} ${emotionEmojis[currentSample.emotion]}`}
                  </p>
                  {grade >= 8 && (
                    <p className="text-sm text-gray-300">
                      {selectedEmotion === currentSample.emotion
                        ? 'You correctly identified the emotional tone of the text!'
                        : 'Look for emotional words and context clues to better identify the sentiment.'}
                    </p>
                  )}
                </div>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              onClick={handleNextSample}
            >
              {currentSampleIndex < samples.length - 1 ? 'Next Sample' : 'Finish Game'}
            </motion.button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={
                isMultipleSelection && currentSample.emotion === 'Mixed'
                  ? multipleEmotions.length !== 2
                  : !selectedEmotion
              }
            >
              Submit Detection
            </motion.button>

            {!showHint && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-transparent border border-purple-500 text-purple-400 rounded-full hover:bg-purple-500/10 transition-colors"
                onClick={handleShowHint}
              >
                Get Hint (-5 points)
              </motion.button>
            )}
          </div>
        )}

        {showHint && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-yellow-300 text-sm">
              <span className="font-bold">Hint:</span> {generateHint(currentSample.text, currentSample.emotion)}
            </p>
          </div>
        )}

        {grade >= 9 && !showFeedback && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-white text-sm mb-2">Sentiment Analysis Tips:</p>
            <ul className="text-gray-300 text-xs list-disc pl-4">
              <li>Look for emotional words that directly express feelings</li>
              <li>Consider the overall tone and context of the message</li>
              <li>Pay attention to descriptive language and intensity</li>
              <li>Some texts may contain multiple or mixed emotions</li>
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EmotionDetective;