import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface JigsawPuzzleProps {
  grade: number;
}

const puzzlesByGrade: Record<number, { pieces: string[]; answer: string[] }> = {
  5: { pieces: ['🐶', '🐱', '🐭', '🐹'], answer: ['🐶', '🐱', '🐭', '🐹'] },
  6: { pieces: ['🌞', '🌜', '🌍', '⭐'], answer: ['🌞', '🌜', '🌍', '⭐'] },
  7: { pieces: ['⚛️', '🧬', '🦠', '🔬'], answer: ['⚛️', '🧬', '🦠', '🔬'] },
  8: { pieces: ['🗻', '🏜️', '🏝️', '🏞️'], answer: ['🗻', '🏜️', '🏝️', '🏞️'] },
  9: { pieces: ['🦴', '🧠', '🫀', '🫁'], answer: ['🦴', '🧠', '🫀', '🫁'] },
  10: { pieces: ['⚡', '🔥', '💧', '🌪️'], answer: ['⚡', '🔥', '💧', '🌪️'] },
};

function shuffle<T>(arr: T[]): T[] {
  return arr.map(a => [Math.random(), a] as [number, T]).sort((a, b) => a[0] - b[0]).map(a => a[1]);
}

const JigsawPuzzle: React.FC<JigsawPuzzleProps> = ({ grade }) => {
  const puzzle = puzzlesByGrade[grade] || puzzlesByGrade[5];
  const [pieces, setPieces] = useState(() => shuffle(puzzle.pieces));
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleSelect = (idx: number) => {
    if (showFeedback) return;
    setSelected(selected === idx ? null : idx);
  };

  const handleSwap = (idx: number) => {
    if (showFeedback || selected === null || selected === idx) return;
    const up = [...pieces];
    [up[selected], up[idx]] = [up[idx], up[selected]];
    setPieces(up);
    setSelected(null);
  };

  const handleSubmit = () => {
    const isCorrect = pieces.every((p, i) => p === puzzle.answer[i]);
    setCorrect(isCorrect);
    setShowFeedback(true);
  };

  const handleReset = () => {
    setPieces(shuffle(puzzle.pieces));
    setShowFeedback(false);
    setCorrect(false);
    setSelected(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Jigsaw Puzzle</h2>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-white/5 rounded-xl p-6 border border-white/20 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Arrange the pieces in the correct order</h3>
          <p className="text-gray-300 text-center text-sm">Click a piece to select it, then click another to swap them</p>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          {pieces.map((piece, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-16 h-16 text-3xl border-2 rounded-xl flex items-center justify-center transition-all duration-200 ${
                selected === idx 
                  ? 'bg-purple-500/30 border-purple-500 shadow-lg shadow-purple-500/25' 
                  : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
              }`}
              onClick={() => selected === null ? handleSelect(idx) : handleSwap(idx)}
              disabled={showFeedback}
            >
              {piece}
            </motion.button>
          ))}
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/20 mb-6">
          <h4 className="text-sm font-semibold text-gray-300 mb-2 text-center">Your Arrangement:</h4>
          <div className="flex justify-center space-x-2">
            {pieces.map((piece, idx) => (
              <div key={idx} className="w-12 h-12 text-2xl flex items-center justify-center bg-white/5 rounded-lg border border-white/10">
                {piece}
              </div>
            ))}
          </div>
        </div>

        {!showFeedback && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            onClick={handleSubmit}
          >
            Check Solution
          </motion.button>
        )}
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
          Shuffle & Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default JigsawPuzzle; 