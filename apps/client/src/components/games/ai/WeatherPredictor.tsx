import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { useProgress } from '../../../contexts/ProgressContext';

interface WeatherPredictorProps {
  grade: number;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  cloudCover: number;
  prediction: string;
}

interface PredictionTask {
  data: WeatherData[];
  testCase: Partial<WeatherData>;
  options: string[];
  correctAnswer: string;
  difficulty: number; // 1-5 scale
  hint?: string;
}

// Weather condition emojis
const weatherEmojis: Record<string, string> = {
  'Sunny': '☀️',
  'Cloudy': '☁️',
  'Rainy': '🌧️',
  'Stormy': '⛈️',
  'Snowy': '❄️',
  'Windy': '💨',
  'Foggy': '🌫️',
};

// Generate mock weather dataset
const generateWeatherDataset = (): WeatherData[] => {
  const dataset: WeatherData[] = [];

  // Generate sunny data points
  for (let i = 0; i < 5; i++) {
    dataset.push({
      temperature: 25 + Math.random() * 10, // 25-35°C
      humidity: 30 + Math.random() * 20, // 30-50%
      pressure: 1010 + Math.random() * 5, // 1010-1015 hPa
      windSpeed: Math.random() * 10, // 0-10 km/h
      cloudCover: Math.random() * 20, // 0-20%
      prediction: 'Sunny'
    });
  }

  // Generate cloudy data points
  for (let i = 0; i < 5; i++) {
    dataset.push({
      temperature: 15 + Math.random() * 10, // 15-25°C
      humidity: 50 + Math.random() * 20, // 50-70%
      pressure: 1005 + Math.random() * 5, // 1005-1010 hPa
      windSpeed: 5 + Math.random() * 10, // 5-15 km/h
      cloudCover: 40 + Math.random() * 40, // 40-80%
      prediction: 'Cloudy'
    });
  }

  // Generate rainy data points
  for (let i = 0; i < 5; i++) {
    dataset.push({
      temperature: 10 + Math.random() * 10, // 10-20°C
      humidity: 70 + Math.random() * 20, // 70-90%
      pressure: 995 + Math.random() * 10, // 995-1005 hPa
      windSpeed: 10 + Math.random() * 15, // 10-25 km/h
      cloudCover: 70 + Math.random() * 30, // 70-100%
      prediction: 'Rainy'
    });
  }

  // Generate stormy data points
  for (let i = 0; i < 5; i++) {
    dataset.push({
      temperature: 5 + Math.random() * 10, // 5-15°C
      humidity: 80 + Math.random() * 15, // 80-95%
      pressure: 980 + Math.random() * 15, // 980-995 hPa
      windSpeed: 25 + Math.random() * 20, // 25-45 km/h
      cloudCover: 90 + Math.random() * 10, // 90-100%
      prediction: 'Stormy'
    });
  }

  // Generate snowy data points
  for (let i = 0; i < 5; i++) {
    dataset.push({
      temperature: -10 + Math.random() * 10, // -10-0°C
      humidity: 70 + Math.random() * 20, // 70-90%
      pressure: 1000 + Math.random() * 10, // 1000-1010 hPa
      windSpeed: 5 + Math.random() * 15, // 5-20 km/h
      cloudCover: 60 + Math.random() * 40, // 60-100%
      prediction: 'Snowy'
    });
  }

  return dataset;
};

