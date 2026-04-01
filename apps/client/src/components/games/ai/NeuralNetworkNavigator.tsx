import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { useProgress } from '../../../contexts/ProgressContext';

interface NeuralNetworkNavigatorProps {
  grade: number;
}

interface NeuralNode {
  id: string;
  layer: number;
  position: number;
  value: number;
  connections: Connection[];
  isActive?: boolean;
}

interface Connection {
  targetId: string;
  weight: number;
  isActive?: boolean;
}

interface Challenge {
  description: string;
  inputValues: number[];
  expectedOutput: number[];
  difficulty: number; // 1-5 scale
  hint?: string;
}

// Generate a neural network based on grade level
const generateNeuralNetwork = (grade: number): NeuralNode[] => {
  const nodes: NeuralNode[] = [];

  // Determine network complexity based on grade
  let inputNodes = 2;
  let hiddenLayers = 1;
  let nodesPerHiddenLayer = 2;
  let outputNodes = 1;

  if (grade >= 7) {
    inputNodes = 3;
    nodesPerHiddenLayer = 3;
  }

  if (grade >= 9) {
    hiddenLayers = 2;
    outputNodes = 2;
  }

  // Create input layer nodes
  for (let i = 0; i < inputNodes; i++) {
    nodes.push({
      id: `input-${i}`,
      layer: 0,
      position: i,
      value: 0,
      connections: []
    });
  }

  // Create hidden layer nodes
  for (let layer = 0; layer < hiddenLayers; layer++) {
    for (let i = 0; i < nodesPerHiddenLayer; i++) {
      nodes.push({
        id: `hidden-${layer}-${i}`,
        layer: layer + 1,
        position: i,
        value: 0,
        connections: []
      });
    }
  }

  // Create output layer nodes
  for (let i = 0; i < outputNodes; i++) {
    nodes.push({
      id: `output-${i}`,
      layer: hiddenLayers + 1,
      position: i,
      value: 0,
      connections: []
    });
  }

  // Connect the nodes
  // For each layer except the output layer
  for (let layer = 0; layer < hiddenLayers + 1; layer++) {
    // Get nodes in current layer
    const currentLayerNodes = nodes.filter(node => node.layer === layer);
    // Get nodes in next layer
    const nextLayerNodes = nodes.filter(node => node.layer === layer + 1);

    // Connect each node in current layer to each node in next layer
    currentLayerNodes.forEach(currentNode => {
      nextLayerNodes.forEach(nextNode => {
        // Generate a random weight between -1 and 1
        const weight = Math.round((Math.random() * 2 - 1) * 10) / 10;

        currentNode.connections.push({
          targetId: nextNode.id,
          weight,
          isActive: false
        });
      });
    });
  }

  return nodes;
};

// Generate challenges based on grade level
const generateChallenges = (grade: number, network: NeuralNode[]): Challenge[] => {
  const challenges: Challenge[] = [];

  // Determine input and output sizes
  const inputNodes = network.filter(node => node.id.startsWith('input-')).length;
  const outputNodes = network.filter(node => node.id.startsWith('output-')).length;

  // Basic challenges for younger students (Class 5-6)
  if (grade <= 6) {
    challenges.push(
      {
        description: "Make the network recognize when both inputs are 1",
        inputValues: [1, 1],
        expectedOutput: [1],
        difficulty: 1,
        hint: "Try activating connections with positive weights from both input nodes."
      },
      {
        description: "Make the network recognize when the first input is 1",
        inputValues: [1, 0],
        expectedOutput: [1],
        difficulty: 2,
        hint: "Focus on connections from the first input node with positive weights."
      }
    );
  }

  // Intermediate challenges for middle grades (Class 7-8)
  if (grade >= 7 && grade <= 8) {
    challenges.push(
      {
        description: "Create an AND gate: output 1 only when all inputs are 1",
        inputValues: [1, 1, 1],
        expectedOutput: [1],
        difficulty: 3,
        hint: "You need to activate connections with positive weights from all input nodes."
      },
      {
        description: "Create an OR gate: output 1 when any input is 1",
        inputValues: [0, 1, 0],
        expectedOutput: [1],
        difficulty: 3,
        hint: "Activate connections with strong positive weights from each input node."
      }
    );
  }

  // Advanced challenges for older students (Class 9-10)
  if (grade >= 9) {
    challenges.push(
      {
        description: "Create an XOR gate: output 1 when exactly one input is 1",
        inputValues: [0, 1, 0],
        expectedOutput: [1, 0],
        difficulty: 4,
        hint: "XOR requires both hidden layers. Create paths that activate for single inputs but inhibit for multiple inputs."
      },
      {
        description: "Create a pattern detector: output [1,0] for this specific pattern",
        inputValues: [1, 0, 1],
        expectedOutput: [1, 0],
        difficulty: 5,
        hint: "Use the first hidden layer to detect parts of the pattern, and the second layer to combine these detections."
      }
    );
  }

  return challenges;
};

