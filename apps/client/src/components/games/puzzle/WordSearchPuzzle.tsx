import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface WordSearchPuzzleProps {
  grade: number;
}

const wordsByGrade: Record<number, { grid: string[][]; words: string[] }> = {
  5: {
    grid: [
      ['C', 'A', 'T', 'D'],
      ['O', 'G', 'B', 'I'],
      ['P', 'I', 'G', 'R'],
      ['E', 'L', 'E', 'F'],
    ],
    words: ['CAT', 'DOG', 'PIG'],
  },
  6: {
    grid: [
      ['S', 'U', 'N', 'M'],
      ['O', 'O', 'N', 'A'],
      ['E', 'A', 'R', 'T'],
      ['H', 'M', 'A', 'R'],
    ],
    words: ['SUN', 'MOON', 'EARTH', 'MARS'],
  },
  7: {
    grid: [
      ['A', 'T', 'O', 'M'],
      ['M', 'O', 'L', 'E'],
      ['C', 'E', 'L', 'L'],
      ['G', 'E', 'N', 'E'],
    ],
    words: ['ATOM', 'CELL', 'GENE'],
  },
  8: {
    grid: [
      ['A', 'S', 'I', 'A'],
      ['E', 'U', 'R', 'O'],
      ['A', 'F', 'R', 'I'],
      ['C', 'A', 'U', 'S'],
    ],
    words: ['ASIA', 'EURO', 'AFRI'],
  },
  9: {
    grid: [
      ['C', 'E', 'L', 'L'],
      ['B', 'O', 'N', 'E'],
      ['T', 'I', 'S', 'S'],
      ['U', 'E', 'S', 'K'],
    ],
    words: ['CELL', 'BONE', 'TISSUE'],
  },
  10: {
    grid: [
      ['F', 'O', 'R', 'C'],
      ['E', 'E', 'N', 'E'],
      ['R', 'G', 'Y', 'S'],
      ['I', 'T', 'Y', 'A'],
    ],
    words: ['FORCE', 'ENERGY', 'GRAVITY'],
  },
};

const WordSearchPuzzle: React.FC<WordSearchPuzzleProps> = ({ grade }) => {
  const puzzle = wordsByGrade[grade] || wordsByGrade[5];
  const [found, setFound] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const word = input.trim().toUpperCase();
    if (word && puzzle.words.includes(word) && !found.includes(word)) {
      setFound([...found, word]);
    }
    setInput('');
    if (found.length + 1 === puzzle.words.length) {
      setShowFeedback(true);
      setFinished(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Word Search</h2>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-white/5 rounded-xl p-6 border border-white/20 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Find these words:</h3>
          <div className="flex flex-wrap gap-2">
            {puzzle.words.map((word, idx) => (
              <span 
                key={idx} 
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  found.includes(word) 
                    ? 'bg-green-500/20 text-green-300 border border-green-500' 
                    : 'bg-white/10 text-white border border-white/20'
                }`}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1 mb-6 max-w-xs mx-auto">
          {puzzle.grid.map((row, i) =>
            row.map((cell, j) => (
              <div key={`${i}-${j}`} className="w-12 h-12 flex items-center justify-center border border-white/20 rounded bg-white/5 text-white text-lg font-bold">
                {cell}
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              className="w-full py-4 px-6 bg-white/5 border-2 border-white/20 rounded-xl text-white text-lg placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-200"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={finished}
              placeholder="Type a word you found..."
              autoFocus
            />
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={finished || input.trim() === ''}
          >
            Submit Word
          </motion.button>
        </form>

        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/20">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Found Words:</h4>
          <div className="flex flex-wrap gap-2">
            {found.length > 0 ? (
              found.map((word, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full text-sm font-semibold bg-green-500/20 text-green-300 border border-green-500">
                  {word}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">No words found yet...</span>
            )}
          </div>
        </div>
      </motion.div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-green-500/20 border border-green-500 text-center"
        >
          <div className="text-green-400 font-semibold text-lg">
            🎉 All words found! Well done!
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WordSearchPuzzle; 