// Generate prediction tasks based on grade level
const generateTasks = (grade: number): PredictionTask[] => {
  const weatherDataset = generateWeatherDataset();
  const tasks: PredictionTask[] = [];

  // Basic tasks for younger students (Class 5-6)
  const basicTasks: PredictionTask[] = [
    // Simple temperature-based prediction
    {
      data: weatherDataset.filter(d => d.prediction === 'Sunny' || d.prediction === 'Snowy').slice(0, 6),
      testCase: { temperature: 30 },
      options: ['Sunny', 'Snowy'],
      correctAnswer: 'Sunny',
      difficulty: 1,
      hint: 'Look at the temperature patterns. Higher temperatures usually mean sunny weather.'
    },
    // Simple humidity-based prediction
    {
      data: weatherDataset.filter(d => d.prediction === 'Sunny' || d.prediction === 'Rainy').slice(0, 6),
      testCase: { humidity: 80 },
      options: ['Sunny', 'Rainy'],
      correctAnswer: 'Rainy',
      difficulty: 1,
      hint: 'Check the humidity levels. Higher humidity often leads to rain.'
    }
  ];

  // Intermediate tasks for middle grades (Class 7-8)
  const intermediateTasks: PredictionTask[] = [
    // Two-factor prediction (temperature and humidity)
    {
      data: weatherDataset.filter(d => ['Sunny', 'Cloudy', 'Rainy'].includes(d.prediction)).slice(0, 9),
      testCase: { temperature: 18, humidity: 65 },
      options: ['Sunny', 'Cloudy', 'Rainy'],
      correctAnswer: 'Cloudy',
      difficulty: 2,
      hint: 'Consider both temperature and humidity together.'
    },
    // Cloud cover and wind speed prediction
    {
      data: weatherDataset.filter(d => ['Cloudy', 'Windy', 'Rainy'].includes(d.prediction)).slice(0, 9),
      testCase: { cloudCover: 75, windSpeed: 20 },
      options: ['Cloudy', 'Windy', 'Rainy'],
      correctAnswer: 'Rainy',
      difficulty: 3,
      hint: 'High cloud cover with moderate wind speed often indicates rain.'
    }
  ];

  // Advanced tasks for older students (Class 9-10)
  const advancedTasks: PredictionTask[] = [
    // Multi-factor prediction (3+ variables)
    {
      data: weatherDataset.filter(d => ['Sunny', 'Cloudy', 'Rainy', 'Stormy'].includes(d.prediction)).slice(0, 12),
      testCase: { temperature: 12, humidity: 85, pressure: 990, windSpeed: 18 },
      options: ['Sunny', 'Cloudy', 'Rainy', 'Stormy'],
      correctAnswer: 'Stormy',
      difficulty: 4,
      hint: 'Consider all factors: temperature, humidity, pressure, and wind speed.'
    },
    // Complex prediction with all variables
    {
      data: weatherDataset,
      testCase: { temperature: 0, humidity: 75, pressure: 1005, windSpeed: 10, cloudCover: 80 },
      options: ['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Snowy'],
      correctAnswer: 'Snowy',
      difficulty: 5,
      hint: 'Look for similar patterns across all weather variables.'
    }
  ];

  // Select tasks based on grade level
  if (grade <= 6) {
    // For grades 5-6, use only basic tasks
    tasks.push(...basicTasks);
  } else if (grade <= 8) {
    // For grades 7-8, use basic and intermediate tasks
    tasks.push(...basicTasks, ...intermediateTasks);
  } else {
    // For grades 9-10, use all tasks
    tasks.push(...basicTasks, ...intermediateTasks, ...advancedTasks);
  }

  // Further adjust difficulty based on exact grade
  return tasks.filter(task => {
    if (grade === 5) return task.difficulty <= 1;
    if (grade === 6) return task.difficulty <= 2;
    if (grade === 7) return task.difficulty <= 3;
    if (grade === 8) return task.difficulty <= 3;
    if (grade === 9) return task.difficulty <= 4;
    if (grade === 10) return true;
    return true;
  });
};

// Format number to 1 decimal place
const formatNumber = (num: number): string => {
  return num.toFixed(1);
};

