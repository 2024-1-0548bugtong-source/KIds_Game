import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CrosswordPuzzleProps {
  grade: number;
}

// For demo: Each grade has a single word to fill horizontally
const puzzlesByGrade: Record<number, { word: string; clue: string }> = {
  5: { word: 'DOG', clue: 'A common pet that barks' },
  6: { word: 'MOON', clue: 'Earth\'s natural satellite' },
  7: { word: 'ATOM', clue: 'Smallest unit of matter' },
  8: { word: 'ASIA', clue: 'Largest continent' },
  9: { word: 'CELL', clue: 'Basic unit of life' },
  10: { word: 'FORCE', clue: 'Push or pull on an object' },
};

const CrosswordPuzzle: React.FC<CrosswordPuzzleProps> = ({ grade }) => {
  const puzzle = puzzlesByGrade[grade] || puzzlesByGrade[5];
  const [input, setInput] = useState(Array(puzzle.word.length).fill(''));
  const [showFeedback, setShowFeedback] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleChange = (idx: number, val: string) => {
    if (showFeedback) return;
    const up = [...input];
    up[idx] = val.toUpperCase().slice(0, 1);
    setInput(up);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showFeedback) return;
    const answer = input.join('');
    const isCorrect = answer === puzzle.word;
    setCorrect(isCorrect);
    setShowFeedback(true);
  };

  const handleReset = () => {
    setInput(Array(puzzle.word.length).fill(''));
    setShowFeedback(false);
    setCorrect(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Crossword Puzzle</h2>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-white/5 rounded-xl p-6 border border-white/20 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Clue:</h3>
          <p className="text-gray-300 text-lg leading-relaxed">{puzzle.clue}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-2 mb-6">
            {input.map((val, idx) => (
              <input
                key={idx}
                type="text"
                className="w-12 h-12 text-center border-2 border-white/20 rounded-lg bg-white/5 text-white text-xl font-bold focus:outline-none focus:border-purple-500 transition-all duration-200"
                value={val}
                onChange={e => handleChange(idx, e.target.value)}
                disabled={showFeedback}
                maxLength={1}
                autoFocus={idx === 0}
              />
            ))}
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={showFeedback || input.some(v => v === '')}
          >
            Submit Answer
          </motion.button>
        </form>
      </motion.div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-white/5 border border-white/20"
        >
          {correct ? (
            <div className="flex items-center justify-center text-green-400">
              <span className="text-2xl mr-2">✅</span>
              <span className="font-semibold text-lg">Correct!</span>
            </div>
          ) : (
            <div className="flex items-center justify-center text-red-400">
              <span className="text-2xl mr-2">❌</span>
              <span className="font-semibold text-lg">Incorrect. The answer is "{puzzle.word}".</span>
            </div>
          )}
        </motion.div>
      )}

      {showFeedback && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          onClick={handleReset}
        >
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default CrosswordPuzzle; 