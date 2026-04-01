import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { useProgress } from '../../../contexts/ProgressContext';

interface ChemicalReactionPredictorProps {
  grade: number;
}

interface Chemical {
  id: string;
  name: string;
  formula: string;
  type: string; // acid, base, metal, salt, etc.
  color?: string;
  state: 'solid' | 'liquid' | 'gas';
  properties: string[];
}

interface Reaction {
  id: string;
  reactants: string[]; // Chemical IDs
  products: string[]; // Chemical IDs
  conditions?: string;
  reactionType: string;
  difficulty: number; // 1-5 scale
  description: string;
}

interface GameState {
  currentReaction: Reaction | null;
  availableChemicals: Chemical[];
  selectedChemicals: string[];
  correctProducts: Chemical[];
  score: number;
  round: number;
  totalRounds: number;
  feedback: string;
  showFeedback: boolean;
  timeRemaining: number;
  gameCompleted: boolean;
  showHint: boolean;
  hintPenalty: number;
  explanation: string;
}

// Mock data for chemicals
const chemicals: Chemical[] = [
  {
    id: 'h2',
    name: 'Hydrogen',
    formula: 'H₂',
    type: 'element',
    color: 'colorless',
    state: 'gas',
    properties: ['flammable', 'lightest element', 'odorless']
  },
  {
    id: 'o2',
    name: 'Oxygen',
    formula: 'O₂',
    type: 'element',
    color: 'colorless',
    state: 'gas',
    properties: ['supports combustion', 'odorless', 'reactive']
  },
  {
    id: 'h2o',
    name: 'Water',
    formula: 'H₂O',
    type: 'compound',
    color: 'colorless',
    state: 'liquid',
    properties: ['polar', 'universal solvent', 'high heat capacity']
  },
  {
    id: 'nacl',
    name: 'Sodium Chloride',
    formula: 'NaCl',
    type: 'salt',
    color: 'white',
    state: 'solid',
    properties: ['crystalline', 'soluble in water', 'high melting point']
  },
  {
    id: 'na',
    name: 'Sodium',
    formula: 'Na',
    type: 'metal',
    color: 'silvery-white',
    state: 'solid',
    properties: ['soft', 'highly reactive with water', 'low melting point']
  },
  {
    id: 'cl2',
    name: 'Chlorine',
    formula: 'Cl₂',
    type: 'element',
    color: 'greenish-yellow',
    state: 'gas',
    properties: ['pungent odor', 'toxic', 'highly reactive']
  },
  {
    id: 'hcl',
    name: 'Hydrochloric Acid',
    formula: 'HCl',
    type: 'acid',
    color: 'colorless',
    state: 'liquid',
    properties: ['strong acid', 'corrosive', 'pungent odor']
  },
  {
    id: 'co2',
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    type: 'compound',
    color: 'colorless',
    state: 'gas',
    properties: ['greenhouse gas', 'denser than air', 'slightly acidic in water']
  },
  {
    id: 'c',
    name: 'Carbon',
    formula: 'C',
    type: 'element',
    color: 'black',
    state: 'solid',
    properties: ['forms 4 bonds', 'basis of organic chemistry', 'various allotropes']
  },
  {
    id: 'o3',
    name: 'Ozone',
    formula: 'O₃',
    type: 'compound',
    color: 'pale blue',
    state: 'gas',
    properties: ['pungent odor', 'powerful oxidant', 'unstable']
  },
  {
    id: 'h2so4',
    name: 'Sulfuric Acid',
    formula: 'H₂SO₄',
    type: 'acid',
    color: 'colorless',
    state: 'liquid',
    properties: ['strong acid', 'dehydrating agent', 'corrosive']
  },
  {
    id: 'naoh',
    name: 'Sodium Hydroxide',
    formula: 'NaOH',
    type: 'base',
    color: 'white',
    state: 'solid',
    properties: ['strong base', 'hygroscopic', 'corrosive']
  },
  {
    id: 'caco3',
    name: 'Calcium Carbonate',
    formula: 'CaCO₃',
    type: 'compound',
    color: 'white',
    state: 'solid',
    properties: ['found in limestone', 'reacts with acids', 'decomposes when heated']
  },
  {
    id: 'cao',
    name: 'Calcium Oxide',
    formula: 'CaO',
    type: 'compound',
    color: 'white',
    state: 'solid',
    properties: ['alkaline', 'reacts with water', 'high melting point']
  },
  {
    id: 'ch4',
    name: 'Methane',
    formula: 'CH₄',
    type: 'hydrocarbon',
    color: 'colorless',
    state: 'gas',
    properties: ['flammable', 'greenhouse gas', 'simplest alkane']
  }
];