// Calculate node values based on active connections
const calculateNodeValues = (nodes: NeuralNode[]): NeuralNode[] => {
  const updatedNodes = [...nodes];

  // Process each layer starting from input (layer 0)
  const maxLayer = Math.max(...nodes.map(node => node.layer));

  for (let layer = 1; layer <= maxLayer; layer++) {
    // Get nodes in current layer
    const currentLayerNodes = updatedNodes.filter(node => node.layer === layer);

    // Calculate value for each node in current layer
    currentLayerNodes.forEach(node => {
      let sum = 0;

      // Find all nodes that connect to this node
      const previousLayerNodes = updatedNodes.filter(n => n.layer === layer - 1);

      previousLayerNodes.forEach(prevNode => {
        // Find connection from previous node to current node
        const connection = prevNode.connections.find(conn => conn.targetId === node.id);

        if (connection && connection.isActive) {
          sum += prevNode.value * connection.weight;
        }
      });

      // Apply activation function (simplified ReLU)
      const nodeIndex = updatedNodes.findIndex(n => n.id === node.id);
      updatedNodes[nodeIndex].value = sum > 0 ? sum : 0;
      updatedNodes[nodeIndex].isActive = sum > 0;
    });
  }

  return updatedNodes;
};

const NeuralNetworkNavigator: React.FC<NeuralNetworkNavigatorProps> = ({ grade }) => {
  const [network, setNetwork] = useState<NeuralNode[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes per challenge
  const [showHint, setShowHint] = useState(false);
  const [hintPenalty, setHintPenalty] = useState(0);

  const { currentUser } = useAuth();
  const { recordActivity } = useProgress();

  // Initialize network and challenges based on grade
  useEffect(() => {
    const generatedNetwork = generateNeuralNetwork(grade);
    setNetwork(generatedNetwork);

    const generatedChallenges = generateChallenges(grade, generatedNetwork);
    setChallenges(generatedChallenges);

    // Set initial input values
    if (generatedChallenges.length > 0) {
      updateInputValues(generatedChallenges[0].inputValues);
    }
  }, [grade]);

  // Timer effect
  useEffect(() => {
    if (gameCompleted || challenges.length === 0 || showFeedback) return;

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
  }, [gameCompleted, challenges.length, showFeedback]);

  // Update input node values
  const updateInputValues = (inputValues: number[]) => {
    setNetwork(prevNetwork => {
      const updatedNetwork = [...prevNetwork];

      // Update input node values
      const inputNodes = updatedNetwork.filter(node => node.id.startsWith('input-'));
      inputNodes.forEach((node, index) => {
        if (index < inputValues.length) {
          const nodeIndex = updatedNetwork.findIndex(n => n.id === node.id);
          updatedNetwork[nodeIndex].value = inputValues[index];
          updatedNetwork[nodeIndex].isActive = inputValues[index] > 0;
        }
      });

      return calculateNodeValues(updatedNetwork);
    });
  };

  // Toggle connection activation
  const toggleConnection = (sourceNodeId: string, targetNodeId: string) => {
    setNetwork(prevNetwork => {
      const updatedNetwork = [...prevNetwork];

      // Find the source node
      const sourceNodeIndex = updatedNetwork.findIndex(node => node.id === sourceNodeId);
      if (sourceNodeIndex === -1) return prevNetwork;

      // Find the connection
      const connectionIndex = updatedNetwork[sourceNodeIndex].connections.findIndex(
        conn => conn.targetId === targetNodeId
      );
      if (connectionIndex === -1) return prevNetwork;

      // Toggle the connection
      updatedNetwork[sourceNodeIndex].connections[connectionIndex].isActive =
        !updatedNetwork[sourceNodeIndex].connections[connectionIndex].isActive;

      return calculateNodeValues(updatedNetwork);
    });
  };

  const handleSubmit = () => {
    if (challenges.length === 0) return;

    const currentChallenge = challenges[currentChallengeIndex];
    const outputNodes = network.filter(node => node.id.startsWith('output-'));
    const outputValues = outputNodes.map(node => node.value > 0.5 ? 1 : 0);

    // Check if output matches expected output
    const isCorrect = outputValues.every((value, index) =>
      value === currentChallenge.expectedOutput[index]
    );

    // Calculate score
    const challengeScore = isCorrect ? 20 + (currentChallenge.difficulty * 5) - hintPenalty : 0;
    const timeBonus = Math.floor(timeRemaining / 20);

    setScore(score + challengeScore + timeBonus);
    setShowFeedback(true);
    setTimeRemaining(0);
  };

  const handleNextChallenge = () => {
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
      setShowFeedback(false);
      setTimeRemaining(120); // Reset timer
      setShowHint(false);
      setHintPenalty(0);

      // Reset network connections
      setNetwork(prevNetwork => {
        const resetNetwork = prevNetwork.map(node => ({
          ...node,
          connections: node.connections.map(conn => ({
            ...conn,
            isActive: false
          }))
        }));

        // Set new input values
        const nextChallenge = challenges[currentChallengeIndex + 1];
        const inputNodes = resetNetwork.filter(node => node.id.startsWith('input-'));
        inputNodes.forEach((node, index) => {
          if (index < nextChallenge.inputValues.length) {
            const nodeIndex = resetNetwork.findIndex(n => n.id === node.id);
            resetNetwork[nodeIndex].value = nextChallenge.inputValues[index];
            resetNetwork[nodeIndex].isActive = nextChallenge.inputValues[index] > 0;
          }
        });

        return calculateNodeValues(resetNetwork);
      });
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
    setHintPenalty(10); // Penalty for using hint
  };

  // Calculate XP earned based on score and grade level
  const calculateXpEarned = () => {
    const baseXp = 25; // Base XP for completing the game
    const scoreXp = score / 2; // XP from score
    const gradeMultiplier = grade / 5; // Higher grades earn more XP

    return Math.round(baseXp + (scoreXp * gradeMultiplier));
  };

  // Render neural network visualization
  const renderNetwork = () => {
    if (network.length === 0) return null;

    // Group nodes by layer
    const nodesByLayer: Record<number, NeuralNode[]> = {};
    network.forEach(node => {
      if (!nodesByLayer[node.layer]) {
        nodesByLayer[node.layer] = [];
      }
      nodesByLayer[node.layer].push(node);
    });

    // Sort layers
    const layers = Object.keys(nodesByLayer).map(Number).sort((a, b) => a - b);

    return (
      <div className="relative w-full h-[300px] bg-white/5 rounded-xl p-4 mb-6">
        {/* Render connections first so they appear behind nodes */}
        {network.map(node => (
          node.connections.map((conn, connIndex) => {
            const targetNode = network.find(n => n.id === conn.targetId);
            if (!targetNode) return null;

            // Calculate positions
            const sourceLayer = node.layer;
            const targetLayer = targetNode.layer;
            const sourcePosInLayer = nodesByLayer[sourceLayer].findIndex(n => n.id === node.id);
            const targetPosInLayer = nodesByLayer[targetLayer].findIndex(n => n.id === targetNode.id);

            const sourceLayerWidth = nodesByLayer[sourceLayer].length;
            const targetLayerWidth = nodesByLayer[targetLayer].length;

            const sourceX = (sourcePosInLayer + 1) * (100 / (sourceLayerWidth + 1));
            const targetX = (targetPosInLayer + 1) * (100 / (targetLayerWidth + 1));
            const sourceY = (sourceLayer + 1) * (100 / (layers.length + 1));
            const targetY = (targetLayer + 1) * (100 / (layers.length + 1));

            // Determine connection color based on weight and activation
            let strokeColor = conn.weight > 0 ? 'rgba(74, 222, 128, ' : 'rgba(248, 113, 113, ';
            strokeColor += conn.isActive ? '0.8)' : '0.2)';

            return (
              <svg
                key={`${node.id}-${conn.targetId}-${connIndex}`}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              >
                <line
                  x1={`${sourceX}%`}
                  y1={`${sourceY}%`}
                  x2={`${targetX}%`}
                  y2={`${targetY}%`}
                  stroke={strokeColor}
                  strokeWidth={Math.abs(conn.weight) * 3 + 1}
                  strokeOpacity={conn.isActive ? 1 : 0.5}
                />
              </svg>
            );
          })
        ))}

        {/* Render nodes */}
        {layers.map(layer => (
          <div
            key={`layer-${layer}`}
            className="absolute flex justify-around w-full"
            style={{ top: `${(layer + 1) * (100 / (layers.length + 1))}%`, transform: 'translateY(-50%)' }}
          >
            {nodesByLayer[layer].map(node => {
              const nodeSize = node.isActive ? 'w-12 h-12' : 'w-10 h-10';
              const nodeColor = node.id.startsWith('input-') ? 'bg-blue-500' :
                node.id.startsWith('output-') ? 'bg-purple-500' : 'bg-indigo-500';
              const nodeOpacity = node.isActive ? '' : 'opacity-50';

              return (
                <div
                  key={node.id}
                  className={`relative ${nodeSize} ${nodeColor} ${nodeOpacity} rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer`}
                  onClick={() => {
                    // For non-input nodes, we don't allow direct toggling
                    if (!node.id.startsWith('input-')) return;
                  }}
                >
                  <span className="text-white font-bold">
                    {node.value.toFixed(1)}
                  </span>

                  {/* Connection toggle buttons */}
                  {node.connections.map(conn => {
                    const targetNode = network.find(n => n.id === conn.targetId);
                    if (!targetNode) return null;

                    // Calculate position for the toggle button
                    const targetLayer = targetNode.layer;
                    const targetPosInLayer = nodesByLayer[targetLayer].findIndex(n => n.id === targetNode.id);
                    const targetLayerWidth = nodesByLayer[targetLayer].length;
                    const targetX = (targetPosInLayer + 1) * (100 / (targetLayerWidth + 1));

                    // Position the button along the connection line
                    const buttonX = targetX - (targetX - 50) * 0.5;

                    return (
                      <button
                        key={`toggle-${node.id}-${conn.targetId}`}
                        className={`absolute w-5 h-5 rounded-full border-2 ${conn.isActive ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'} flex items-center justify-center text-xs text-white`}
                        style={{
                          left: `${buttonX}%`,
                          top: '50%',
                          transform: 'translate(-50%, 20px)'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleConnection(node.id, conn.targetId);
                        }}
                      >
                        {conn.isActive ? '✓' : '×'}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}

        {/* Layer labels */}
        <div className="absolute bottom-2 left-0 w-full flex justify-around text-xs text-gray-400">
          {layers.map(layer => (
            <div key={`label-${layer}`}>
              {layer === 0 ? 'Input' : layer === layers.length - 1 ? 'Output' : `Hidden ${layer}`}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (network.length === 0 || challenges.length === 0) {
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
        <h2 className="text-3xl font-bold text-white mb-6 text-center">🧠 Neural Network Navigator Completed!</h2>
        <div className="text-center">
          <p className="text-xl text-gray-300 mb-4">Your Score:</p>
          <p className="text-4xl font-bold text-purple-400 mb-6">{score}</p>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((score / (challenges.length * 40)) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-gray-400 mb-4">
            {score >= challenges.length * 30 ? 'Neural Network Master! 🏆' :
              score >= challenges.length * 20 ? 'Great neural architect! 🌟' :
                score >= challenges.length * 10 ? 'Good effort! 👍' : 'Keep practicing! 💪'}
          </p>
          <p className="text-green-400 font-semibold">+ {xpEarned} XP earned!</p>
          <p className="text-gray-300 mt-4 text-sm">
            You've learned how neural networks process information through layers of nodes and weighted connections!
          </p>
        </div>
      </motion.div>
    );
  }

  const currentChallenge = challenges[currentChallengeIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Neural Network Navigator</h2>
        <div className="text-right">
          <p className="text-sm text-gray-400">Challenge {currentChallengeIndex + 1} of {challenges.length}</p>
          <p className="text-lg font-semibold text-purple-400">Score: {score}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <p className="text-white text-lg">{currentChallenge.description}</p>
          <div className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
            Time: {timeRemaining}s
          </div>
        </div>

        {/* Neural Network Visualization */}
        {renderNetwork()}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Input Values */}
          <div className="bg-white/5 p-4 rounded-xl">
            <h3 className="text-white font-semibold mb-3">Input Values</h3>
            <div className="flex flex-wrap gap-3">
              {currentChallenge.inputValues.map((value, index) => (
                <div key={index} className="bg-white/10 p-3 rounded-lg text-center">
                  <p className="text-gray-400 text-xs mb-1">Input {index + 1}</p>
                  <p className="text-white font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Expected Output */}
          <div className="bg-white/5 p-4 rounded-xl">
            <h3 className="text-white font-semibold mb-3">Expected Output</h3>
            <div className="flex flex-wrap gap-3">
              {currentChallenge.expectedOutput.map((value, index) => (
                <div key={index} className="bg-white/10 p-3 rounded-lg text-center">
                  <p className="text-gray-400 text-xs mb-1">Output {index + 1}</p>
                  <p className="text-white font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl mb-6">
          <h3 className="text-white font-semibold mb-3">Instructions</h3>
          <p className="text-gray-300 text-sm">
            {grade <= 6 ? (
              "Click the connection buttons to activate or deactivate connections between nodes. Try to make the output match the expected value."
            ) : grade <= 8 ? (
              "Activate connections to create a path from inputs to outputs. Positive weights (green) increase values, negative weights (red) decrease them."
            ) : (
              "Design a neural network by activating specific connections. Consider how multiple layers can work together to solve complex patterns."
            )}
          </p>
        </div>

        {showFeedback ? (
          <div className="text-center mb-4">
            <div className="p-4 rounded-lg mb-4 bg-white/5">
              <p className="text-white mb-2">
                {(() => {
                  const outputNodes = network.filter(node => node.id.startsWith('output-'));
                  const outputValues = outputNodes.map(node => node.value > 0.5 ? 1 : 0);
                  const isCorrect = outputValues.every((value, index) =>
                    value === currentChallenge.expectedOutput[index]
                  );

                  return isCorrect ?
                    '✓ Success! Your neural network produced the correct output.' :
                    '✗ Not quite. Your network output doesn\'t match the expected values.';
                })()}
              </p>
              <div className="flex justify-center gap-4 mt-3">
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Your Output</p>
                  <div className="flex gap-2 justify-center">
                    {network
                      .filter(node => node.id.startsWith('output-'))
                      .map((node, index) => (
                        <p key={index} className="text-white font-semibold">
                          {node.value > 0.5 ? 1 : 0}
                        </p>
                      ))}
                  </div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Expected</p>
                  <div className="flex gap-2 justify-center">
                    {currentChallenge.expectedOutput.map((value, index) => (
                      <p key={index} className="text-white font-semibold">{value}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              onClick={handleNextChallenge}
            >
              {currentChallengeIndex < challenges.length - 1 ? 'Next Challenge' : 'Finish Game'}
            </motion.button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              onClick={handleSubmit}
            >
              Test Network
            </motion.button>

            {currentChallenge.hint && !showHint && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-transparent border border-purple-500 text-purple-400 rounded-full hover:bg-purple-500/10 transition-colors"
                onClick={handleShowHint}
              >
                Get Hint (-10 points)
              </motion.button>
            )}
          </div>
        )}

        {showHint && currentChallenge.hint && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-yellow-300 text-sm">
              <span className="font-bold">Hint:</span> {currentChallenge.hint}
            </p>
          </div>
        )}

        {grade >= 9 && !showFeedback && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-white text-sm mb-2">Neural Network Concepts:</p>
            <ul className="text-gray-300 text-xs list-disc pl-4">
              <li>Nodes in each layer process information from the previous layer</li>
              <li>Connections with positive weights increase values, negative weights decrease them</li>
              <li>Multiple layers allow the network to learn complex patterns</li>
              <li>The final output is determined by the combined effect of all active connections</li>
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NeuralNetworkNavigator;