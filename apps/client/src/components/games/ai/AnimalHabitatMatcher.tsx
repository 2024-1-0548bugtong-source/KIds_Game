import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { useProgress } from '../../../contexts/ProgressContext';

interface AnimalHabitatMatcherProps {
  grade: number;
}

interface Animal {
  id: number;
  name: string;
  features: string[];
  habitat: string;
  image: string; // URL to animal image
  difficulty: number; // 1-5 scale
}

interface Habitat {
  id: number;
  name: string;
  features: string[];
  image: string; // URL to habitat image
}

interface GameState {
  currentAnimal: Animal | null;
  habitats: Habitat[];
  selectedHabitat: number | null;
  score: number;
  round: number;
  totalRounds: number;
  feedback: string;
  showFeedback: boolean;
  timeRemaining: number;
  gameCompleted: boolean;
  explanation: string;
  showExplanation: boolean;
}

// Mock data for animals and habitats
const animals: Animal[] = [
  {
    id: 1,
    name: 'Polar Bear',
    features: ['thick fur', 'white color', 'large paws', 'swims well', 'carnivore'],
    habitat: 'Arctic',
    image: '/images/animals/polar-bear.png',
    difficulty: 1
  },
  {
    id: 2,
    name: 'Camel',
    features: ['humps', 'long eyelashes', 'wide feet', 'stores water', 'herbivore'],
    habitat: 'Desert',
    image: '/images/animals/camel.png',
    difficulty: 1
  },
  {
    id: 3,
    name: 'Monkey',
    features: ['prehensile tail', 'opposable thumbs', 'lives in trees', 'omnivore', 'social'],
    habitat: 'Rainforest',
    image: '/images/animals/monkey.png',
    difficulty: 2
  },
  {
    id: 4,
    name: 'Penguin',
    features: ['waterproof feathers', 'wings for swimming', 'black and white', 'carnivore', 'social'],
    habitat: 'Antarctic',
    image: '/images/animals/penguin.png',
    difficulty: 2
  },
  {
    id: 5,
    name: 'Lion',
    features: ['mane', 'sharp claws', 'social groups', 'carnivore', 'territorial'],
    habitat: 'Savanna',
    image: '/images/animals/lion.png',
    difficulty: 2
  },
  {
    id: 6,
    name: 'Salmon',
    features: ['scales', 'gills', 'swims upstream', 'carnivore', 'migratory'],
    habitat: 'River',
    image: '/images/animals/salmon.png',
    difficulty: 3
  },
  {
    id: 7,
    name: 'Kangaroo',
    features: ['pouch', 'powerful legs', 'herbivore', 'social', 'nocturnal'],
    habitat: 'Grassland',
    image: '/images/animals/kangaroo.png',
    difficulty: 3
  },
  {
    id: 8,
    name: 'Octopus',
    features: ['eight arms', 'ink sac', 'camouflage', 'carnivore', 'intelligent'],
    habitat: 'Ocean',
    image: '/images/animals/octopus.png',
    difficulty: 4
  },
  {
    id: 9,
    name: 'Panda',
    features: ['black and white', 'thumb-like wrist bone', 'herbivore', 'solitary', 'climbs trees'],
    habitat: 'Mountain Forest',
    image: '/images/animals/panda.png',
    difficulty: 4
  },
  {
    id: 10,
    name: 'Bat',
    features: ['wings', 'echolocation', 'nocturnal', 'hangs upside down', 'insectivore'],
    habitat: 'Cave',
    image: '/images/animals/bat.png',
    difficulty: 5
  }
];