const WeatherPredictor: React.FC<WeatherPredictorProps> = ({ grade }) => {
  const [tasks, setTasks] = useState<PredictionTask[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(90); // 1.5 minutes per task
  const [showHint, setShowHint] = useState(false);
  const [hintPenalty, setHintPenalty] = useState(0);

  const { currentUser } = useAuth();
  const { recordActivity } = useProgress();

  // Initialize tasks based on grade
  useEffect(() => {
    const generatedTasks = generateTasks(grade);
    // Shuffle and take up to 5 tasks
    const shuffled = [...generatedTasks].sort(() => 0.5 - Math.random());
    setTasks(shuffled.slice(0, 5));
  }, [grade]);

  // Timer effect
  useEffect(() => {
    if (gameCompleted || tasks.length === 0 || showFeedback) return;

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
  }, [gameCompleted, tasks.length, showFeedback]);

  const currentTask = tasks[currentTaskIndex];

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!currentTask || !selectedOption) return;

    const isCorrect = selectedOption === currentTask.correctAnswer;
    const taskScore = isCorrect ? 20 - hintPenalty : 0;
    const timeBonus = Math.floor(timeRemaining / 15);

    setScore(score + taskScore + timeBonus);
    setShowFeedback(true);
    setTimeRemaining(0);
  };

  const handleNextTask = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setTimeRemaining(90); // Reset timer
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

  // Calculate XP earned based on score and grade level
  const calculateXpEarned = () => {
    const baseXp = 20; // Base XP for completing the game
    const scoreXp = score / 2; // XP from score
    const gradeMultiplier = grade / 5; // Higher grades earn more XP

    return Math.round(baseXp + (scoreXp * gradeMultiplier));
  };

  // Render data visualization based on grade level
  const renderDataVisualization = (data: WeatherData[]) => {
    if (grade <= 6) {
      // Simple table for younger students
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-white/10">
              <tr>
                <th className="px-4 py-2">Weather</th>
                <th className="px-4 py-2">Temperature (°C)</th>
                {grade >= 6 && <th className="px-4 py-2">Humidity (%)</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b border-white/10">
                  <td className="px-4 py-2 flex items-center">
                    <span className="mr-2">{weatherEmojis[item.prediction]}</span>
                    {item.prediction}
                  </td>
                  <td className="px-4 py-2">{formatNumber(item.temperature)}</td>
                  {grade >= 6 && <td className="px-4 py-2">{formatNumber(item.humidity)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (grade <= 8) {
      // More detailed table for middle grades
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-white/10">
              <tr>
                <th className="px-4 py-2">Weather</th>
                <th className="px-4 py-2">Temp (°C)</th>
                <th className="px-4 py-2">Humidity (%)</th>
                <th className="px-4 py-2">Cloud Cover (%)</th>
                <th className="px-4 py-2">Wind (km/h)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b border-white/10">
                  <td className="px-4 py-2 flex items-center">
                    <span className="mr-2">{weatherEmojis[item.prediction]}</span>
                    {item.prediction}
                  </td>
                  <td className="px-4 py-2">{formatNumber(item.temperature)}</td>
                  <td className="px-4 py-2">{formatNumber(item.humidity)}</td>
                  <td className="px-4 py-2">{formatNumber(item.cloudCover)}</td>
                  <td className="px-4 py-2">{formatNumber(item.windSpeed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      // Full detailed table for older students
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-white/10">
              <tr>
                <th className="px-4 py-2">Weather</th>
                <th className="px-4 py-2">Temp (°C)</th>
                <th className="px-4 py-2">Humidity (%)</th>
                <th className="px-4 py-2">Pressure (hPa)</th>
                <th className="px-4 py-2">Wind (km/h)</th>
                <th className="px-4 py-2">Cloud Cover (%)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b border-white/10">
                  <td className="px-4 py-2 flex items-center">
                    <span className="mr-2">{weatherEmojis[item.prediction]}</span>
                    {item.prediction}
                  </td>
                  <td className="px-4 py-2">{formatNumber(item.temperature)}</td>
                  <td className="px-4 py-2">{formatNumber(item.humidity)}</td>
                  <td className="px-4 py-2">{formatNumber(item.pressure)}</td>
                  <td className="px-4 py-2">{formatNumber(item.windSpeed)}</td>
                  <td className="px-4 py-2">{formatNumber(item.cloudCover)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  if (tasks.length === 0) {
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
        <h2 className="text-3xl font-bold text-white mb-6 text-center">🌦️ Weather Predictor Completed!</h2>
        <div className="text-center">
          <p className="text-xl text-gray-300 mb-4">Your Score:</p>
          <p className="text-4xl font-bold text-purple-400 mb-6">{score}</p>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((score / (tasks.length * 25)) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-gray-400 mb-4">
            {score >= tasks.length * 20 ? 'Weather Prediction Expert! 🏆' :
              score >= tasks.length * 15 ? 'Great forecaster! 🌟' :
                score >= tasks.length * 10 ? 'Good effort! 👍' : 'Keep practicing! 💪'}
          </p>
          <p className="text-green-400 font-semibold">+ {xpEarned} XP earned!</p>
          <p className="text-gray-300 mt-4 text-sm">
            You've learned how AI uses correlation and prediction models to forecast weather based on multiple data points!
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
        <h2 className="text-2xl font-bold text-white">Weather Predictor</h2>
        <div className="text-right">
          <p className="text-sm text-gray-400">Task {currentTaskIndex + 1} of {tasks.length}</p>
          <p className="text-lg font-semibold text-purple-400">Score: {score}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <p className="text-white text-lg">Predict the weather based on the data patterns</p>
          <div className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
            Time: {timeRemaining}s
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Historical Weather Data:</h3>
          {currentTask && renderDataVisualization(currentTask.data)}
        </div>

        <div className="bg-white/5 p-4 rounded-xl mb-6">
          <h3 className="text-white font-semibold mb-3">New Weather Conditions:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {currentTask && Object.entries(currentTask.testCase).map(([key, value]) => (
              <div key={key} className="bg-white/10 p-3 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">{key === 'temperature' ? 'Temperature (°C)' :
                  key === 'humidity' ? 'Humidity (%)' :
                    key === 'pressure' ? 'Pressure (hPa)' :
                      key === 'windSpeed' ? 'Wind Speed (km/h)' :
                        key === 'cloudCover' ? 'Cloud Cover (%)' : key}</p>
                <p className="text-white font-semibold">{formatNumber(value as number)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Predict the Weather:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {currentTask && currentTask.options.map(option => (
              <motion.button
                key={option}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-lg flex flex-col items-center justify-center ${selectedOption === option ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'}`}
                onClick={() => handleOptionSelect(option)}
                disabled={showFeedback}
              >
                <span className="text-2xl mb-1">{weatherEmojis[option]}</span>
                <span className="text-white text-sm">{option}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {showFeedback ? (
          <div className="text-center mb-4">
            <div className={`p-4 rounded-lg mb-4 ${selectedOption === currentTask.correctAnswer ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <p className="text-white mb-2">
                {selectedOption === currentTask.correctAnswer ?
                  '✓ Correct prediction!' :
                  `✗ Incorrect. The correct prediction is ${currentTask.correctAnswer} ${weatherEmojis[currentTask.correctAnswer]}`}
              </p>
              <p className="text-sm text-gray-300">
                {grade >= 7 && (
                  selectedOption === currentTask.correctAnswer ?
                    'You correctly identified the weather pattern based on the data!' :
                    'Look for patterns in the data to make better predictions next time.'
                )}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              onClick={handleNextTask}
            >
              {currentTaskIndex < tasks.length - 1 ? 'Next Task' : 'Finish Game'}
            </motion.button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={!selectedOption}
            >
              Submit Prediction
            </motion.button>

            {currentTask && currentTask.hint && !showHint && (
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

        {showHint && currentTask && currentTask.hint && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-yellow-300 text-sm">
              <span className="font-bold">Hint:</span> {currentTask.hint}
            </p>
          </div>
        )}

        {grade >= 9 && !showFeedback && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-white text-sm mb-2">Prediction Model Tips:</p>
            <ul className="text-gray-300 text-xs list-disc pl-4">
              <li>Look for correlations between weather conditions and measurements</li>
              <li>Consider how multiple factors interact with each other</li>
              <li>Compare the new conditions with similar historical patterns</li>
              <li>Weather prediction often requires analyzing multiple variables together</li>
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WeatherPredictor;