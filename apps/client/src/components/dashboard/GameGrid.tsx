import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Target } from 'lucide-react';
import MultipleChoiceQuiz from '../games/quiz/MultipleChoiceQuiz';
import TrueFalseQuiz from '../games/quiz/TrueFalseQuiz';
import FillInTheBlanksQuiz from '../games/quiz/FillInTheBlanksQuiz';
import MatchTheFollowing from '../games/quiz/MatchTheFollowing';
import CrosswordPuzzle from '../games/puzzle/CrosswordPuzzle';
import SudokuPuzzle from '../games/puzzle/SudokuPuzzle';
import WordSearchPuzzle from '../games/puzzle/WordSearchPuzzle';
import JigsawPuzzle from '../games/puzzle/JigsawPuzzle';
// Import AI games
import PatternDetective from '../games/ai/PatternDetective';
import FruitClassifier from '../games/ai/FruitClassifier';
import WeatherPredictor from '../games/ai/WeatherPredictor';
import WordPredictor from '../games/ai/WordPredictor';
import EmotionDetective from '../games/ai/EmotionDetective';
import NeuralNetworkNavigator from '../games/ai/NeuralNetworkNavigator';
import AnimalHabitatMatcher from '../games/ai/AnimalHabitatMatcher';
import ChemicalReactionPredictor from '../games/ai/ChemicalReactionPredictor';
import LanguageDetective from '../games/ai/LanguageDetective';
import { useAuth } from '../../contexts/AuthContext';