const habitats: Habitat[] = [
  {
    id: 1,
    name: 'Arctic',
    features: ['ice', 'snow', 'cold temperatures', 'low vegetation', 'seasonal daylight'],
    image: '/images/habitats/arctic.png'
  },
  {
    id: 2,
    name: 'Desert',
    features: ['sand', 'hot days', 'cold nights', 'little water', 'sparse vegetation'],
    image: '/images/habitats/desert.png'
  },
  {
    id: 3,
    name: 'Rainforest',
    features: ['dense trees', 'high rainfall', 'high humidity', 'diverse plants', 'multi-layered canopy'],
    image: '/images/habitats/rainforest.png'
  },
  {
    id: 4,
    name: 'Antarctic',
    features: ['ice', 'snow', 'extreme cold', 'seasonal daylight', 'rocky shores'],
    image: '/images/habitats/antartic.png'
  },
  {
    id: 5,
    name: 'Savanna',
    features: ['grassland', 'scattered trees', 'seasonal rainfall', 'large herbivores', 'predators'],
    image: '/images/habitats/savanna.png'
  },
  {
    id: 6,
    name: 'River',
    features: ['flowing water', 'varying depths', 'seasonal changes', 'banks', 'aquatic plants'],
    image: '/images/habitats/river.png'
  },
  {
    id: 7,
    name: 'Grassland',
    features: ['grasses', 'few trees', 'seasonal rainfall', 'grazing animals', 'burrowing animals'],
    image: '/images/habitats/grassland.png'
  },
  {
    id: 8,
    name: 'Ocean',
    features: ['salt water', 'waves', 'varying depths', 'currents', 'diverse marine life'],
    image: '/images/habitats/ocean.png'
  },
  {
    id: 9,
    name: 'Mountain Forest',
    features: ['high elevation', 'sloped terrain', 'coniferous trees', 'cool temperatures', 'seasonal changes'],
    image: '/images/habitats/mountain-forest.png'
  },
  {
    id: 10,
    name: 'Cave',
    features: ['darkness', 'constant temperature', 'high humidity', 'mineral formations', 'limited food sources'],
    image: '/images/habitats/cave.png'
  }
];

// Generate explanations based on animal features and habitat features
const generateExplanation = (animal: Animal, habitat: Habitat, grade: number): string => {
  if (grade <= 6) {
    // Simple explanation for younger students
    return `${animal.name}s live in ${habitat.name}s because they have ${animal.features.slice(0, 2).join(' and ')} which helps them survive in ${habitat.features.slice(0, 2).join(' and ')}.`;
  } else if (grade <= 8) {
    // More detailed explanation for middle grades
    return `${animal.name}s are adapted to ${habitat.name} environments. Their ${animal.features.slice(0, 3).join(', ')} are adaptations that help them thrive in conditions like ${habitat.features.slice(0, 3).join(', ')}.`;
  } else {
    // Advanced explanation with ecological concepts for higher grades
    return `${animal.name}s have evolved specific adaptations (${animal.features.slice(0, 4).join(', ')}) that allow them to occupy their ecological niche in ${habitat.name} biomes. These adaptations provide advantages for survival in an environment characterized by ${habitat.features.slice(0, 4).join(', ')}. This demonstrates the concept of environmental adaptation through natural selection.`;
  }
};

// Filter animals based on grade level
const getAnimalsForGrade = (grade: number): Animal[] => {
  if (grade <= 6) {
    // Easier animals for younger students (difficulty 1-2)
    return animals.filter(animal => animal.difficulty <= 2);
  } else if (grade <= 8) {
    // Medium difficulty animals (difficulty 1-4)
    return animals.filter(animal => animal.difficulty <= 4);
  } else {
    // All animals including the most difficult ones
    return animals;
  }
};

// Get number of habitats to show based on grade
const getNumberOfHabitatsToShow = (grade: number): number => {
  if (grade <= 6) return 3; // Fewer options for younger students
  if (grade <= 8) return 5; // More options for middle grades
  return 7; // Most options for older students
};

// Get number of rounds based on grade
const getNumberOfRounds = (grade: number): number => {
  if (grade <= 6) return 5; // Fewer rounds for younger students
  if (grade <= 8) return 7; // More rounds for middle grades
  return 10; // Most rounds for older students
};

// Get time per round based on grade
const getTimePerRound = (grade: number): number => {
  if (grade <= 6) return 45; // More time for younger students
  if (grade <= 8) return 35; // Less time for middle grades
  return 30; // Least time for older students
};

