import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ProgressProvider, useProgress } from '../../contexts/ProgressContext';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Trophy, 
  Award, 
  Settings, 
  Save,
  Edit3,
  X
} from 'lucide-react';
import AvatarSelector from './AvatarSelector';
import BadgeDisplay from './BadgeDisplay';
import { toast } from './../ui/toaster';

const ProfilePage: React.FC = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateUserProfile({
        displayName: formData.displayName
      });
      setIsEditing(false);
      toast.success('Profile updated successfully! ✨');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: currentUser?.displayName || '',
      email: currentUser?.email || ''
    });
    setIsEditing(false);
  };

  const handleAvatarSelect = async (avatar: string) => {
    try {
      await updateUserProfile({ avatar });
      setShowAvatarSelector(false);
      toast.success('Avatar updated! 🎨');
    } catch (error) {
      console.error('Avatar update error:', error);
      toast.error('Failed to update avatar');
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <ProgressProvider user={currentUser}>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/main')}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-white">Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Basic Info Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Basic Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter display name"
                    />
                  ) : (
                    <p className="text-white font-medium">{currentUser.displayName || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <p className="text-white font-medium">{currentUser.email || 'Guest user'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Standard
                  </label>
                  <p className="text-white font-medium">
                    {currentUser.standard ? `Class ${currentUser.standard}` : 'Not set'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Type
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      currentUser.role === 'guest' 
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {currentUser.role === 'guest' ? 'Guest' : 'Registered'}
                    </div>
                    {currentUser.role === 'guest' && (
                      <span className="text-xs text-gray-400">
                        Sign up to save progress permanently
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-2 mb-6">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-white">Statistics</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{currentUser.xp}</div>
                  <div className="text-sm text-gray-400">Total XP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{currentUser.level}</div>
                  <div className="text-sm text-gray-400">Level</div>
                </div>
                <ProgressStats />
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Avatar Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-2 mb-4">
                <User className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Avatar</h3>
              </div>
              
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-4xl mx-auto mb-4 border-4 border-white/20">
                  {currentUser.avatar || '👤'}
                </div>
                <button
                  onClick={() => setShowAvatarSelector(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Change Avatar
                </button>
              </div>
            </div>

            {/* Badges Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-bold text-white">Badges</h3>
              </div>
              <BadgeDisplay badges={currentUser.badges} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Avatar Selector Modal */}
      {showAvatarSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 max-w-md w-full"
          >
            <AvatarSelector onSelect={handleAvatarSelect} onClose={() => setShowAvatarSelector(false)} />
          </motion.div>
        </div>
      )}
      </div>
    </ProgressProvider>
  );
};

// Component to display progress stats using the ProgressContext
const ProgressStats: React.FC = () => {
  const { weeklyProgress } = useProgress();
  
  return (
    <>
      <div className="text-center">
        <div className="text-2xl font-bold text-white">{weeklyProgress?.totalGamesPlayed || 0}</div>
        <div className="text-sm text-gray-400">Games Played</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-white">{weeklyProgress?.currentStreak || 0}</div>
        <div className="text-sm text-gray-400">Day Streak</div>
      </div>
    </>
  );
};

export default ProfilePage;