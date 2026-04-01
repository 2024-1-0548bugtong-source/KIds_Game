import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TrueFalseQuizProps {
  grade: number;
}

const questionsByGrade: Record<number, { question: string; answer: boolean }[]> = {
  5: [
    { question: 'The sun rises in the east.', answer: true },
    { question: 'Fish can fly.', answer: false },
    { question: 'A triangle has three sides.', answer: true },
    { question: 'Dogs can speak English.', answer: false },
  ],
  6: [
    { question: 'Water boils at 100°C.', answer: true },
    { question: 'The capital of India is Mumbai.', answer: false },
    { question: 'Plants make food by photosynthesis.', answer: true },
    { question: 'The moon is a planet.', answer: false },
  ],
  7: [
    { question: 'Sound travels faster than light.', answer: false },
    { question: 'The human body has 206 bones.', answer: true },
    { question: 'Venus is the closest planet to the Sun.', answer: false },
    { question: 'Bats are mammals.', answer: true },
  ],
  8: [
    { question: 'The Great Wall of China is visible from space.', answer: false },
    { question: 'Copper is a good conductor of electricity.', answer: true },
    { question: 'The Pacific Ocean is the largest ocean.', answer: true },
    { question: 'Photosynthesis occurs in animal cells.', answer: false },
  ],
  9: [
    { question: 'Newton discovered gravity.', answer: true },
    { question: 'The chemical symbol for gold is Au.', answer: true },
    { question: 'The heart pumps blood.', answer: true },
    { question: 'Electrons are larger than atoms.', answer: false },
  ],
  10: [
    { question: 'DNA stands for Deoxyribonucleic Acid.', answer: true },
    { question: 'The speed of light is about 300,000 km/s.', answer: true },
    { question: 'Water is an element.', answer: false },
    { question: 'The mitochondria is the powerhouse of the cell.', answer: true },
  ],
};

const TrueFalseQuiz: React.FC<TrueFalseQuizProps> = ({ grade }) => {
  const questions = questionsByGrade[grade] || questionsByGrade[5];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (ans: boolean) => {
    if (selected !== null) return;
    setSelected(ans);
    setShowFeedback(true);
    if (ans === questions[current].answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setShowFeedback(false);
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
        <h2 className="text-3xl font-bold text-white mb-6 text-center">🎉 Quiz Finished!</h2>
        <div className="text-center">
          <p className="text-xl text-gray-300 mb-4">Your Score:</p>
          <p className="text-4xl font-bold text-purple-400 mb-6">{score} / {questions.length}</p>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(score / questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-gray-400">
            {score === questions.length ? 'Perfect! 🏆' : 
             score >= questions.length * 0.8 ? 'Great job! 🌟' : 
             score >= questions.length * 0.6 ? 'Good effort! 👍' : 'Keep practicing! 💪'}
          </p>
        </div>
      </motion.div>
    );
  }

  const q = questions[current];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">True/False Quiz</h2>
        <div className="text-right">
          <p className="text-sm text-gray-400">Question {current + 1} of {questions.length}</p>
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
        <h3 className="text-xl text-white mb-8 leading-relaxed">{q.question}</h3>
        
        <div className="flex space-x-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 py-6 px-8 rounded-xl border-2 text-center text-lg font-semibold transition-all duration-200 ${
              selected === true
                ? q.answer === true
                  ? 'bg-green-500/20 border-green-500 text-green-300'
                  : 'bg-red-500/20 border-red-500 text-red-300'
                : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30'
            }`}
            onClick={() => handleAnswer(true)}
            disabled={selected !== null}
          >
            ✅ True
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 py-6 px-8 rounded-xl border-2 text-center text-lg font-semibold transition-all duration-200 ${
              selected === false
                ? q.answer === false
                  ? 'bg-green-500/20 border-green-500 text-green-300'
                  : 'bg-red-500/20 border-red-500 text-red-300'
                : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30'
            }`}
            onClick={() => handleAnswer(false)}
            disabled={selected !== null}
          >
            ❌ False
          </motion.button>
        </div>
      </motion.div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-white/5 border border-white/20"
        >
          {selected === q.answer ? (
            <div className="flex items-center text-green-400">
              <span className="text-2xl mr-2">✅</span>
              <span className="font-semibold">Correct!</span>
            </div>
          ) : (
            <div className="flex items-center text-red-400">
              <span className="text-2xl mr-2">❌</span>
              <span className="font-semibold">Incorrect. The correct answer is "{q.answer ? 'True' : 'False'}".</span>
            </div>
          )}
        </motion.div>
      )}

      {showFeedback && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          onClick={handleNext}
        >
          {current < questions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
        </motion.button>
      )}
    </motion.div>
  );
};

export default TrueFalseQuiz; 