const AnimalHabitatMatcher: React.FC<AnimalHabitatMatcherProps> = ({ grade }) => {
  const [gameState, setGameState] = useState<GameState>({
    currentAnimal: null,
    habitats: [],
    selectedHabitat: null,
    score: 0,
    round: 0,
    totalRounds: getNumberOfRounds(grade),
    feedback: '',
    showFeedback: false,
    timeRemaining: getTimePerRound(grade),
    gameCompleted: false,
    explanation: '',
    showExplanation: false
  });

  const { currentUser } = useAuth();
  const { recordActivity } = useProgress();

  // Initialize game
  useEffect(() => {
    startNewRound();
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState.gameCompleted || gameState.showFeedback) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 1) {
          clearInterval(timer);
          // Time's up - show feedback
          return {
            ...prev,
            timeRemaining: 0,
            showFeedback: true,
            feedback: 'Time\'s up! Let\'s see the correct answer.'
          };
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameCompleted, gameState.showFeedback]);

  const startNewRound = () => {
    // Get animals appropriate for this grade level
    const gradeAnimals = getAnimalsForGrade(grade);

    // Select a random animal
    const randomAnimal = gradeAnimals[Math.floor(Math.random() * gradeAnimals.length)];

    // Get the correct habitat for this animal
    const correctHabitat = habitats.find(h => h.name === randomAnimal.habitat)!;

    // Get other random habitats (excluding the correct one)
    const otherHabitats = habitats
      .filter(h => h.name !== randomAnimal.habitat)
      .sort(() => 0.5 - Math.random())
      .slice(0, getNumberOfHabitatsToShow(grade) - 1);

    // Combine and shuffle all habitats
    const roundHabitats = [...otherHabitats, correctHabitat]
      .sort(() => 0.5 - Math.random());

    setGameState(prev => ({
      ...prev,
      currentAnimal: randomAnimal,
      habitats: roundHabitats,
      selectedHabitat: null,
      showFeedback: false,
      timeRemaining: getTimePerRound(grade),
      explanation: generateExplanation(randomAnimal, correctHabitat, grade),
      showExplanation: false
    }));
  };

  const handleHabitatSelect = (habitatId: number) => {
    if (gameState.showFeedback || gameState.selectedHabitat !== null) return;

    setGameState(prev => ({
      ...prev,
      selectedHabitat: habitatId
    }));

    // Check if the selection is correct
    const selectedHabitat = gameState.habitats.find(h => h.id === habitatId)!;
    const isCorrect = gameState.currentAnimal?.habitat === selectedHabitat.name;

    // Calculate points based on time remaining and grade
    const timeBonus = Math.floor(gameState.timeRemaining / 5);
    const difficultyBonus = gameState.currentAnimal?.difficulty || 1;
    const points = isCorrect ? 10 + timeBonus + (difficultyBonus * 2) : 0;

    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        score: prev.score + points,
        showFeedback: true,
        feedback: isCorrect
          ? `Correct! ${gameState.currentAnimal?.name} lives in the ${selectedHabitat.name}. +${points} points!`
          : `Not quite. ${gameState.currentAnimal?.name} actually lives in the ${gameState.currentAnimal?.habitat}.`
      }));
    }, 500);
  };

  const handleNextRound = () => {
    const newRound = gameState.round + 1;

    if (newRound >= gameState.totalRounds) {
      // Game completed
      setGameState(prev => ({
        ...prev,
        gameCompleted: true
      }));

      // Record activity in progress context
      const xpEarned = calculateXpEarned();
      recordActivity({
        gamePlayed: true,
        gameCompleted: true,
        xpEarned
      });
    } else {
      // Start next round
      setGameState(prev => ({
        ...prev,
        round: newRound
      }));
      startNewRound();
    }
  };

  const handleShowExplanation = () => {
    setGameState(prev => ({
      ...prev,
      showExplanation: true
    }));
  };

  // Calculate XP earned based on score and grade level
  const calculateXpEarned = () => {
    const baseXp = 20; // Base XP for completing the game
    const scoreMultiplier = 0.5; // Multiplier for score
    const gradeMultiplier = grade / 5; // Higher grades earn more XP

    return Math.round(baseXp + (gameState.score * scoreMultiplier * gradeMultiplier));
  };

  // Render feature list with appropriate complexity based on grade
  const renderFeatures = (features: string[]) => {
    const numFeatures = grade <= 6 ? 3 : grade <= 8 ? 4 : 5;

    return (
      <ul className="text-sm text-gray-300 list-disc pl-5">
        {features.slice(0, numFeatures).map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    );
  };

  if (gameState.gameCompleted) {
    const xpEarned = calculateXpEarned();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">🦁 Animal Habitat Matcher Completed!</h2>
        <div className="text-center">
          <p className="text-xl text-gray-300 mb-4">Your Score:</p>
          <p className="text-4xl font-bold text-green-400 mb-6">{gameState.score}</p>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((gameState.score / (gameState.totalRounds * 30)) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-gray-400 mb-4">
            {gameState.score >= gameState.totalRounds * 25 ? 'Animal Habitat Expert! 🏆' :
              gameState.score >= gameState.totalRounds * 15 ? 'Great job matching animals! 🌟' :
                gameState.score >= gameState.totalRounds * 10 ? 'Good effort! 👍' : 'Keep learning about animals! 💪'}
          </p>
          <p className="text-green-400 font-semibold">+ {xpEarned} XP earned!</p>
          <p className="text-gray-300 mt-4 text-sm">
            You've learned how animals have special features that help them survive in their habitats!
            {grade >= 9 && ' This demonstrates the AI concept of feature matching and association learning.'}
          </p>
        </div>
      </motion.div>
    );
  }

  if (!gameState.currentAnimal) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Animal Habitat Matcher</h2>
        <div className="text-right">
          <p className="text-sm text-gray-400">Round {gameState.round + 1} of {gameState.totalRounds}</p>
          <p className="text-lg font-semibold text-green-400">Score: {gameState.score}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-white text-lg">Match the animal to its correct habitat</p>
          <div className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
            Time: {gameState.timeRemaining}s
          </div>
        </div>

        {/* Animal Card */}
        <div className="bg-white/5 p-4 rounded-xl mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-32 h-32 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={gameState.currentAnimal.image}
                alt={gameState.currentAnimal.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-white mb-2">{gameState.currentAnimal.name}</h3>
              <p className="text-gray-300 mb-2">Features:</p>
              {renderFeatures(gameState.currentAnimal.features)}

              {/* Show AI concept explanation for higher grades */}
              {grade >= 9 && (
                <div className="mt-3 text-xs text-gray-400">
                  <p>AI Concept: Feature matching algorithms analyze characteristics to find patterns and make predictions.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Habitats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {gameState.habitats.map(habitat => {
            const isSelected = gameState.selectedHabitat === habitat.id;
            const isCorrect = gameState.showFeedback && gameState.currentAnimal?.habitat === habitat.name;
            const isIncorrect = gameState.showFeedback && isSelected && !isCorrect;

            let borderColor = 'border-white/10';
            if (isSelected) borderColor = 'border-blue-500';
            if (isCorrect) borderColor = 'border-green-500';
            if (isIncorrect) borderColor = 'border-red-500';

            return (
              <motion.div
                key={habitat.id}
                whileHover={{ scale: gameState.showFeedback ? 1 : 1.03 }}
                className={`bg-white/5 rounded-xl p-3 border-2 ${borderColor} cursor-pointer transition-colors`}
                onClick={() => !gameState.showFeedback && handleHabitatSelect(habitat.id)}
              >
                <div className="w-full h-24 bg-gray-700 rounded-lg overflow-hidden mb-2">
                  <img
                    src={habitat.image}
                    alt={habitat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-white font-semibold mb-1">{habitat.name}</h4>

                {/* Show habitat features based on grade level */}
                {(grade >= 7 || gameState.showFeedback) && (
                  <div className="mt-1">
                    <p className="text-xs text-gray-400 mb-1">Characteristics:</p>
                    {renderFeatures(habitat.features)}
                  </div>
                )}

                {/* Show correct/incorrect indicators */}
                {isCorrect && (
                  <div className="mt-2 text-green-400 text-sm font-semibold">✓ Correct</div>
                )}
                {isIncorrect && (
                  <div className="mt-2 text-red-400 text-sm font-semibold">✗ Incorrect</div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Feedback and Next Button */}
        {gameState.showFeedback && (
          <div className="text-center">
            <p className="text-white mb-4">{gameState.feedback}</p>

            {!gameState.showExplanation && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors mr-4"
                onClick={handleShowExplanation}
              >
                Show Explanation
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={handleNextRound}
            >
              {gameState.round < gameState.totalRounds - 1 ? 'Next Animal' : 'Finish Game'}
            </motion.button>
          </div>
        )}

        {/* Explanation */}
        {gameState.showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-white/5 rounded-lg"
          >
            <h4 className="text-white font-semibold mb-2">Why does this animal live in this habitat?</h4>
            <p className="text-gray-300 text-sm">{gameState.explanation}</p>

            {/* Additional AI concept explanation for higher grades */}
            {grade >= 8 && (
              <div className="mt-3 p-2 bg-white/5 rounded-lg">
                <p className="text-xs text-blue-300">
                  <span className="font-bold">AI Connection:</span> This matching process is similar to how AI classification algorithms work.
                  They identify patterns in features (like an animal's characteristics) and associate them with categories (like habitats)
                  based on training data and feature correlation.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Instructions based on grade level */}
        {!gameState.showFeedback && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-white text-sm">
              {grade <= 6 ? (
                "Look at the animal's features and choose where it lives!"
              ) : grade <= 8 ? (
                "Match the animal to its habitat by analyzing how its features help it survive in that environment."
              ) : (
                "Analyze the animal's adaptations and match it to the habitat where these features provide evolutionary advantages."
              )}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AnimalHabitatMatcher;