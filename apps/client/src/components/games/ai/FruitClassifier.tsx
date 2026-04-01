import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { useProgress } from '../../../contexts/ProgressContext';

interface FruitClassifierProps {
  grade: number;
}

interface Fruit {
  name: string;
  color: string;
  shape: string;
  size: string;
}

interface ClassificationTask {
  fruits: Fruit[];
  targetAttribute: keyof Fruit;
  difficulty: number; // 1-5 scale
  question: string;
}

// Mock dataset based on the CSV file
const fruitData: Fruit[] = [
  { name: 'Apple', color: 'Red', shape: 'Round', size: 'Medium' },
  { name: 'Banana', color: 'Yellow', shape: 'Long', size: 'Medium' },
  { name: 'Grapes', color: 'Green', shape: 'Round', size: 'Small' },
  { name: 'Mango', color: 'Yellow', shape: 'Oval', size: 'Medium' },
  { name: 'Watermelon', color: 'Green', shape: 'Round', size: 'Large' },
  { name: 'Lemon', color: 'Yellow', shape: 'Small', size: 'Sour' },
  { name: 'Strawberry', color: 'Red', shape: 'Heart', size: 'Small' },
  { name: 'Pineapple', color: 'Yellow', shape: 'Oval', size: 'Large' },
  { name: 'Lime', color: 'Green', shape: 'Small', size: 'Sour' },
  { name: 'Pear', color: 'Green', shape: 'Oval', size: 'Medium' },
];

// Fruit emoji mapping
const fruitEmojis: Record<string, string> = {
  'Apple': '🍎',
  'Banana': '🍌',
  'Grapes': '🍇',
  'Mango': '🥭',
  'Watermelon': '🍉',
  'Lemon': '🍋',
  'Strawberry': '🍓',
  'Pineapple': '🍍',
  'Lime': '🍋',
  'Pear': '🍐',
};

// Color emoji mapping
const colorEmojis: Record<string, string> = {
  'Red': '🔴',
  'Yellow': '🟡',
  'Green': '🟢',
};

// Shape emoji mapping
const shapeEmojis: Record<string, { emoji: string, description: string }> = {
  'Round': { emoji: '⭕', description: 'Round' },
  'Long': { emoji: '📏', description: 'Long' },
  'Oval': { emoji: '🥚', description: 'Oval' },
  'Heart': { emoji: '❤️', description: 'Heart-shaped' },
  'Small': { emoji: '🔹', description: 'Small' },
};

// Size emoji mapping
const sizeEmojis: Record<string, string> = {
  'Small': '🔽',
  'Medium': '◽',
  'Large': '🔼',
  'Sour': '😖',
};

// Generate classification tasks based on grade level
const generateTasks = (grade: number): ClassificationTask[] => {
  // Basic tasks for younger students (Class 5-6)
  const basicTasks: ClassificationTask[] = [
    {
      fruits: fruitData.filter(f => ['Red', 'Yellow', 'Green'].includes(f.color)),
      targetAttribute: 'color',
      difficulty: 1,
      question: 'Sort these fruits by their color',
    },
    {
      fruits: fruitData.filter(f => ['Small', 'Medium', 'Large'].includes(f.size)),
      targetAttribute: 'size',
      difficulty: 1,
      question: 'Group these fruits by their size',
    },
  ];

  // Intermediate tasks for middle grades (Class 7-8)
  const intermediateTasks: ClassificationTask[] = [
    {
      fruits: fruitData.filter(f => ['Round', 'Oval', 'Long', 'Heart'].includes(f.shape)),
      targetAttribute: 'shape',
      difficulty: 3,
      question: 'Classify these fruits by their shape',
    },
    {
      fruits: fruitData,
      targetAttribute: 'color',
      difficulty: 2,
      question: 'Create a decision tree based on color',
    },
  ];

  // Advanced tasks for older students (Class 9-10)
  const advancedTasks: ClassificationTask[] = [
    {
      fruits: fruitData,
      targetAttribute: 'shape',
      difficulty: 4,
      question: 'Build a multi-level classifier based on shape',
    },
    {
      fruits: fruitData,
      targetAttribute: 'size',
      difficulty: 5,
      question: 'Create an optimal decision tree for classifying by size',
    },
  ];

  // Select tasks based on grade level
  let availableTasks: ClassificationTask[] = [];

  if (grade <= 6) {
    // For grades 5-6, use only basic tasks
    availableTasks = basicTasks;
  } else if (grade <= 8) {
    // For grades 7-8, use basic and intermediate tasks
    availableTasks = [...basicTasks, ...intermediateTasks];
  } else {
    // For grades 9-10, use all tasks
    availableTasks = [...basicTasks, ...intermediateTasks, ...advancedTasks];
  }

  // Further adjust difficulty based on exact grade
  return availableTasks.filter(task => {
    if (grade === 5) return task.difficulty <= 2;
    if (grade === 6) return task.difficulty <= 3;
    if (grade === 7) return task.difficulty <= 3;
    if (grade === 8) return task.difficulty <= 4;
    if (grade === 9) return task.difficulty <= 5;
    if (grade === 10) return task.difficulty <= 5;
    return true;
  });
};

