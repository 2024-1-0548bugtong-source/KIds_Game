import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface MatchTheFollowingProps {
  grade: number;
}

const pairsByGrade: Record<number, { left: string[]; right: string[]; answer: number[] }[]> = {
  5: [
    {
      left: ['Dog', 'Cat', 'Cow', 'Horse'],
      right: ['Meows', 'Neighs', 'Barks', 'Moos'],
      answer: [2, 0, 3, 1], // Dog->Barks, Cat->Meows, Cow->Moos, Horse->Neighs
    },
  ],
  6: [
    {
      left: ['Sun', 'Moon', 'Earth', 'Mars'],
      right: ['Red Planet', 'Satellite', 'Star', 'Planet'],
      answer: [2, 1, 3, 0],
    },
  ],
  7: [
    {
      left: ['Newton', 'Einstein', 'Curie', 'Galileo'],
      right: ['Radioactivity', 'Relativity', 'Gravity', 'Telescope'],
      answer: [2, 1, 0, 3],
    },
  ],
  8: [
    {
      left: ['Asia', 'Africa', 'Europe', 'Australia'],
      right: ['Kangaroo', 'Pyramids', 'Eiffel Tower', 'Great Wall'],
      answer: [3, 1, 2, 0],
    },
  ],
  9: [
    {
      left: ['Hydrogen', 'Oxygen', 'Carbon', 'Nitrogen'],
      right: ['O2', 'CO2', 'N2', 'H2'],
      answer: [3, 0, 1, 2],
    },
  ],
  10: [
    {
      left: ['Shakespeare', 'Newton', 'Darwin', 'Curie'],
      right: ['Evolution', 'Gravity', 'Radioactivity', 'Hamlet'],
      answer: [3, 1, 0, 2],
    },
  ],
};

const shuffle = (arr: string[]) => arr.map((a) => [Math.random(), a] as [number, string]).sort((a, b) => a[0] - b[0]).map((a) => a[1]);

const MatchTheFollowing: React.FC<MatchTheFollowingProps> = ({ grade }) => {
  const pairs = pairsByGrade[grade] || pairsByGrade[5];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<(number | null)[]>([null, null, null, null]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);
  const [shuffledRight, setShuffledRight] = useState(() => shuffle(pairs[current].right));

  const handleSelect = (leftIdx: number, rightIdx: number) => {
    if (showFeedback) return;
    const updated = [...selected];
    updated[leftIdx] = rightIdx;
    setSelected(updated);
  };

  const handleSubmit = () => {
    if (showFeedback) return;
    let correct = 0;
    for (let i = 0; i < 4; i++) {
      if (shuffledRight[selected[i]!] === pairs[current].right[pairs[current].answer[i]]) {
        correct++;
      }
    }
    setScore(score + correct);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (current < pairs.length - 1) {
      setCurrent(current + 1);
      setSelected([null, null, null, null]);
      setShowFeedback(false);
      setShuffledRight(shuffle(pairs[current + 1].right));
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">🎉 Game Finished!</h2>
        <div className="text-center">
          <p className="text-xl text-gray-300 mb-4">Your Score:</p>
          <p className="text-4xl font-bold text-purple-400 mb-6">{score} / {pairs.length * 4}</p>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(score / (pairs.length * 4)) * 100}%` }}
            ></div>
          </div>
          <p className="text-gray-400">
            {score === pairs.length * 4 ? 'Perfect! 🏆' : 
             score >= pairs.length * 4 * 0.8 ? 'Great job! 🌟' : 
             score >= pairs.length * 4 * 0.6 ? 'Good effort! 👍' : 'Keep practicing! 💪'}
          </p>
        </div>
      </motion.div>
    );
  }

  const pair = pairs[current];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Match the Following</h2>
        <div className="text-right">
          <p className="text-sm text-gray-400">Round {current + 1} of {pairs.length}</p>
          <p className="text-lg font-semibold text-purple-400">Score: {score}</p>
        </div>
      </div>

      <motion.div
        key={current}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-white/5 rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Column A</h3>
            <div className="space-y-3">
              {pair.left.map((item, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10 text-white text-center">
                  {item}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Column B</h3>
            <div className="space-y-3">
              {shuffledRight.map((item, j) => (
                <motion.button
                  key={j}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                    selected.includes(j) 
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300' 
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/30'
                  }`}
                  onClick={() => {
                    const leftIdx = selected.findIndex(s => s === null);
                    if (leftIdx !== -1) handleSelect(leftIdx, j);
                  }}
                  disabled={showFeedback || selected.includes(j)}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/20 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Your Matches</h3>
          <div className="space-y-3">
            {pair.left.map((item, i) => (
              <div key={i} className="flex items-center justify-center space-x-4">
                <span className="w-24 p-2 bg-white/5 rounded text-white text-center">{item}</span>
                <span className="text-purple-400 text-xl">→</span>
                <span className="w-32 p-2 bg-white/5 rounded text-white text-center">
                  {selected[i] !== null ? shuffledRight[selected[i]!] : '...'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {!showFeedback && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={selected.includes(null)}
        >
          Submit Matches
        </motion.button>
      )}

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-white/5 border border-white/20 text-center"
        >
          <div className="text-green-400 font-semibold text-lg">
            You got {selected.filter((sel, i) => sel !== null && shuffledRight[sel!] === pair.right[pair.answer[i]]).length} / 4 correct!
          </div>
        </motion.div>
      )}

      {showFeedback && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          onClick={handleNext}
        >
          {current < pairs.length - 1 ? 'Next Round →' : 'Finish Game'}
        </motion.button>
      )}
    </motion.div>
  );
};

export default MatchTheFollowing; 