const GameGrid: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'quiz' | 'puzzle' | 'ai'>('all');
  const { currentUser } = useAuth();
  const grade = currentUser?.standard || 5;

  // Group games by category for better organization
  const quizGames = [
    {
      id: 1,
      title: 'Multiple Choice Quiz',
      description: 'Test your knowledge with multiple choice questions',
      difficulty: 'Easy',
      duration: '10 min',
      category: 'Mathematics',
      icon: '🔢',
      color: 'from-blue-500 to-cyan-500',
      component: <MultipleChoiceQuiz grade={grade} />,
    },
    {
      id: 2,
      title: 'True/False Quiz',
      description: 'Decide if the statements are true or false',
      difficulty: 'Easy',
      duration: '8 min',
      category: 'Science',
      icon: '🧪',
      color: 'from-green-500 to-emerald-500',
      component: <TrueFalseQuiz grade={grade} />,
    },
    {
      id: 3,
      title: 'Fill in the Blanks',
      description: 'Complete the sentences with the correct words',
      difficulty: 'Medium',
      duration: '12 min',
      category: 'Language',
      icon: '📚',
      color: 'from-purple-500 to-pink-500',
      component: <FillInTheBlanksQuiz grade={grade} />,
    },
    {
      id: 4,
      title: 'Match the Following',
      description: 'Match items from two columns',
      difficulty: 'Medium',
      duration: '10 min',
      category: 'History',
      icon: '🏛️',
      color: 'from-orange-500 to-red-500',
      component: <MatchTheFollowing grade={grade} />,
    },
  ];

  const puzzleGames = [
    {
      id: 5,
      title: 'Crossword Puzzle',
      description: 'Solve the crossword using clues',
      difficulty: 'Medium',
      duration: '15 min',
      category: 'Geography',
      icon: '🌍',
      color: 'from-teal-500 to-blue-500',
      component: <CrosswordPuzzle grade={grade} />,
    },
    {
      id: 6,
      title: 'Sudoku Puzzle',
      description: 'Fill the grid with numbers',
      difficulty: 'Hard',
      duration: '20 min',
      category: 'Logic',
      icon: '🧩',
      color: 'from-indigo-500 to-purple-500',
      component: <SudokuPuzzle grade={grade} />,
    },
    {
      id: 7,
      title: 'Word Search',
      description: 'Find hidden words in the grid',
      difficulty: 'Medium',
      duration: '15 min',
      category: 'Vocabulary',
      icon: '🔤',
      color: 'from-pink-500 to-yellow-500',
      component: <WordSearchPuzzle grade={grade} />,
    },
    {
      id: 8,
      title: 'Jigsaw Puzzle',
      description: 'Arrange pieces to complete the picture',
      difficulty: 'Easy',
      duration: '10 min',
      category: 'Puzzle',
      icon: '🧩',
      color: 'from-yellow-400 to-orange-500',
      component: <JigsawPuzzle grade={grade} />,
    },
  ];

  const aiGames = [
    {
      id: 9,
      title: 'Pattern Detective',
      description: 'Identify patterns and predict the next elements',
      difficulty: 'Adaptive',
      duration: '10 min',
      category: 'AI: Pattern Recognition',
      icon: '🔍',
      color: 'from-purple-600 to-indigo-600',
      component: <PatternDetective grade={grade} />,
    },
    {
      id: 10,
      title: 'Fruit Classifier',
      description: 'Classify fruits based on their features',
      difficulty: 'Adaptive',
      duration: '8 min',
      category: 'AI: Classification',
      icon: '🍎',
      color: 'from-red-500 to-yellow-500',
      component: <FruitClassifier grade={grade} />,
    },
    {
      id: 11,
      title: 'Weather Predictor',
      description: 'Analyze data to predict weather patterns',
      difficulty: 'Adaptive',
      duration: '12 min',
      category: 'AI: Prediction',
      icon: '☁️',
      color: 'from-blue-400 to-cyan-300',
      component: <WeatherPredictor grade={grade} />,
    },
    {
      id: 12,
      title: 'Word Predictor',
      description: 'Predict the next word in a sentence',
      difficulty: 'Adaptive',
      duration: '10 min',
      category: 'AI: NLP',
      icon: '📝',
      color: 'from-green-500 to-teal-400',
      component: <WordPredictor grade={grade} />,
    },
    {
      id: 13,
      title: 'Emotion Detective',
      description: 'Identify emotions in text passages',
      difficulty: 'Adaptive',
      duration: '15 min',
      category: 'AI: Sentiment Analysis',
      icon: '😊',
      color: 'from-yellow-400 to-orange-500',
      component: <EmotionDetective grade={grade} />,
    },
    {
      id: 14,
      title: 'Neural Network Navigator',
      description: 'Build and train simple neural networks',
      difficulty: 'Adaptive',
      duration: '20 min',
      category: 'AI: Deep Learning',
      icon: '🧠',
      color: 'from-purple-500 to-pink-500',
      component: <NeuralNetworkNavigator grade={grade} />,
    },
    {
      id: 15,
      title: 'Animal Habitat Matcher',
      description: 'Match animals to their habitats using features',
      difficulty: 'Adaptive',
      duration: '12 min',
      category: 'AI: Feature Matching',
      icon: '🦁',
      color: 'from-green-600 to-yellow-500',
      component: <AnimalHabitatMatcher grade={grade} />,
    },
    {
      id: 16,
      title: 'Chemical Reaction Predictor',
      description: 'Predict products of chemical reactions',
      difficulty: 'Adaptive',
      duration: '15 min',
      category: 'AI: Rule-Based Systems',
      icon: '⚗️',
      color: 'from-blue-600 to-purple-600',
      component: <ChemicalReactionPredictor grade={grade} />,
    },
    {
      id: 17,
      title: 'Language Detective',
      description: 'Identify and fix grammar issues in text',
      difficulty: 'Adaptive',
      duration: '15 min',
      category: 'AI: NLP Grammar',
      icon: '🔎',
      color: 'from-indigo-500 to-blue-500',
      component: <LanguageDetective grade={grade} />,
    },
  ];

  // Combine all game categories
  const games = [...quizGames, ...puzzleGames, ...aiGames];

  const handleGameClick = (game: typeof games[0]) => {
    setActiveGame(game.title);
  };

  // Render the selected game component
  const activeGameObj = games.find(g => g.title === activeGame);
  if (activeGameObj) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <button
          className="mb-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
          onClick={() => setActiveGame(null)}
        >
          ← Back to Game Grid
        </button>
        {activeGameObj.component}
      </div>
    );
  }


  // Filter games based on selected category
  const filteredGames = categoryFilter === 'all' 
    ? games 
    : categoryFilter === 'quiz' 
      ? quizGames 
      : categoryFilter === 'puzzle' 
        ? puzzleGames 
        : aiGames;

  return (
    <div>
      {/* Category filter buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-full ${categoryFilter === 'all' ? 'bg-white text-gray-900' : 'bg-white/20 text-white'}`}
          onClick={() => setCategoryFilter('all')}
        >
          All Games
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-full ${categoryFilter === 'quiz' ? 'bg-white text-gray-900' : 'bg-white/20 text-white'}`}
          onClick={() => setCategoryFilter('quiz')}
        >
          Quiz Games
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-full ${categoryFilter === 'puzzle' ? 'bg-white text-gray-900' : 'bg-white/20 text-white'}`}
          onClick={() => setCategoryFilter('puzzle')}
        >
          Puzzle Games
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-full ${categoryFilter === 'ai' ? 'bg-white text-gray-900' : 'bg-white/20 text-white'}`}
          onClick={() => setCategoryFilter('ai')}
        >
          AI Learning Games
        </motion.button>
      </div>

      {/* AI games section title when AI category is selected */}
      {categoryFilter === 'ai' && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">AI Learning Games</h2>
          <p className="text-gray-300">Explore artificial intelligence concepts through interactive games</p>
          <p className="text-gray-400 text-sm mt-1">All games adapt to your grade level (Class {grade})</p>
        </div>
      )}

      {/* Game grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-br ${game.color} rounded-xl shadow-lg p-6 flex flex-col items-center cursor-pointer transition-all`}
            onClick={() => handleGameClick(game)}
          >
            <div className="text-5xl mb-2">{game.icon}</div>
            <h3 className="text-xl font-bold mb-1">{game.title}</h3>
            <p className="text-sm mb-2 text-center">{game.description}</p>
            <div className="flex items-center space-x-2 text-xs text-gray-100">
              <span className="flex items-center"><Star className="w-4 h-4 mr-1" />{game.difficulty}</span>
              <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{game.duration}</span>
              <span className="flex items-center"><Target className="w-4 h-4 mr-1" />{game.category}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GameGrid;