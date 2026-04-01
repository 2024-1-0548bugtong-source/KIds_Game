import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SudokuPuzzleProps {
  grade: number;
}

// For demo: Each grade has a simple 4x4 sudoku puzzle
const puzzlesByGrade: Record<number, { puzzle: number[][]; solution: number[][] }> = {
  5: {
    puzzle: [
      [1, 0, 0, 4],
      [0, 0, 2, 0],
      [0, 3, 0, 0],
      [2, 0, 0, 1],
    ],
    solution: [
      [1, 2, 3, 4],
      [3, 4, 2, 1],
      [4, 3, 1, 2],
      [2, 1, 4, 3],
    ],
  },
  6: {
    puzzle: [
      [0, 2, 0, 1],
      [1, 0, 0, 0],
      [0, 0, 0, 2],
      [4, 0, 3, 0],
    ],
    solution: [
      [3, 2, 4, 1],
      [1, 4, 2, 3],
      [2, 3, 1, 2],
      [4, 1, 3, 2],
    ],
  },
  7: {
    puzzle: [
      [0, 0, 3, 0],
      [2, 0, 0, 4],
      [0, 1, 0, 0],
      [0, 4, 0, 0],
    ],
    solution: [
      [4, 2, 3, 1],
      [2, 3, 1, 4],
      [3, 1, 4, 2],
      [1, 4, 2, 3],
    ],
  },
  8: {
    puzzle: [
      [1, 0, 0, 0],
      [0, 0, 2, 0],
      [0, 3, 0, 0],
      [0, 0, 0, 4],
    ],
    solution: [
      [1, 2, 3, 4],
      [3, 4, 2, 1],
      [4, 3, 1, 2],
      [2, 1, 4, 3],
    ],
  },
  9: {
    puzzle: [
      [0, 0, 0, 1],
      [0, 2, 0, 0],
      [3, 0, 0, 0],
      [0, 0, 4, 0],
    ],
    solution: [
      [2, 3, 4, 1],
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [4, 1, 4, 3],
    ],
  },
  10: {
    puzzle: [
      [0, 1, 0, 0],
      [0, 0, 2, 0],
      [0, 3, 0, 0],
      [4, 0, 0, 1],
    ],
    solution: [
      [2, 1, 3, 4],
      [3, 4, 2, 1],
      [1, 3, 4, 2],
      [4, 2, 1, 3],
    ],
  },
};

const SudokuPuzzle: React.FC<SudokuPuzzleProps> = ({ grade }) => {
  const puzzle = puzzlesByGrade[grade] || puzzlesByGrade[5];
  const [grid, setGrid] = useState(puzzle.puzzle.map(row => [...row]));
  const [showFeedback, setShowFeedback] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleChange = (r: number, c: number, val: string) => {
    if (showFeedback) return;
    const up = grid.map(row => [...row]);
    const n = parseInt(val);
    if (!isNaN(n) && n >= 1 && n <= 4) {
      up[r][c] = n;
    } else if (val === '') {
      up[r][c] = 0;
    }
    setGrid(up);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showFeedback) return;
    let isCorrect = true;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] !== puzzle.solution[r][c]) {
          isCorrect = false;
        }
      }
    }
    setCorrect(isCorrect);
    setShowFeedback(true);
  };

  const handleReset = () => {
    setGrid(puzzle.puzzle.map(row => [...row]));
    setShowFeedback(false);
    setCorrect(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Sudoku Puzzle (4x4)</h2>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-4 gap-2 mb-6 max-w-xs mx-auto">
            {grid.map((row, r) =>
              row.map((cell, c) => (
                <input
                  key={`${r}-${c}`}
                  type="text"
                  className={`w-12 h-12 text-center border-2 rounded-lg text-lg font-bold transition-all duration-200 ${
                    puzzle.puzzle[r][c] !== 0
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                      : 'bg-white/5 border-white/20 text-white focus:border-purple-500 focus:outline-none'
                  }`}
                  value={cell === 0 ? '' : cell}
                  onChange={e => handleChange(r, c, e.target.value)}
                  disabled={puzzle.puzzle[r][c] !== 0 || showFeedback}
                  maxLength={1}
                />
              ))
            )}
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={showFeedback}
          >
            Submit Solution
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
              <span className="font-semibold text-lg">Incorrect. Try again!</span>
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
          Reset Puzzle
        </motion.button>
      )}
    </motion.div>
  );
};

export default SudokuPuzzle; 