// Mock data for reactions
const reactions: Reaction[] = [
  {
    id: 'combustion_h2',
    reactants: ['h2', 'o2'],
    products: ['h2o'],
    reactionType: 'combustion',
    difficulty: 1,
    description: 'Hydrogen combustion'
  },
  {
    id: 'nacl_formation',
    reactants: ['na', 'cl2'],
    products: ['nacl'],
    reactionType: 'synthesis',
    difficulty: 2,
    description: 'Sodium chloride formation'
  },
  {
    id: 'water_electrolysis',
    reactants: ['h2o'],
    products: ['h2', 'o2'],
    conditions: 'electricity',
    reactionType: 'decomposition',
    difficulty: 2,
    description: 'Water electrolysis'
  },
  {
    id: 'acid_base',
    reactants: ['hcl', 'naoh'],
    products: ['nacl', 'h2o'],
    reactionType: 'neutralization',
    difficulty: 3,
    description: 'Acid-base neutralization'
  },
  {
    id: 'methane_combustion',
    reactants: ['ch4', 'o2'],
    products: ['co2', 'h2o'],
    reactionType: 'combustion',
    difficulty: 3,
    description: 'Methane combustion'
  },
  {
    id: 'limestone_decomposition',
    reactants: ['caco3'],
    products: ['cao', 'co2'],
    conditions: 'heat',
    reactionType: 'thermal decomposition',
    difficulty: 4,
    description: 'Limestone decomposition'
  },
  {
    id: 'photochemical_o3',
    reactants: ['o2'],
    products: ['o3'],
    conditions: 'UV light',
    reactionType: 'photochemical',
    difficulty: 5,
    description: 'Ozone formation'
  }
];

// Get reactions based on grade level
const getReactionsForGrade = (grade: number): Reaction[] => {
  if (grade <= 6) {
    // Simple reactions for younger students (difficulty 1-2)
    return reactions.filter(reaction => reaction.difficulty <= 2);
  } else if (grade <= 8) {
    // Medium difficulty reactions (difficulty 1-4)
    return reactions.filter(reaction => reaction.difficulty <= 4);
  } else {
    // All reactions including the most difficult ones
    return reactions;
  }
};

// Get number of rounds based on grade
const getNumberOfRounds = (grade: number): number => {
  if (grade <= 6) return 5; // Fewer rounds for younger students
  if (grade <= 8) return 7; // More rounds for middle grades
  return 10; // Most rounds for older students
};

// Get time per round based on grade
const getTimePerRound = (grade: number): number => {
  if (grade <= 6) return 60; // More time for younger students
  if (grade <= 8) return 45; // Less time for middle grades
  return 30; // Least time for older students
};

// Generate explanation based on reaction and grade level
const generateExplanation = (reaction: Reaction, grade: number): string => {
  const reactants = reaction.reactants.map(id => chemicals.find(c => c.id === id)?.name).join(' and ');
  const products = reaction.products.map(id => chemicals.find(c => c.id === id)?.name).join(' and ');

  if (grade <= 6) {
    // Simple explanation for younger students
    return `When ${reactants} combine, they form ${products}. This is a ${reaction.reactionType} reaction.`;
  } else if (grade <= 8) {
    // More detailed explanation for middle grades
    let explanation = `In this ${reaction.reactionType} reaction, ${reactants} react to produce ${products}.`;
    if (reaction.conditions) {
      explanation += ` This reaction requires ${reaction.conditions} to occur.`;
    }
    return explanation;
  } else {
    // Advanced explanation with chemical formulas and concepts for higher grades
    const reactantFormulas = reaction.reactants.map(id => chemicals.find(c => c.id === id)?.formula).join(' + ');
    const productFormulas = reaction.products.map(id => chemicals.find(c => c.id === id)?.formula).join(' + ');

    let explanation = `${reactantFormulas} → ${productFormulas}`;
    explanation += `\n\nThis ${reaction.reactionType} reaction demonstrates how ${reactants} transform into ${products}.`;

    if (reaction.conditions) {
      explanation += ` The reaction is catalyzed or initiated by ${reaction.conditions}.`;
    }

    // Add specific explanations based on reaction type
    if (reaction.reactionType === 'combustion') {
      explanation += ' Combustion reactions involve a substance reacting with oxygen, often producing heat and light.';
    } else if (reaction.reactionType === 'synthesis') {
      explanation += ' Synthesis reactions combine simpler substances to form a more complex product.';
    } else if (reaction.reactionType === 'decomposition') {
      explanation += ' Decomposition reactions break down a complex substance into simpler components.';
    } else if (reaction.reactionType === 'neutralization') {
      explanation += ' Neutralization reactions occur between acids and bases, typically forming water and a salt.';
    }

    return explanation;
  }
};

