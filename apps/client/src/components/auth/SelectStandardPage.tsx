import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from '../ui/toaster';

const standards = [5, 6, 7, 8, 9, 10];

const colors = [
  'from-pink-500 to-yellow-500',
  'from-purple-500 to-blue-500',
  'from-green-400 to-emerald-600',
  'from-yellow-400 to-orange-500',
  'from-blue-500 to-cyan-500',
  'from-red-500 to-pink-500',
];

const SelectStandardPage: React.FC = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const handleSelect = async (standard: number) => {
    try {
      await updateUserProfile({ standard });
      toast.success(`Class ${standard} selected!`);
      navigate('/main');
    } catch (error) {
      toast.error('Failed to save standard. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-lg w-full text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-4">Select Your Class</h1>
        <p className="text-lg text-gray-300 mb-8">Choose your current standard to personalize your learning journey!</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {standards.map((std, idx) => (
            <button
              key={std}
              onClick={() => handleSelect(std)}
              className={`py-6 rounded-xl text-2xl font-bold text-white shadow-lg bg-gradient-to-r ${colors[idx % colors.length]} hover:scale-105 transition-transform duration-200`}
            >
              Class {std}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SelectStandardPage; 