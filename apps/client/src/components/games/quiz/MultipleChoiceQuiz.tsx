import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { useProgress } from '../../../contexts/ProgressContext';

interface MultipleChoiceQuizProps {
  grade: number;
}

const questionsByGrade: Record<number, { question: string; options: string[]; answer: number }[]> = {
  5: [
    { question: 'What is 2 + 3?', options: ['4', '5', '6', '7'], answer: 1 },
    { question: 'Which is a mammal?', options: ['Shark', 'Frog', 'Dog', 'Eagle'], answer: 2 },
    { question: 'What color are bananas?', options: ['Red', 'Yellow', 'Blue', 'Green'], answer: 1 },
    { question: 'Which is a fruit?', options: ['Carrot', 'Potato', 'Apple', 'Lettuce'], answer: 2 },
  ],
  6: [
    { question: 'What is 12 x 3?', options: ['36', '24', '15', '30'], answer: 0 },
    { question: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], answer: 2 },
    { question: 'What gas do plants breathe in?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'], answer: 1 },
    { question: 'Who wrote "The Jungle Book"?', options: ['J.K. Rowling', 'Rudyard Kipling', 'Mark Twain', 'Roald Dahl'], answer: 1 },
  ],
  7: [
    { question: 'What is the square root of 49?', options: ['6', '7', '8', '9'], answer: 1 },
    { question: 'Who discovered gravity?', options: ['Newton', 'Einstein', 'Galileo', 'Curie'], answer: 0 },
    { question: 'Which is a prime number?', options: ['4', '6', '9', '11'], answer: 3 },
    { question: 'What is H2O?', options: ['Salt', 'Water', 'Oxygen', 'Hydrogen'], answer: 1 },
  ],
  8: [
    { question: 'What is 15% of 200?', options: ['20', '25', '30', '35'], answer: 2 },
    { question: 'Who painted the Mona Lisa?', options: ['Van Gogh', 'Picasso', 'Da Vinci', 'Rembrandt'], answer: 2 },
    { question: 'What is the capital of Japan?', options: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'], answer: 2 },
    { question: 'Which is a non-renewable resource?', options: ['Wind', 'Solar', 'Coal', 'Water'], answer: 2 },
  ],
  9: [
    { question: 'What is the value of π (pi) to 2 decimal places?', options: ['3.12', '3.14', '3.16', '3.18'], answer: 1 },
    { question: 'Who developed the theory of relativity?', options: ['Newton', 'Einstein', 'Tesla', 'Bohr'], answer: 1 },
    { question: 'Which is a chemical change?', options: ['Melting', 'Boiling', 'Rusting', 'Freezing'], answer: 2 },
    { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'], answer: 1 },
  ],
  10: [
    { question: 'What is the derivative of x^2?', options: ['x', '2x', 'x^2', '2'], answer: 1 },
    { question: 'Who wrote "Hamlet"?', options: ['Shakespeare', 'Dickens', 'Austen', 'Homer'], answer: 0 },
    { question: 'Which is a noble gas?', options: ['Oxygen', 'Nitrogen', 'Argon', 'Hydrogen'], answer: 2 },
    { question: 'What is the SI unit of force?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], answer: 1 },
  ],
};

const MultipleChoiceQuiz: React.FC<MultipleChoiceQuizProps> = ({ grade }) => {
  const questions = questionsByGrade[grade] || questionsByGrade[5];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleOptionClick = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowFeedback(true);
    if (idx === questions[current].answer) {
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

  const { currentUser } = useAuth();
  const { recordActivity } = useProgress();

  // Calculate XP earned based on score and grade level
  const calculateXpEarned = () => {
    const baseXp = 10; // Base XP for completing a quiz
    const correctAnswerXp = 5; // XP per correct answer
    const gradeMultiplier = grade / 5; // Higher grades earn more XP
    
    return Math.round(baseXp + (score * correctAnswerXp * gradeMultiplier));
  };

  // Handle quiz completion and update progress
  const handleQuizCompletion = () => {
    if (!finished) return;
    
    const xpEarned = calculateXpEarned();
    const isPerfectScore = score === questions.length;
    
    // Record the activity in progress context
    recordActivity({
      gamePlayed: true,
      xpEarned,
      gameCompleted: true,
    });
    
    // Check if user earned a perfect score badge
    if (isPerfectScore) {
      const updatedBadges = [...(currentUser?.badges || [])];
      if (!updatedBadges.includes('perfect_score')) {
        updatedBadges.push('perfect_score');
        // Update user profile with new badge
        // TODO: Implement user profile update logic
        // For now, we'll just log the badge update
        console.log('User earned perfect score badge:', {
          badges: updatedBadges
        });
      }
    }
  };

  // Call handleQuizCompletion when quiz is finished
  React.useEffect(() => {
    if (finished) {
      handleQuizCompletion();
    }
  }, [finished]);

  if (finished) {
    const xpEarned = calculateXpEarned();
    
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
          <p className="text-gray-400 mb-4">
            {score === questions.length ? 'Perfect! 🏆' : 
             score >= questions.length * 0.8 ? 'Great job! 🌟' : 
             score >= questions.length * 0.6 ? 'Good effort! 👍' : 'Keep practicing! 💪'}
          </p>
          <p className="text-green-400 font-semibold">+ {xpEarned} XP earned!</p>
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
        <h2 className="text-2xl font-bold text-white">Multiple Choice Quiz</h2>
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
        <h3 className="text-xl text-white mb-6 leading-relaxed">{q.question}</h3>
        
        <div className="space-y-4">
          {q.options.map((opt, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                selected === idx
                  ? idx === q.answer
                    ? 'bg-green-500/20 border-green-500 text-green-300'
                    : 'bg-red-500/20 border-red-500 text-red-300'
                  : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30'
              }`}
              onClick={() => handleOptionClick(idx)}
              disabled={selected !== null}
            >
              <span className="inline-block w-6 h-6 rounded-full bg-purple-500 text-white text-sm font-bold mr-3 text-center">
                {String.fromCharCode(65 + idx)}
              </span>
              {opt}
            </motion.button>
          ))}
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
              <span className="font-semibold">Incorrect. The correct answer is "{q.options[q.answer]}".</span>
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

export default MultipleChoiceQuiz;