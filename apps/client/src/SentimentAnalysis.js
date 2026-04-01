import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Brain, Lightbulb, Target, TrendingUp, Eye, Zap, Award, RefreshCw, Check, X, Heart } from 'lucide-react';

const SentimentAnalysisPuzzle = () => {
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

  // Based on your CSV data and expanded with similar examples
  const sentimentData = [
    { sentence: "I got a gift!", emotion: "Happy", options: ["Happy", "Sad", "Fear", "Excited"], category: "positive" },
    { sentence: "I lost my toy", emotion: "Sad", options: ["Happy", "Sad", "Fear", "Surprised"], category: "negative" },
    { sentence: "Someone scared me", emotion: "Fear", options: ["Happy", "Sad", "Fear", "Excited"], category: "negative" },
    { sentence: "I won a prize", emotion: "Excited", options: ["Happy", "Sad", "Excited", "Fear"], category: "positive" },
    { sentence: "I saw a spider!", emotion: "Fear", options: ["Happy", "Fear", "Excited", "Surprised"], category: "negative" },
    { sentence: "I got a job", emotion: "Happy", options: ["Happy", "Sad", "Fear", "Surprised"], category: "positive" },
    { sentence: "I am thrilled", emotion: "Excited", options: ["Sad", "Excited", "Fear", "Surprised"], category: "positive" },
    { sentence: "The light went off suddenly", emotion: "Surprised", options: ["Happy", "Sad", "Surprised", "Excited"], category: "neutral" },
    { sentence: "My pet ran away", emotion: "Sad", options: ["Happy", "Sad", "Fear", "Excited"], category: "negative" },
    { sentence: "I am shocked!", emotion: "Surprised", options: ["Happy", "Surprised", "Fear", "Excited"], category: "neutral" },
    
    // Additional examples to expand the dataset
    { sentence: "This birthday cake is delicious!", emotion: "Happy", options: ["Happy", "Sad", "Fear", "Surprised"], category: "positive" },
    { sentence: "I failed my exam today", emotion: "Sad", options: ["Happy", "Sad", "Excited", "Surprised"], category: "negative" },
    { sentence: "The movie was absolutely amazing!", emotion: "Excited", options: ["Sad", "Fear", "Excited", "Surprised"], category: "positive" },
    { sentence: "I heard a strange noise at night", emotion: "Fear", options: ["Happy", "Fear", "Excited", "Surprised"], category: "negative" },
    { sentence: "My friend gave me an unexpected call", emotion: "Surprised", options: ["Happy", "Sad", "Surprised", "Fear"], category: "neutral" },
    { sentence: "I love spending time with my family", emotion: "Happy", options: ["Happy", "Sad", "Fear", "Excited"], category: "positive" },
    { sentence: "The thunder was very loud", emotion: "Fear", options: ["Happy", "Fear", "Excited", "Surprised"], category: "negative" },
    { sentence: "I can't wait for the weekend!", emotion: "Excited", options: ["Sad", "Fear", "Excited", "Surprised"], category: "positive" },
    { sentence: "I broke my favorite mug", emotion: "Sad", options: ["Happy", "Sad", "Fear", "Excited"], category: "negative" },
    { sentence: "The doorbell rang unexpectedly", emotion: "Surprised", options: ["Happy", "Sad", "Surprised", "Excited"], category: "neutral" }
  ];

  const emotions = [
    { name: 'all', label: 'All Emotions', icon: '🎭', color: 'purple' },
    { name: 'positive', label: 'Positive', icon: '😊', color: 'green' },
    { name: 'negative', label: 'Negative', icon: '😢', color: 'red' },
    { name: 'neutral', label: 'Neutral', icon: '😐', color: 'blue' }
  ];

  const emotionIcons = {
    'Happy': '😊',
    'Sad': '😢',
    'Fear': '😨',
    'Excited': '🤩',
    'Surprised': '😲'
  };

  const getQuestionsByCategory = (category) => {
    if (category === 'all') return sentimentData;
    return sentimentData.filter(q => q.category === category);
  };

  const generateQuestion = () => {
    const availableQuestions = getQuestionsByCategory(selectedCategory);
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    
    setCurrentQuestion(randomQuestion);
    setCorrectAnswer(randomQuestion.emotion);
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
    sentimentData.forEach(item => {
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
            <Heart className="w-8 h-8" />
            Sentiment Analysis Puzzle
          </h1>
          <p className="text-gray-600">Identify the emotion expressed in each sentence!</p>
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
            {/* Emotion Category Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6" />
                Choose Emotion Type
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {emotions.map((emotion, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(emotion.name)}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedCategory === emotion.name
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 bg-gray-50 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{emotion.icon}</div>
                      <div className="font-semibold text-gray-800">{emotion.label}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {emotion.name === 'all' ? sentimentData.length : getQuestionsByCategory(emotion.name).length} sentences
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
                Sample Sentences
              </h2>
              
              <div className="space-y-4">
                {getQuestionsByCategory(selectedCategory).slice(0, 3).map((question, index) => (
                  <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                    <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-2xl">{emotionIcons[question.emotion]}</span>
                      "{question.sentence}"
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {question.options.map((option, optIndex) => (
                        <div 
                          key={optIndex}
                          className={`p-2 rounded border text-center flex items-center justify-center gap-1 ${
                            option === question.emotion 
                              ? 'bg-green-100 border-green-300 text-green-800 font-semibold'
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                          }`}
                        >
                          <span>{emotionIcons[option]}</span>
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
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Select Emotion Type:</h3>
                <div className="flex flex-wrap gap-2">
                  {emotions.map((emotion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedCategory(emotion.name);
                        setCurrentQuestion(null);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        selectedCategory === emotion.name
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                      }`}
                    >
                      {emotion.icon} {emotion.label}
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
                    <div className="text-6xl mb-4">🎭</div>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
                        <Lightbulb className="w-6 h-6 text-yellow-600" />
                        What emotion is expressed in this sentence?
                      </h3>
                      
                      <div className="text-2xl font-bold text-purple-800 mb-6 bg-white p-4 rounded-lg shadow-sm">
                        "{currentQuestion.sentence}"
                      </div>
                      
                      {!showExplanation && (
                        <div className="grid grid-cols-2 gap-4">
                          {currentQuestion.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleAnswer(option)}
                              className="bg-white border-2 border-purple-200 text-purple-800 px-6 py-4 rounded-lg font-semibold hover:bg-purple-50 hover:border-purple-400 transition-colors text-lg flex items-center justify-center gap-2"
                            >
                              <span className="text-2xl">{emotionIcons[option]}</span>
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
                          The correct emotion is: <span className="text-2xl">{emotionIcons[correctAnswer]}</span> <strong>{correctAnswer}</strong>
                        </p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg mb-4">
                        <h4 className="font-semibold text-gray-700 mb-2">Sentence Analysis:</h4>
                        <p className="text-gray-800 text-lg mb-2">
                          "{currentQuestion.sentence}"
                        </p>
                        <p className="text-gray-600 text-sm">
                          This sentence expresses <strong>{correctAnswer}</strong> emotion, which falls under the <strong>{currentQuestion.category}</strong> category.
                        </p>
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
            Emotion Analytics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Sentences by Emotion Type</h3>
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
            Emotion Recognition Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">🔍 Look for Keywords</h3>
              <p className="text-purple-100">
                Words like "thrilled," "excited," "love" indicate positive emotions, while "lost," "scared," "broke" suggest negative ones.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">❗ Notice Punctuation</h3>
              <p className="text-purple-100">
                Exclamation marks often indicate strong emotions like excitement, surprise, or fear.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🎭 Context Matters</h3>
              <p className="text-purple-100">
                Consider the situation described - winning a prize is positive, while losing something is typically negative.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🧠 Practice Empathy</h3>
              <p className="text-purple-100">
                Put yourself in the speaker's shoes - how would you feel in that situation?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysisPuzzle;
