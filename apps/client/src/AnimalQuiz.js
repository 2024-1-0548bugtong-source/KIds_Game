import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Brain, Lightbulb, Target, TrendingUp, Eye, Zap, Award, RefreshCw, Check, X } from 'lucide-react';

const AnimalQuiz = () => {
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [gameMode, setGameMode] = useState('explore');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswer, setUserAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [streak, setStreak] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);

  const animals = [
    { name: 'Dog', hasFur: true, canFly: false, legs: 4 },
    { name: 'Cat', hasFur: true, canFly: false, legs: 4 },
    { name: 'Bat', hasFur: true, canFly: true, legs: 2 },
    { name: 'Eagle', hasFur: false, canFly: true, legs: 2 },
    { name: 'Shark', hasFur: false, canFly: false, legs: 0 },
    { name: 'Elephant', hasFur: true, canFly: false, legs: 4 },
    { name: 'Frog', hasFur: false, canFly: false, legs: 4 },
    { name: 'Parrot', hasFur: false, canFly: true, legs: 2 },
    { name: 'Bear', hasFur: true, canFly: false, legs: 4 },
    { name: 'Ostrich', hasFur: false, canFly: false, legs: 2 }
  ];

  const questions = [
    {
      text: "Does this animal have fur?",
      property: "hasFur",
      icon: <Eye className="w-5 h-5" />
    },
    {
      text: "Can this animal fly?",
      property: "canFly",
      icon: <Target className="w-5 h-5" />
    },
    {
      text: "Does this animal have 4 legs?",
      property: "legs",
      check: (value) => value === 4,
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      text: "Does this animal have 2 legs?",
      property: "legs",
      check: (value) => value === 2,
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      text: "Does this animal have no legs?",
      property: "legs",
      check: (value) => value === 0,
      icon: <TrendingUp className="w-5 h-5" />
    }
  ];

  const getAnimalEmoji = (animalName) => {
    const emojis = {
      'Dog': '🐕',
      'Cat': '🐱',
      'Bat': '🦇',
      'Eagle': '🦅',
      'Shark': '🦈',
      'Elephant': '🐘',
      'Frog': '🐸',
      'Parrot': '🦜',
      'Bear': '🐻',
      'Ostrich': '🦓'
    };
    return emojis[animalName] || '🐾';
  };

  const generateQuestion = () => {
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    let answer;
    if (randomQuestion.check) {
      answer = randomQuestion.check(randomAnimal[randomQuestion.property]);
    } else {
      answer = randomAnimal[randomQuestion.property];
    }
    
    setCurrentAnimal(randomAnimal);
    setCurrentQuestion(randomQuestion);
    setCorrectAnswer(answer);
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
      animal: currentAnimal.name,
      question: currentQuestion.text,
      userAnswer: answer,
      correctAnswer: correctAnswer,
      isCorrect: isCorrect
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
    setCurrentAnimal(null);
    setCurrentQuestion(null);
    setShowExplanation(false);
  };

  const getAnimalAnalysis = (animal) => {
    const analysis = {
      fur: animals.filter(a => a.hasFur === animal.hasFur).length,
      flight: animals.filter(a => a.canFly === animal.canFly).length,
      legs: animals.filter(a => a.legs === animal.legs).length
    };
    return analysis;
  };

  const getVisualizationData = () => {
    const furData = [
      { name: 'Has Fur', value: animals.filter(a => a.hasFur).length },
      { name: 'No Fur', value: animals.filter(a => !a.hasFur).length }
    ];
    
    const flyData = [
      { name: 'Can Fly', value: animals.filter(a => a.canFly).length },
      { name: 'Cannot Fly', value: animals.filter(a => !a.canFly).length }
    ];
    
    const legsData = [
      { name: '0 Legs', value: animals.filter(a => a.legs === 0).length },
      { name: '2 Legs', value: animals.filter(a => a.legs === 2).length },
      { name: '4 Legs', value: animals.filter(a => a.legs === 4).length }
    ];
    
    return { furData, flyData, legsData };
  };

  const vizData = getVisualizationData();
  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

  useEffect(() => {
    if (gameMode === 'game' && !currentAnimal) {
      generateQuestion();
    }
  }, [gameMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-2 flex items-center justify-center gap-2">
            <Brain className="w-8 h-8" />
            Animal Quiz Challenge
          </h1>
          <p className="text-gray-600">Test your knowledge about animals with Yes/No questions!</p>
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
            {/* Animal Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6" />
                Choose an Animal to Explore
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {animals.map((animal, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentAnimal(animal)}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      currentAnimal?.name === animal.name
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 bg-gray-50 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{getAnimalEmoji(animal.name)}</div>
                      <div className="font-semibold text-gray-800">{animal.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {animal.hasFur ? 'Has Fur' : 'No Fur'} • {animal.canFly ? 'Can Fly' : 'Cannot Fly'} • {animal.legs} Legs
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Animal Analysis */}
            {currentAnimal && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  About the {currentAnimal.name}
                </h2>
                
                <div className="text-center mb-6">
                  <div className="text-6xl mb-2">{getAnimalEmoji(currentAnimal.name)}</div>
                  <h3 className="text-2xl font-bold text-gray-800">{currentAnimal.name}</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Eye className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-800">Fur</h3>
                    </div>
                    <p className="text-gray-600">
                      {currentAnimal.hasFur ? 'Has fur' : 'Does not have fur'}
                    </p>
                    <div className="mt-2 text-sm text-purple-600">
                      {getAnimalAnalysis(currentAnimal).fur} animals in dataset share this trait
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-800">Flight</h3>
                    </div>
                    <p className="text-gray-600">
                      {currentAnimal.canFly ? 'Can fly' : 'Cannot fly'}
                    </p>
                    <div className="mt-2 text-sm text-purple-600">
                      {getAnimalAnalysis(currentAnimal).flight} animals in dataset share this trait
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-800">Legs</h3>
                    </div>
                    <p className="text-gray-600">
                      Has {currentAnimal.legs} legs
                    </p>
                    <div className="mt-2 text-sm text-purple-600">
                      {getAnimalAnalysis(currentAnimal).legs} animals in dataset share this trait
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {gameMode === 'game' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {!currentAnimal ? (
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
                    <div className="text-6xl mb-4">{getAnimalEmoji(currentAnimal.name)}</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentAnimal.name}</h2>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
                        <Lightbulb className="w-6 h-6 text-yellow-600" />
                        {currentQuestion?.text}
                      </h3>
                      
                      {!showExplanation && (
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => handleAnswer(true)}
                            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                          >
                            <Check className="w-5 h-5" />
                            Yes
                          </button>
                          <button
                            onClick={() => handleAnswer(false)}
                            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                          >
                            <X className="w-5 h-5" />
                            No
                          </button>
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
                          The correct answer is: <strong>{correctAnswer ? 'Yes' : 'No'}</strong>
                        </p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg mb-4">
                        <h4 className="font-semibold text-gray-700 mb-2">Explanation:</h4>
                        <p className="text-gray-600">
                          {currentQuestion?.text.includes('fur') && 
                            (currentAnimal.hasFur ? `${currentAnimal.name} has fur.` : `${currentAnimal.name} does not have fur.`)
                          }
                          {currentQuestion?.text.includes('fly') && 
                            (currentAnimal.canFly ? `${currentAnimal.name} can fly.` : `${currentAnimal.name} cannot fly.`)
                          }
                          {currentQuestion?.text.includes('legs') && 
                            `${currentAnimal.name} has ${currentAnimal.legs} legs.`
                          }
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

        {/* Dataset Overview */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart className="w-6 h-6 text-blue-600" />
            Animal Dataset Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fur Distribution */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Fur Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={vizData.furData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {vizData.furData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-2 text-sm text-gray-600">
                {vizData.furData.map((item, index) => (
                  <div key={index} className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                    <span>{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Flight Distribution */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Flight Ability</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={vizData.flyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {vizData.flyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index + 2]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-2 text-sm text-gray-600">
                {vizData.flyData.map((item, index) => (
                  <div key={index} className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index + 2] }}></div>
                    <span>{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legs Distribution */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Number of Legs</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={vizData.legsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Learning Tips */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Animal Classification Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">🧠 Observation Skills</h3>
              <p className="text-purple-100">
                Pay attention to physical characteristics like fur, wings, and body structure to identify animals correctly.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🔍 Pattern Recognition</h3>
              <p className="text-purple-100">
                Look for patterns in the data - most birds can fly, most mammals have fur, and leg count varies by species.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">📊 Data Analysis</h3>
              <p className="text-purple-100">
                Understanding animal characteristics helps in biological classification and species identification.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🎯 Critical Thinking</h3>
              <p className="text-purple-100">
                Some animals break the typical patterns - like bats (mammals that fly) or ostriches (birds that don't fly).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalQuiz;
