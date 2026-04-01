import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, Legend } from 'recharts';
import { Brain, Lightbulb, Target, TrendingUp, Eye, Zap, Award, RefreshCw } from 'lucide-react';

const FruitClassifierGame = () => {
  const [selectedFruit, setSelectedFruit] = useState(null);
  const [gameMode, setGameMode] = useState('explore');
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [showHint, setShowHint] = useState(false);

  const fruits = [
    { name: 'Apple', color: 'Red', shape: 'Round', size: 'Medium', colorCode: '#FF4444' },
    { name: 'Banana', color: 'Yellow', shape: 'Long', size: 'Medium', colorCode: '#FFD700' },
    { name: 'Grapes', color: 'Green', shape: 'Round', size: 'Small', colorCode: '#90EE90' },
    { name: 'Mango', color: 'Yellow', shape: 'Oval', size: 'Medium', colorCode: '#FFA500' },
    { name: 'Watermelon', color: 'Green', shape: 'Round', size: 'Large', colorCode: '#228B22' },
    { name: 'Lemon', color: 'Yellow', shape: 'Small', size: 'Sour', colorCode: '#FFFF00' },
    { name: 'Strawberry', color: 'Red', shape: 'Heart', size: 'Small', colorCode: '#FF1493' },
    { name: 'Pineapple', color: 'yellow', shape: 'Oval', size: 'Large', colorCode: '#DAA520' },
    { name: 'Lime', color: 'Green', shape: 'Small', size: 'Sour', colorCode: '#32CD32' },
    { name: 'Pear', color: 'Green', shape: 'Oval', size: 'Medium', colorCode: '#9ACD32' }
  ];

  const getFeatureAnalysis = (fruit) => {
    const colorAnalysis = fruits.filter(f => f.color.toLowerCase() === fruit.color.toLowerCase());
    const shapeAnalysis = fruits.filter(f => f.shape.toLowerCase() === fruit.shape.toLowerCase());
    const sizeAnalysis = fruits.filter(f => f.size.toLowerCase() === fruit.size.toLowerCase());

    return {
      color: {
        matches: colorAnalysis.length,
        fruits: colorAnalysis.map(f => f.name),
        confidence: (colorAnalysis.length / fruits.length) * 100
      },
      shape: {
        matches: shapeAnalysis.length,
        fruits: shapeAnalysis.map(f => f.name),
        confidence: (shapeAnalysis.length / fruits.length) * 100
      },
      size: {
        matches: sizeAnalysis.length,
        fruits: sizeAnalysis.map(f => f.name),
        confidence: (sizeAnalysis.length / fruits.length) * 100
      }
    };
  };

  const getDecisionPath = (fruit) => {
    const analysis = getFeatureAnalysis(fruit);
    const steps = [
      {
        step: 1,
        title: "Color Detection",
        description: `AI sees ${fruit.color.toLowerCase()} color`,
        confidence: analysis.color.confidence,
        matches: analysis.color.matches,
        icon: <Eye className="w-5 h-5" />
      },
      {
        step: 2,
        title: "Shape Analysis",
        description: `AI identifies ${fruit.shape.toLowerCase()} shape`,
        confidence: analysis.shape.confidence,
        matches: analysis.shape.matches,
        icon: <Target className="w-5 h-5" />
      },
      {
        step: 3,
        title: "Size Measurement",
        description: `AI measures ${fruit.size.toLowerCase()} size`,
        confidence: analysis.size.confidence,
        matches: analysis.size.matches,
        icon: <TrendingUp className="w-5 h-5" />
      },
      {
        step: 4,
        title: "Final Decision",
        description: `AI combines all features to identify: ${fruit.name}`,
        confidence: 85 + Math.random() * 10,
        matches: 1,
        icon: <Brain className="w-5 h-5" />
      }
    ];
    return steps;
  };

  const getVisualizationData = () => {
    const colorCounts = {};
    const shapeCounts = {};
    const sizeCounts = {};

    fruits.forEach(fruit => {
      colorCounts[fruit.color] = (colorCounts[fruit.color] || 0) + 1;
      shapeCounts[fruit.shape] = (shapeCounts[fruit.shape] || 0) + 1;
      sizeCounts[fruit.size] = (sizeCounts[fruit.size] || 0) + 1;
    });

    return {
      colors: Object.entries(colorCounts).map(([color, count]) => ({ name: color, value: count })),
      shapes: Object.entries(shapeCounts).map(([shape, count]) => ({ name: shape, value: count })),
      sizes: Object.entries(sizeCounts).map(([size, count]) => ({ name: size, value: count }))
    };
  };

  const handleGuess = (guess) => {
    if (guess.toLowerCase() === selectedFruit.name.toLowerCase()) {
      setScore(score + 10);
      setShowExplanation(true);
    } else {
      setShowHint(true);
    }
  };

  const nextRound = () => {
    const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
    setSelectedFruit(randomFruit);
    setUserGuess('');
    setShowExplanation(false);
    setShowHint(false);
    setCurrentStep(0);
  };

  const vizData = getVisualizationData();
  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-2 flex items-center justify-center gap-2">
            <Brain className="w-8 h-8" />
            AI Fruit Detective
          </h1>
          <p className="text-gray-600">Learn how AI thinks by exploring fruit classification!</p>
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
              Game Mode
            </button>
          </div>
          {gameMode === 'game' && (
            <div className="mt-4 text-xl font-bold text-purple-700">
              Score: {score} points
            </div>
          )}
        </div>

        {gameMode === 'explore' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fruit Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6" />
                Choose a Fruit to Analyze
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {fruits.map((fruit, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFruit(fruit)}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedFruit?.name === fruit.name
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 bg-gray-50 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-center">
                      <div 
                        className="w-8 h-8 rounded-full mx-auto mb-2 border-2 border-gray-300"
                        style={{ backgroundColor: fruit.colorCode }}
                      ></div>
                      <div className="font-semibold text-gray-800">{fruit.name}</div>
                      <div className="text-sm text-gray-500">
                        {fruit.color} • {fruit.shape} • {fruit.size}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Analysis */}
            {selectedFruit && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  How AI Thinks About {selectedFruit.name}
                </h2>
                
                <div className="space-y-4">
                  {getDecisionPath(selectedFruit).map((step, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-purple-600">{step.icon}</div>
                        <h3 className="font-semibold text-gray-800">{step.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-2">{step.description}</p>
                      <div className="flex items-center gap-2">
                        <div className="bg-purple-200 rounded-full px-3 py-1 text-sm font-medium">
                          {step.confidence.toFixed(1)}% confidence
                        </div>
                        <div className="bg-blue-200 rounded-full px-3 py-1 text-sm font-medium">
                          {step.matches} matches found
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feature Analysis Chart */}
            {selectedFruit && (
              <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart className="w-6 h-6 text-green-600" />
                  Feature Analysis for {selectedFruit.name}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(getFeatureAnalysis(selectedFruit)).map(([feature, data]) => (
                    <div key={feature} className="text-center">
                      <h3 className="font-semibold text-gray-700 mb-2 capitalize">{feature}</h3>
                      <div className="bg-gray-100 rounded-lg p-4">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {data.matches}
                        </div>
                        <div className="text-sm text-gray-600">
                          fruits with same {feature}
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {data.fruits.join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {gameMode === 'game' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Detective Challenge!</h2>
                <p className="text-gray-600">Can you guess what fruit the AI is thinking of?</p>
              </div>

              {!selectedFruit ? (
                <div className="text-center">
                  <button
                    onClick={nextRound}
                    className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Start Game
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Clues */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      AI's Clues:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-700">Color</div>
                        <div 
                          className="w-12 h-12 rounded-full mx-auto mt-2 border-2 border-gray-300"
                          style={{ backgroundColor: selectedFruit.colorCode }}
                        ></div>
                        <div className="text-sm text-gray-600 mt-1">{selectedFruit.color}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-700">Shape</div>
                        <div className="text-2xl mt-2">{selectedFruit.shape}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-700">Size</div>
                        <div className="text-2xl mt-2">{selectedFruit.size}</div>
                      </div>
                    </div>
                  </div>

                  {/* Guess Input */}
                  <div className="text-center">
                    <input
                      type="text"
                      value={userGuess}
                      onChange={(e) => setUserGuess(e.target.value)}
                      placeholder="What fruit is it?"
                      className="border-2 border-gray-300 rounded-lg px-4 py-2 text-lg mr-4 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={() => handleGuess(userGuess)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Guess!
                    </button>
                  </div>

                  {/* Hints */}
                  {showHint && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                      <p className="text-yellow-800">
                        <strong>Hint:</strong> Think about fruits that are {selectedFruit.color.toLowerCase()}, {selectedFruit.shape.toLowerCase()}, and {selectedFruit.size.toLowerCase()}!
                      </p>
                    </div>
                  )}

                  {/* Explanation */}
                  {showExplanation && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="text-center mb-4">
                        <div className="text-green-600 text-6xl mb-2">🎉</div>
                        <h3 className="text-2xl font-bold text-green-800">Correct! It's a {selectedFruit.name}!</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-700 mb-2">AI's Reasoning:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Color: {selectedFruit.color} ({getFeatureAnalysis(selectedFruit).color.matches} matches)</li>
                            <li>• Shape: {selectedFruit.shape} ({getFeatureAnalysis(selectedFruit).shape.matches} matches)</li>
                            <li>• Size: {selectedFruit.size} ({getFeatureAnalysis(selectedFruit).size.matches} matches)</li>
                          </ul>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-700 mb-2">Similar Fruits:</h4>
                          <div className="text-sm text-gray-600">
                            {fruits.filter(f => 
                              f.color.toLowerCase() === selectedFruit.color.toLowerCase() && 
                              f.name !== selectedFruit.name
                            ).map(f => f.name).join(', ') || 'None with same color'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <button
                          onClick={nextRound}
                          className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                        >
                          Next Round
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
            Dataset Overview - How AI Learns Patterns
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Color Distribution */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Color Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={vizData.colors}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {vizData.colors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Shape Distribution */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Shape Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={vizData.shapes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Size Distribution */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Size Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={vizData.sizes}>
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
            How AI Really Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">🧠 Pattern Recognition</h3>
              <p className="text-purple-100">
                AI looks for patterns in data, just like how you learn to recognize different fruits by their features!
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🔍 Feature Analysis</h3>
              <p className="text-purple-100">
                AI breaks down complex things into simple features like color, shape, and size to make decisions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">📊 Confidence Scores</h3>
              <p className="text-purple-100">
                AI gives confidence scores to show how sure it is about its predictions, just like you might be more or less sure about an answer.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🎯 Learning from Examples</h3>
              <p className="text-purple-100">
                The more examples AI sees, the better it gets at making predictions - just like how practice makes perfect!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FruitClassifierGame;