const FruitClassifier: React.FC<FruitClassifierProps> = ({ grade }) => {
  const [tasks, setTasks] = useState<ClassificationTask[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [userClassifications, setUserClassifications] = useState<Record<string, string[]>>({});
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes per task
  const [draggedFruit, setDraggedFruit] = useState<string | null>(null);

  const { currentUser } = useAuth();
  const { recordActivity } = useProgress();

  // Initialize tasks based on grade
  useEffect(() => {
    const generatedTasks = generateTasks(grade);
    // Shuffle and take up to 3 tasks
    const shuffled = [...generatedTasks].sort(() => 0.5 - Math.random());
    setTasks(shuffled.slice(0, 3));

    // Initialize user classifications
    const initialClassifications: Record<string, string[]> = {};
    if (shuffled.length > 0) {
      // Convert Set to Array to ensure compatibility with ES5
      const uniqueValues = Array.from(new Set(shuffled[0].fruits.map(f => f[shuffled[0].targetAttribute])));
      uniqueValues.forEach(value => {
        initialClassifications[value] = [];
      });
    }
    setUserClassifications(initialClassifications);
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

  const handleDragStart = (fruitName: string) => {
    setDraggedFruit(fruitName);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (category: string) => {
    if (!draggedFruit) return;

    // Update classifications
    const updatedClassifications = { ...userClassifications };

    // Remove fruit from any existing category
    Object.keys(updatedClassifications).forEach(key => {
      updatedClassifications[key] = updatedClassifications[key].filter(f => f !== draggedFruit);
    });

    // Add to new category
    updatedClassifications[category] = [...updatedClassifications[category], draggedFruit];

    setUserClassifications(updatedClassifications);
    setDraggedFruit(null);
  };

  const handleSubmit = () => {
    if (!currentTask) return;

    // Calculate score based on correct classifications
    let correctCount = 0;
    let totalCount = 0;

    Object.keys(userClassifications).forEach(category => {
      userClassifications[category].forEach(fruitName => {
        const fruit = currentTask.fruits.find(f => f.name === fruitName);
        if (fruit && fruit[currentTask.targetAttribute] === category) {
          correctCount++;
        }
        totalCount++;
      });
    });

    // Calculate score (percentage correct * points per task)
    const taskScore = Math.round((correctCount / totalCount) * 20);
    const timeBonus = Math.floor(timeRemaining / 20);
    const difficultyBonus = currentTask.difficulty * 2;

    setScore(score + taskScore + timeBonus + difficultyBonus);
    setShowFeedback(true);
    setTimeRemaining(0);
  };

  const handleNextTask = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);

      // Initialize user classifications for next task
      const nextTask = tasks[currentTaskIndex + 1];
      const initialClassifications: Record<string, string[]> = {};
      // Convert Set to Array to ensure compatibility with ES5
      const uniqueValues = Array.from(new Set(nextTask.fruits.map(f => f[nextTask.targetAttribute])));
      uniqueValues.forEach(value => {
        initialClassifications[value] = [];
      });

      setUserClassifications(initialClassifications);
      setShowFeedback(false);
      setTimeRemaining(120); // Reset timer
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
    const baseXp = 15; // Base XP for completing the game
    const scoreXp = score / 2; // XP from score
    const gradeMultiplier = grade / 5; // Higher grades earn more XP

    return Math.round(baseXp + (scoreXp * gradeMultiplier));
  };

  // Get emoji for a fruit attribute
  const getAttributeEmoji = (fruit: Fruit, attribute: keyof Fruit) => {
    if (attribute === 'name') return fruitEmojis[fruit.name] || fruit.name;
    if (attribute === 'color') return colorEmojis[fruit.color] || fruit.color;
    if (attribute === 'shape') return shapeEmojis[fruit.shape]?.emoji || fruit.shape;
    if (attribute === 'size') return sizeEmojis[fruit.size] || fruit.size;
    return fruit[attribute];
  };

  // Get attribute display name
  const getAttributeDisplay = (attribute: keyof Fruit) => {
    if (attribute === 'name') return 'Name';
    if (attribute === 'color') return 'Color';
    if (attribute === 'shape') return 'Shape';
    if (attribute === 'size') return 'Size';
    return attribute;
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
        <h2 className="text-3xl font-bold text-white mb-6 text-center">🎉 Fruit Classifier Completed!</h2>
        <div className="text-center">
          <p className="text-xl text-gray-300 mb-4">Your Score:</p>
          <p className="text-4xl font-bold text-purple-400 mb-6">{score}</p>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((score / (tasks.length * 30)) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-gray-400 mb-4">
            {score >= tasks.length * 25 ? 'Classification Expert! 🏆' :
              score >= tasks.length * 20 ? 'Great classifier! 🌟' :
                score >= tasks.length * 15 ? 'Good effort! 👍' : 'Keep practicing! 💪'}
          </p>
          <p className="text-green-400 font-semibold">+ {xpEarned} XP earned!</p>
          <p className="text-gray-300 mt-4 text-sm">
            You've learned how AI uses decision trees to classify objects based on their attributes!
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
        <h2 className="text-2xl font-bold text-white">Fruit Classifier</h2>
        <div className="text-right">
          <p className="text-sm text-gray-400">Task {currentTaskIndex + 1} of {tasks.length}</p>
          <p className="text-lg font-semibold text-purple-400">Score: {score}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <p className="text-white text-lg">{currentTask.question}</p>
          <div className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
            Time: {timeRemaining}s
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left side: Fruits to classify */}
          <div className="bg-white/5 p-4 rounded-xl">
            <h3 className="text-white font-semibold mb-3">Fruits to Classify</h3>
            <div className="flex flex-wrap gap-2">
              {currentTask.fruits.map(fruit => {
                // Check if fruit is already classified
                const isClassified = Object.values(userClassifications).some(
                  category => category.includes(fruit.name)
                );

                if (isClassified) return null;

                return (
                  <motion.div
                    key={fruit.name}
                    draggable
                    onDragStart={() => handleDragStart(fruit.name)}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 p-3 rounded-lg cursor-move flex flex-col items-center"
                  >
                    <span className="text-2xl mb-1">{fruitEmojis[fruit.name]}</span>
                    <span className="text-white text-sm">{fruit.name}</span>
                    {grade >= 7 && (
                      <div className="flex mt-1 gap-1">
                        <span title={`Color: ${fruit.color}`} className="text-xs">{colorEmojis[fruit.color]}</span>
                        <span title={`Shape: ${shapeEmojis[fruit.shape]?.description}`} className="text-xs">{shapeEmojis[fruit.shape]?.emoji}</span>
                        <span title={`Size: ${fruit.size}`} className="text-xs">{sizeEmojis[fruit.size]}</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right side: Classification categories */}
          <div className="grid grid-cols-1 gap-4">
            {Object.keys(userClassifications).map(category => (
              <div
                key={category}
                className="bg-white/5 p-4 rounded-xl"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(category)}
              >
                <h3 className="text-white font-semibold mb-2 flex items-center">
                  <span className="mr-2">
                    {currentTask.targetAttribute === 'color' && colorEmojis[category]}
                    {currentTask.targetAttribute === 'shape' && shapeEmojis[category]?.emoji}
                    {currentTask.targetAttribute === 'size' && sizeEmojis[category]}
                  </span>
                  {category}
                </h3>
                <div className="min-h-[100px] border border-dashed border-white/20 rounded-lg p-2 flex flex-wrap gap-2">
                  {userClassifications[category].map(fruitName => {
                    const fruit = currentTask.fruits.find(f => f.name === fruitName);
                    if (!fruit) return null;

                    return (
                      <motion.div
                        key={fruitName}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="bg-white/10 p-2 rounded-lg flex flex-col items-center"
                      >
                        <span className="text-xl">{fruitEmojis[fruitName]}</span>
                        <span className="text-white text-xs">{fruitName}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showFeedback ? (
          <div className="text-center mb-4">
            <p className="text-white mb-2">Classification Results:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {currentTask.fruits.map(fruit => {
                const userCategory = Object.keys(userClassifications).find(
                  category => userClassifications[category].includes(fruit.name)
                );
                const correctCategory = fruit[currentTask.targetAttribute];
                const isCorrect = userCategory === correctCategory;

                return (
                  <div
                    key={fruit.name}
                    className={`p-2 rounded-lg ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{fruitEmojis[fruit.name]}</span>
                      <span className="text-white text-sm">{fruit.name}</span>
                    </div>
                    <div className="text-xs mt-1">
                      {isCorrect ? (
                        <span className="text-green-300">Correct! ✓</span>
                      ) : (
                        <span className="text-red-300">
                          Should be in {correctCategory} {getAttributeEmoji(fruit, currentTask.targetAttribute)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
            onClick={handleSubmit}
          >
            Submit Classification
          </motion.button>
        )}

        {grade >= 8 && !showFeedback && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-white text-sm mb-2">Decision Tree Tips:</p>
            <ul className="text-gray-300 text-xs list-disc pl-4">
              <li>Look for patterns in the attributes</li>
              <li>Start with the most distinctive feature</li>
              <li>Group similar items together</li>
              <li>Consider multiple attributes for complex classifications</li>
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FruitClassifier;