const ChemicalReactionPredictor: React.FC<ChemicalReactionPredictorProps> = ({ grade }) => {
  const [gameState, setGameState] = useState<GameState>({
    currentReaction: null,
    availableChemicals: [],
    selectedChemicals: [],
    correctProducts: [],
    score: 0,
    round: 0,
    totalRounds: getNumberOfRounds(grade),
    feedback: '',
    showFeedback: false,
    timeRemaining: getTimePerRound(grade),
    gameCompleted: false,
    showHint: false,
    hintPenalty: 0,
    explanation: ''
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
            feedback: 'Time\'s up! Let\'s see the correct products.'
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
    // Get reactions appropriate for this grade level
    const gradeReactions = getReactionsForGrade(grade);

    // Select a random reaction
    const randomReaction = gradeReactions[Math.floor(Math.random() * gradeReactions.length)];

    // Get the correct products for this reaction
    const correctProducts = randomReaction.products.map(id =>
      chemicals.find(c => c.id === id)
    ).filter(c => c !== undefined) as Chemical[];

    // Get reactants as Chemical objects
    const reactants = randomReaction.reactants.map(id =>
      chemicals.find(c => c.id === id)
    ).filter(c => c !== undefined) as Chemical[];

    // Create a pool of available chemicals for selection
    // Include correct products and some distractors
    const distractors = chemicals
      .filter(c => !randomReaction.products.includes(c.id) && !randomReaction.reactants.includes(c.id))
      .sort(() => 0.5 - Math.random())
      .slice(0, grade <= 6 ? 3 : grade <= 8 ? 5 : 7);

    const availableChemicals = [...distractors, ...correctProducts]
      .sort(() => 0.5 - Math.random());

    setGameState(prev => ({
      ...prev,
      currentReaction: randomReaction,
      availableChemicals,
      correctProducts,
      selectedChemicals: [],
      showFeedback: false,
      timeRemaining: getTimePerRound(grade),
      showHint: false,
      hintPenalty: 0,
      explanation: generateExplanation(randomReaction, grade)
    }));
  };

  const handleChemicalSelect = (chemicalId: string) => {
    if (gameState.showFeedback) return;

    setGameState(prev => {
      // If already selected, remove it
      if (prev.selectedChemicals.includes(chemicalId)) {
        return {
          ...prev,
          selectedChemicals: prev.selectedChemicals.filter(id => id !== chemicalId)
        };
      }

      // Otherwise add it
      return {
        ...prev,
        selectedChemicals: [...prev.selectedChemicals, chemicalId]
      };
    });
  };

  const handleSubmit = () => {
    if (!gameState.currentReaction || gameState.showFeedback) return;

    // Check if the selection is correct
    const correctProductIds = gameState.currentReaction.products;
    const isCorrect =
      gameState.selectedChemicals.length === correctProductIds.length &&
      correctProductIds.every(id => gameState.selectedChemicals.includes(id));

    // Calculate points based on time remaining, difficulty, and grade
    const timeBonus = Math.floor(gameState.timeRemaining / 5);
    const difficultyBonus = gameState.currentReaction.difficulty * 2;
    const points = isCorrect ? 10 + timeBonus + difficultyBonus - gameState.hintPenalty : 0;

    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      showFeedback: true,
      feedback: isCorrect
        ? `Correct! You identified the right products. +${points} points!`
        : 'Not quite right. Let\'s see the correct products.'
    }));
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

  const handleShowHint = () => {
    setGameState(prev => ({
      ...prev,
      showHint: true,
      hintPenalty: 5 // Penalty for using hint
    }));
  };

  // Calculate XP earned based on score and grade level
  const calculateXpEarned = () => {
    const baseXp = 25; // Base XP for completing the game
    const scoreMultiplier = 0.5; // Multiplier for score
    const gradeMultiplier = grade / 5; // Higher grades earn more XP

    return Math.round(baseXp + (gameState.score * scoreMultiplier * gradeMultiplier));
  };

  // Generate a hint based on the current reaction and grade level
  const generateHint = (): string => {
    if (!gameState.currentReaction) return '';

    const reaction = gameState.currentReaction;

    if (grade <= 6) {
      // Simple hint for younger students
      const productName = chemicals.find(c => c.id === reaction.products[0])?.name;
      return `One of the products contains ${productName?.split(' ')[0]}.`;
    } else if (grade <= 8) {
      // More specific hint for middle grades
      const productTypes = reaction.products.map(id =>
        chemicals.find(c => c.id === id)?.type
      );
      return `Look for ${productTypes.join(' and ')} compounds.`;
    } else {
      // Conceptual hint for higher grades
      if (reaction.reactionType === 'combustion') {
        return 'Combustion reactions with hydrocarbons typically produce carbon dioxide and water.';
      } else if (reaction.reactionType === 'neutralization') {
        return 'Neutralization reactions between acids and bases typically produce water and a salt.';
      } else if (reaction.reactionType === 'decomposition') {
        return 'Decomposition reactions break down complex compounds into simpler ones.';
      } else {
        return `Consider what happens in a ${reaction.reactionType} reaction and what elements must be conserved.`;
      }
    }
  };

  if (gameState.gameCompleted) {
    const xpEarned = calculateXpEarned();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">⚗️ Chemical Reaction Predictor Completed!</h2>
        <div className="text-center">
          <p className="text-xl text-gray-300 mb-4">Your Score:</p>
          <p className="text-4xl font-bold text-purple-400 mb-6">{gameState.score}</p>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((gameState.score / (gameState.totalRounds * 40)) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-gray-400 mb-4">
            {gameState.score >= gameState.totalRounds * 30 ? 'Chemistry Genius! 🏆' :
              gameState.score >= gameState.totalRounds * 20 ? 'Great chemical knowledge! 🌟' :
                gameState.score >= gameState.totalRounds * 10 ? 'Good effort! 👍' : 'Keep learning chemistry! 💪'}
          </p>
          <p className="text-green-400 font-semibold">+ {xpEarned} XP earned!</p>
          <p className="text-gray-300 mt-4 text-sm">
            You've learned how to predict chemical reactions using patterns and rules!
            {grade >= 9 && ' This demonstrates the AI concept of rule-based systems and pattern recognition.'}
          </p>
        </div>
      </motion.div>
    );
  }

  if (!gameState.currentReaction) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Get reactants as Chemical objects
  const reactants = gameState.currentReaction.reactants.map(id =>
    chemicals.find(c => c.id === id)
  ).filter(c => c !== undefined) as Chemical[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Chemical Reaction Predictor</h2>
        <div className="text-right">
          <p className="text-sm text-gray-400">Round {gameState.round + 1} of {gameState.totalRounds}</p>
          <p className="text-lg font-semibold text-purple-400">Score: {gameState.score}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-white text-lg">Predict the products of this reaction</p>
          <div className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
            Time: {gameState.timeRemaining}s
          </div>
        </div>

        {/* Reaction Information */}
        <div className="bg-white/5 p-4 rounded-xl mb-6">
          <h3 className="text-xl font-bold text-white mb-3">{gameState.currentReaction.description}</h3>

          {/* Reaction Type */}
          <div className="mb-4">
            <span className="text-gray-400 text-sm">Reaction Type: </span>
            <span className="text-white">{gameState.currentReaction.reactionType}</span>
            {gameState.currentReaction.conditions && (
              <span className="ml-2 text-yellow-300 text-sm">(Requires: {gameState.currentReaction.conditions})</span>
            )}
          </div>

          {/* Reactants */}
          <div className="mb-4">
            <h4 className="text-white font-semibold mb-2">Reactants:</h4>
            <div className="flex flex-wrap gap-2">
              {reactants.map(reactant => (
                <div
                  key={reactant.id}
                  className="bg-blue-900/50 px-3 py-2 rounded-lg border border-blue-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{reactant.name}</span>
                    <span className="text-blue-300 text-sm">{reactant.formula}</span>
                  </div>
                  {grade >= 7 && (
                    <div className="mt-1 text-xs text-gray-300">
                      <span className="text-gray-400">Type: </span>
                      {reactant.type}
                      {grade >= 9 && (
                        <span className="ml-2">
                          <span className="text-gray-400">State: </span>
                          {reactant.state}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Concept Explanation for higher grades */}
          {grade >= 9 && (
            <div className="mt-3 text-xs text-gray-400 bg-white/5 p-2 rounded-lg">
              <p>AI Concept: Rule-based systems use pattern recognition to predict outcomes based on established rules and patterns.</p>
            </div>
          )}
        </div>

        {/* Product Selection */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3">Select the products of this reaction:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {gameState.availableChemicals.map(chemical => {
              const isSelected = gameState.selectedChemicals.includes(chemical.id);
              const isCorrect = gameState.showFeedback && gameState.currentReaction?.products.includes(chemical.id);
              const isIncorrect = gameState.showFeedback && isSelected && !isCorrect;

              let borderColor = 'border-gray-700';
              if (isSelected && !gameState.showFeedback) borderColor = 'border-blue-500';
              if (isCorrect) borderColor = 'border-green-500';
              if (isIncorrect) borderColor = 'border-red-500';

              return (
                <motion.div
                  key={chemical.id}
                  whileHover={{ scale: gameState.showFeedback ? 1 : 1.02 }}
                  className={`bg-white/5 rounded-lg p-3 border ${borderColor} cursor-pointer transition-colors`}
                  onClick={() => !gameState.showFeedback && handleChemicalSelect(chemical.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-white font-medium">{chemical.name}</h5>
                      <p className="text-purple-300 text-sm">{chemical.formula}</p>
                    </div>
                    {isSelected && !gameState.showFeedback && (
                      <div className="bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                    {isCorrect && (
                      <div className="bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                    {isIncorrect && (
                      <div className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                        ✗
                      </div>
                    )}
                  </div>

                  {/* Show more details based on grade level */}
                  {(grade >= 7 || gameState.showFeedback) && (
                    <div className="mt-2 text-xs">
                      <p className="text-gray-400">
                        <span className="text-gray-500">Type: </span>
                        {chemical.type}
                      </p>
                      {(grade >= 9 || gameState.showFeedback) && (
                        <p className="text-gray-400">
                          <span className="text-gray-500">State: </span>
                          {chemical.state}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Feedback and Next Button */}
        {gameState.showFeedback ? (
          <div className="text-center">
            <p className="text-white mb-4">{gameState.feedback}</p>

            <div className="bg-white/5 p-4 rounded-lg mb-4">
              <h4 className="text-white font-semibold mb-2">Explanation:</h4>
              <p className="text-gray-300 text-sm whitespace-pre-line">{gameState.explanation}</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              onClick={handleNextRound}
            >
              {gameState.round < gameState.totalRounds - 1 ? 'Next Reaction' : 'Finish Game'}
            </motion.button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              onClick={handleSubmit}
              disabled={gameState.selectedChemicals.length === 0}
            >
              Submit Prediction
            </motion.button>

            {!gameState.showHint && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-transparent border border-purple-500 text-purple-400 rounded-lg hover:bg-purple-500/10 transition-colors"
                onClick={handleShowHint}
              >
                Get Hint (-5 points)
              </motion.button>
            )}
          </div>
        )}

        {/* Hint */}
        {gameState.showHint && !gameState.showFeedback && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-yellow-300 text-sm">
              <span className="font-bold">Hint:</span> {generateHint()}
            </p>
          </div>
        )}

        {/* Instructions based on grade level */}
        {!gameState.showFeedback && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-white text-sm">
              {grade <= 6 ? (
                "Select the chemicals that you think will be produced in this reaction."
              ) : grade <= 8 ? (
                "Based on the reaction type and reactants, predict which products will form. Consider the properties of the chemicals involved."
              ) : (
                "Analyze the reaction type, reactants, and conditions to predict the products. Apply chemical principles and conservation of elements."
              )}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChemicalReactionPredictor;