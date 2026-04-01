import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Brain, Lightbulb, Target, TrendingUp, Eye, Zap, Award, RefreshCw, Check, X, Calendar } from 'lucide-react';

const MonthSeasonPuzzle = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [gameMode, setGameMode] = useState('explore');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswer, setUserAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [streak, setStreak] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('all');

  // Based on your CSV data
  const monthSeasonData = [
    { month: "January", season: "Winter", seasonType: "winter" },
    { month: "February", season: "Winter", seasonType: "winter" },
    { month: "March", season: "Spring", seasonType: "spring" },
    { month: "April", season: "Spring", seasonType: "spring" },
    { month: "May", season: "Summer", seasonType: "summer" },
    { month: "June", season: "Summer", seasonType: "summer" },
    { month: "July", season: "Summer", seasonType: "summer" },
    { month: "August", season: "Monsoon", seasonType: "monsoon" },
    { month: "September", season: "Monsoon", seasonType: "monsoon" },
    { month: "October", season: "Autumn", seasonType: "autumn" },
    { month: "November", season: "Autumn", seasonType: "autumn" },
    { month: "December", season: "Winter", seasonType: "winter" }
  ];

  const seasons = [
    { name: 'all', label: 'All Seasons', icon: '🌍', color: 'purple' },
    { name: 'spring', label: 'Spring', icon: '🌸', color: 'green' },
    { name: 'summer', label: 'Summer', icon: '☀️', color: 'yellow' },
    { name: 'monsoon', label: 'Monsoon', icon: '🌧️', color: 'blue' },
    { name: 'autumn', label: 'Autumn', icon: '🍂', color: 'orange' },
    { name: 'winter', label: 'Winter', icon: '❄️', color: 'cyan' }
  ];

  const seasonOptions = ["Spring", "Summer", "Monsoon", "Autumn", "Winter"];

  const seasonIcons = {
    'Spring': '🌸',
    'Summer': '☀️',
    'Monsoon': '🌧️',
    'Autumn': '🍂',
    'Winter': '❄️'
  };

  const seasonColors = {
    'Spring': 'bg-green-100 border-green-300 text-green-800',
    'Summer': 'bg-yellow-100 border-yellow-300 text-yellow-800',
    'Monsoon': 'bg-blue-100 border-blue-300 text-blue-800',
    'Autumn': 'bg-orange-100 border-orange-300 text-orange-800',
    'Winter': 'bg-cyan-100 border-cyan-300 text-cyan-800'
  };

  const getQuestionsBySeason = (season) => {
    if (season === 'all') return monthSeasonData;
    return monthSeasonData.filter(q => q.seasonType === season);
  };

  const generateQuestion = () => {
    const availableQuestions = getQuestionsBySeason(selectedSeason);
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    
    setCurrentQuestion(randomQuestion);
    setCorrectAnswer(randomQuestion.season);
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
      month: currentQuestion.month,
      userAnswer: answer,
      correctAnswer: correctAnswer,
      isCorrect: isCorrect,
      seasonType: currentQuestion.seasonType
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

  const getSeasonAnalysis = () => {
    const seasonCount = {};
    monthSeasonData.forEach(item => {
      seasonCount[item.season] = (seasonCount[item.season] || 0) + 1;
    });
    
    return Object.entries(seasonCount).map(([season, count]) => ({
      name: season,
      value: count
    }));
  };

  const getPerformanceData = () => {
    if (gameHistory.length === 0) return [];
    
    const seasonPerformance = {};
    gameHistory.forEach(item => {
      if (!seasonPerformance[item.seasonType]) {
        seasonPerformance[item.seasonType] = { correct: 0, total: 0 };
      }
      seasonPerformance[item.seasonType].total++;
      if (item.isCorrect) {
        seasonPerformance[item.seasonType].correct++;
      }
    });
    
    return Object.entries(seasonPerformance).map(([season, data]) => ({
      name: season.charAt(0).toUpperCase() + season.slice(1),
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
  }, [gameMode, selectedSeason]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-2 flex items-center justify-center gap-2">
            <Calendar className="w-8 h-8" />
            Month Season Sorting Puzzle
          </h1>
          <p className="text-gray-600">Match each month to its correct season!</p>
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
            {/* Season Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Choose a Season
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {seasons.map((season, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSeason(season.name)}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedSeason === season.name
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 bg-gray-50 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{season.icon}</div>
                      <div className="font-semibold text-gray-800">{season.label}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {season.name === 'all' ? monthSeasonData.length : getQuestionsBySeason(season.name).length} months
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Season Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-600" />
                Season Overview
              </h2>
              
              <div className="space-y-4">
                {getQuestionsBySeason(selectedSeason).map((item, index) => (
                  <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-800 text-lg">
                        📅 {item.month}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${seasonColors[item.season]}`}>
                        <span className="text-lg">{seasonIcons[item.season]}</span>
                        {item.season}
                      </div>
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
              {/* Season Selection for Game Mode */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Select Season Focus:</h3>
                <div className="flex flex-wrap gap-2">
                  {seasons.map((season, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedSeason(season.name);
                        setCurrentQuestion(null);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        selectedSeason === season.name
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                      }`}
                    >
                      {season.icon} {season.label}
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
                    <div className="text-6xl mb-4">📅</div>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
                        <Lightbulb className="w-6 h-6 text-yellow-600" />
                        Which season does this month belong to?
                      </h3>
                      
                      <div className="text-4xl font-bold text-purple-800 mb-6 bg-white p-6 rounded-lg shadow-sm border-2 border-purple-200">
                        📅 {currentQuestion.month}
                      </div>
                      
                      {!showExplanation && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {seasonOptions.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleAnswer(option)}
                              className="bg-white border-2 border-purple-200 text-purple-800 px-6 py-4 rounded-lg font-semibold hover:bg-purple-50 hover:border-purple-400 transition-colors text-lg flex items-center justify-center gap-2"
                            >
                              <span className="text-2xl">{seasonIcons[option]}</span>
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
                        <div className={`text-6xl mb-2`}>
                          {userAnswer === correctAnswer ? '🎉' : '❌'}
                        </div>
                        <h3 className={`text-2xl font-bold ${userAnswer === correctAnswer ? 'text-green-800' : 'text-red-800'}`}>
                          {userAnswer === correctAnswer ? 'Correct!' : 'Incorrect!'}
                        </h3>
                        <p className="text-gray-600 mt-2 flex items-center justify-center gap-2">
                          {currentQuestion.month} belongs to: <span className="text-2xl">{seasonIcons[correctAnswer]}</span> <strong>{correctAnswer}</strong>
                        </p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg mb-4">
                        <h4 className="font-semibold text-gray-700 mb-2">Season Information:</h4>
                        <div className="flex items-center justify-center gap-4 text-lg">
                          <span className="text-2xl">📅</span>
                          <span className="font-semibold">{currentQuestion.month}</span>
                          <span className="text-gray-500">→</span>
                          <span className="text-2xl">{seasonIcons[correctAnswer]}</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${seasonColors[correctAnswer]}`}>
                            {correctAnswer}
                          </span>
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
            Season Analytics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Season Distribution */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Months per Season</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={getSeasonAnalysis()}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {getSeasonAnalysis().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-2 text-sm text-gray-600">
                {getSeasonAnalysis().map((item, index) => (
                  <div key={index} className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                    <span className="text-lg">{seasonIcons[item.name]}</span>
                    <span>{item.name}: {item.value} months</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance by Season */}
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
            Season Learning Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">🌸 Spring Months</h3>
              <p className="text-purple-100">
                March and April bring new growth, flowers blooming, and warmer weather after winter.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">☀️ Summer Months</h3>
              <p className="text-purple-100">
                May, June, and July are the hottest months with long sunny days and vacation time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🌧️ Monsoon Season</h3>
              <p className="text-purple-100">
                August and September bring heavy rainfall, essential for agriculture and water supply.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🍂 Autumn Months</h3>
              <p className="text-purple-100">
                October and November feature cooler weather, falling leaves, and harvest time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">❄️ Winter Months</h3>
              <p className="text-purple-100">
                December, January, and February are the coldest months with shorter days and longer nights.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">📅 Remember Patterns</h3>
              <p className="text-purple-100">
                Notice that some seasons have 3 months (Summer, Winter) while others have 2 (Spring, Monsoon, Autumn).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthSeasonPuzzle;
