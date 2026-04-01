import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface AvatarSelectorProps {
  onSelect: (avatar: string) => void;
  onClose: () => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ onSelect, onClose }) => {
  const avatars = [
    '👤', '👨‍🎓', '👩‍🎓', '👨‍🏫', '👩‍🏫', '🧑‍💻', '👨‍🔬', '👩‍🔬',
    '👨‍🎨', '👩‍🎨', '👨‍⚕️', '👩‍⚕️', '👨‍🚀', '👩‍🚀', '👨‍🎭', '👩‍🎭',
    '🦊', '🐱', '🐶', '🐼', '🐨', '🐯', '🦁', '🐸',
    '🐙', '🦄', '🐲', '🐉', '🦕', '🦖', '🐢', '🦎'
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Choose Your Avatar</h3>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {avatars.map((avatar, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(avatar)}
            className="w-16 h-16 text-3xl bg-white/10 hover:bg-white/20 rounded-xl border-2 border-transparent hover:border-purple-500 transition-all duration-200 flex items-center justify-center"
          >
            {avatar}
          </motion.button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Click on an avatar to select it
        </p>
      </div>
    </div>
  );
};

export default AvatarSelector; 