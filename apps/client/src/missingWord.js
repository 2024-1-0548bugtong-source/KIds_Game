import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Brain, Lightbulb, Target, TrendingUp, Eye, Zap, Award, RefreshCw, Check, X, BookOpen } from 'lucide-react';

const MissingWordPuzzle = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [gameMode, setGameMode] = useState('explore');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswer, setUserAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [streak, setStreak] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const puzzleData = [
    { sentence: "The cat is sleeping on the ____.", options: ["chair", "sky", "car", "water"], answer: "chair", category: "animals" },
    { sentence: "I like to eat ____ for breakfast.", options: ["books", "apples", "shoes", "clouds"], answer: "apples", category: "food" },
    { sentence: "The ____ is shining brightly today.", options: ["moon", "sun", "stars", "rain"], answer: "sun", category: "nature" },
    { sentence: "Birds can ____ in the sky.", options: ["swim", "run", "fly", "crawl"], answer: "fly", category: "animals" },
    { sentence: "We use a ____ to write on paper.", options: ["spoon", "pencil", "fork", "cup"], answer: "pencil", category: "objects" },
    { sentence: "The dog likes to ____ with the ball.", options: ["sleep", "eat", "play", "cry"], answer: "play", category: "animals" },
    { sentence: "Fish live in the ____.", options: ["sky", "water", "tree", "house"], answer: "water", category: "animals" },
    { sentence: "At night we can see the ____ and stars.", options: ["sun", "moon", "clouds", "rainbow"], answer: "moon", category: "nature" },
    { sentence: "My favorite ____ is red.", options: ["number", "color", "day", "sound"], answer: "color", category: "attributes" },
    { sentence: "We wear ____ on our feet.", options: ["hats", "gloves", "shoes", "shirts"], answer: "shoes", category: "clothing" }
  ];

  const categories = [
    { name: 'all', label: 'All Categories', icon: '🎯' },
    { name: 'animals', label: 'Animals', icon: '🐾' },
    { name: 'food', label: 'Food', icon: '🍎' },
    { name: 'nature', label: 'Nature', icon: '🌟' },
    { name: 'objects', label: 'Objects', icon: '📝' },
    { name: 'attributes', label: 'Attributes', icon: '🎨' },
    { name: 'clothing', label: 'Clothing', icon: '👕' }
  ];

  const getQuestionsByCategory = (category) => {
    if (category === 'all') return puzzleData;
    return puzzleData.filter(q => q.category === category);
  };

  const generateQuestion = () => {
    const availableQuestions = getQuestionsByCategory(selectedCategory);
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    
    setCurrentQuestion(randomQuestion);
    setCorrectAnswer(randomQuestion.answer);
    setUserAnswer(null);
    setShowExplanation(false);
  };

  const handleAnswer = (answer) => {
    setUserAnswer(answer);
    setQuestionsAnswered(questionsAnswered + 1);
    
    const isCorrect = answer === correctAnswer;
    
    if (isCorrect) {
      setScore(score + 10);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
    
    setGameHistory([...gameHistory, {
      sentence: currentQuestion.sentence,
      userAnswer: answer,
      correctAnswer: correctAnswer,
      isCorrect: isCorrect,
      category: currentQuestion.category
    }]);
    
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    generateQuestion();
  };

  const resetGame = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setStreak(0);
    setGameHistory([]);
    setCurrentQuestion(null);
    setShowExplanation(false);
  };

  const getCategoryAnalysis = () => {
    const categoryCount = {};
    puzzleData.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });
    
    return Object.entries(categoryCount).map(([category, count]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: count
    }));
  };

  const getPerformanceData = () => {
    if (gameHistory.length === 0) return [];
    
    const categoryPerformance = {};
    gameHistory.forEach(item => {
      if (!categoryPerformance[item.category]) {
        categoryPerformance[item.category] = { correct: 0, total: 0 };
      }
      categoryPerformance[item.category].total++;
      if (item.isCorrect) {
        categoryPerformance[item.category].correct++;
      }
    });
    
    return Object.entries(categoryPerformance).map(([category, data]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      accuracy: Math.round((data.correct / data.total) * 100),
      correct: data.correct,
      total: data.total
    }));
  };

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

  useEffect(() => {
    if (gameMode === 'game' && !currentQuestion) {
      generateQuestion();
    }
  }, [gameMode, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-2 flex items-center justify-center gap-2">
            <Brain className="w-8 h-8" />
            Missing Word Puzzle
          </h1>
          <p className="text-gray-600">Fill in the blanks to complete the sentences!</p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setGameMode('explore')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                gameMode === 'explore' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'bg-white text-purple-600 border border-purple-200'
              }`}
            >
              Explore Mode
            </button>
            <button
              onClick={() => setGameMode('game')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                gameMode === 'game' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'bg-white text-purple-600 border border-purple-200'
              }`}
            >
              Quiz Mode
            </button>
          </div>
          {gameMode === 'game' && (
            <div className="mt-4 flex justify-center gap-6 text-lg font-bold text-purple-700">
              <div>Score: {score}</div>
              <div>Questions: {questionsAnswered}</div>
              <div>Streak: {streak}</div>
            </div>
          )}
        </div>

        {gameMode === 'explore' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Choose a Category
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedCategory === category.name
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 bg-gray-50 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{category.icon}</div>
                      <div className="font-semibold text-gray-800">{category.label}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {category.name === 'all' ? puzzleData.length : getQuestionsByCategory(category.name).length} questions
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sample Questions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-600" />
                Sample Questions
              </h2>
              
              <div className="space-y-4">
                {getQuestionsByCategory(selectedCategory).slice(0, 3).map((question, index) => (
                  <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                    <div className="font-semibold text-gray-800 mb-2">
                      {question.sentence}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {question.options.map((option, optIndex) => (
                        <div 
                          key={optIndex}
                          className={`p-2 rounded border text-center ${
                            option === question.answer 
                              ? 'bg-green-100 border-green-300 text-green-800 font-semibold'
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-purple-600 font-semibold">
                      Category: {question.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameMode === 'game' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Category Selection for Game Mode */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Select Category:</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setCurrentQuestion(null);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        selectedCategory === category.name
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                      }`}
                    >
                      {category.icon} {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {!currentQuestion ? (
                <div className="text-center">
                  <button
                    onClick={generateQuestion}
                    className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Start Quiz
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Question */}
                  <div className="text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
                        <Lightbulb className="w-6 h-6 text-yellow-600" />
                        Complete the sentence:
                      </h3>
                      
                      <div className="text-2xl font-bold text-purple-800 mb-6">
                        {currentQuestion.sentence}
                      </div>
                      
                      {!showExplanation && (
                        <div className="grid grid-cols-2 gap-4">
                          {currentQuestion.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleAnswer(option)}
                              className="bg-white border-2 border-purple-200 text-purple-800 px-6 py-4 rounded-lg font-semibold hover:bg-purple-50 hover:border-purple-400 transition-colors text-lg"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Explanation */}
                  {showExplanation && (
                    <div className={`${userAnswer === correctAnswer ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg p-6`}>
                      <div className="text-center mb-4">
                        <div className={`${userAnswer === correctAnswer ? 'text-green-600' : 'text-red-600'} text-6xl mb-2`}>
                          {userAnswer === correctAnswer ? '🎉' : '❌'}
                        </div>
                        <h3 className={`text-2xl font-bold ${userAnswer === correctAnswer ? 'text-green-800' : 'text-red-800'}`}>
                          {userAnswer === correctAnswer ? 'Correct!' : 'Incorrect!'}
                        </h3>
                        <p className="text-gray-600 mt-2">
                          The correct answer is: <strong>{correctAnswer}</strong>
                        </p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg mb-4">
                        <h4 className="font-semibold text-gray-700 mb-2">Complete sentence:</h4>
                        <p className="text-gray-800 text-lg">
                          {currentQuestion.sentence.replace('____', correctAnswer)}
                        </p>
                        <div className="mt-2 text-sm text-purple-600">
                          Category: {currentQuestion.category}
                        </div>
                      </div>
                      
                      <div className="text-center space-x-4">
                        <button
                          onClick={nextQuestion}
                          className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                        >
                          Next Question
                        </button>
                        <button
                          onClick={resetGame}
                          className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                        >
                          Reset Game
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart className="w-6 h-6 text-blue-600" />
            Puzzle Analytics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Questions by Category</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={getCategoryAnalysis()}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {getCategoryAnalysis().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-2 text-sm text-gray-600">
                {getCategoryAnalysis().map((item, index) => (
                  <div key={index} className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                    <span>{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance by Category */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Your Performance</h3>
              {getPerformanceData().length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={getPerformanceData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="accuracy" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Complete some questions to see your performance!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Learning Tips */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Language Learning Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">🧠 Context Clues</h3>
              <p className="text-purple-100">
                Use the surrounding words to understand what type of word fits best in the blank space.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🔍 Grammar Patterns</h3>
              <p className="text-purple-100">
                Pay attention to grammar rules - verbs follow subjects, adjectives describe nouns.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">📚 Vocabulary Building</h3>
              <p className="text-purple-100">
                Regular practice with these puzzles helps expand your vocabulary and language skills.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🎯 Logical Thinking</h3>
              <p className="text-purple-100">
                Eliminate options that don't make sense logically or grammatically in the sentence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissingWordPuzzle;
