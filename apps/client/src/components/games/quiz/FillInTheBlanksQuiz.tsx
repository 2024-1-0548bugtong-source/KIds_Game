import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FillInTheBlanksQuizProps {
  grade: number;
}

const questionsByGrade: Record<number, { sentence: string; answer: string }[]> = {
  5: [
    { sentence: 'The capital of India is _____.', answer: 'Delhi' },
    { sentence: 'A dog barks, a cat _____.', answer: 'meows' },
    { sentence: 'The color of the sky is _____.', answer: 'blue' },
    { sentence: '2 + 2 = _____.', answer: '4' },
  ],
  6: [
    { sentence: 'The process by which plants make food is called _____.', answer: 'photosynthesis' },
    { sentence: 'The largest planet in our solar system is _____.', answer: 'Jupiter' },
    { sentence: 'The opposite of hot is _____.', answer: 'cold' },
    { sentence: 'The author of "Panchatantra" is _____.', answer: 'Vishnu Sharma' },
  ],
  7: [
    { sentence: 'The chemical symbol for water is _____.', answer: 'H2O' },
    { sentence: 'The longest river in India is _____.', answer: 'Ganga' },
    { sentence: 'The square root of 81 is _____.', answer: '9' },
    { sentence: 'The currency of Japan is _____.', answer: 'Yen' },
  ],
  8: [
    { sentence: 'The process of changing water into vapor is called _____.', answer: 'evaporation' },
    { sentence: 'The largest continent is _____.', answer: 'Asia' },
    { sentence: 'The author of "Ramayana" is _____.', answer: 'Valmiki' },
    { sentence: 'The hardest substance is _____.', answer: 'diamond' },
  ],
  9: [
    { sentence: 'The powerhouse of the cell is _____.', answer: 'mitochondria' },
    { sentence: 'The value of pi up to two decimal places is _____.', answer: '3.14' },
    { sentence: 'The largest desert in the world is _____.', answer: 'Sahara' },
    { sentence: 'The author of "Discovery of India" is _____.', answer: 'Nehru' },
  ],
  10: [
    { sentence: 'The SI unit of force is _____.', answer: 'Newton' },
    { sentence: 'The process of cell division is called _____.', answer: 'mitosis' },
    { sentence: 'The capital of Australia is _____.', answer: 'Canberra' },
    { sentence: 'The author of "Hamlet" is _____.', answer: 'Shakespeare' },
  ],
};

const FillInTheBlanksQuiz: React.FC<FillInTheBlanksQuizProps> = ({ grade }) => {
  const questions = questionsByGrade[grade] || questionsByGrade[5];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showFeedback) return;
    const isCorrect = input.trim().toLowerCase() === questions[current].answer.toLowerCase();
    setCorrect(isCorrect);
    setShowFeedback(true);
    if (isCorrect) setScore(score + 1);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setInput('');
      setShowFeedback(false);
      setCorrect(false);
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
        <h2 className="text-2xl font-bold text-white">Fill in the Blanks</h2>
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
        <h3 className="text-xl text-white mb-8 leading-relaxed">{q.sentence}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              className="w-full py-4 px-6 bg-white/5 border-2 border-white/20 rounded-xl text-white text-lg placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-200"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={showFeedback}
              placeholder="Type your answer here..."
              autoFocus
            />
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={showFeedback || input.trim() === ''}
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
            <div className="flex items-center text-green-400">
              <span className="text-2xl mr-2">✅</span>
              <span className="font-semibold">Correct!</span>
            </div>
          ) : (
            <div className="flex items-center text-red-400">
              <span className="text-2xl mr-2">❌</span>
              <span className="font-semibold">Incorrect. The correct answer is "{q.answer}".</span>
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

export default FillInTheBlanksQuiz; 