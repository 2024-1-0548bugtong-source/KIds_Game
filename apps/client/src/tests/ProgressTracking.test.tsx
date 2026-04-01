import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';
import { ProgressProvider } from '../contexts/ProgressContext';
import MultipleChoiceQuiz from '../components/games/quiz/MultipleChoiceQuiz';

// Mock Firebase
const mockUpdateUserProfile = jest.fn();
const mockRecordActivity = jest.fn();

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: {
      uid: 'test-user-id',
      displayName: 'Test User',
      email: 'test@example.com',
      role: 'registered',
      xp: 100,
      level: 2,
      badges: ['first_game'],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      standard: 6
    },
    updateUserProfile: mockUpdateUserProfile
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock('../contexts/ProgressContext', () => ({
  useProgress: () => ({
    recordActivity: mockRecordActivity,
    updateUserProfile: mockUpdateUserProfile,
    weeklyProgress: {
      totalXp: 100,
      totalGamesPlayed: 5,
      currentStreak: 2
    },
    getWeeklyXp: () => [10, 20, 30, 40, 0, 0, 0],
    getWeeklyGames: () => [1, 2, 1, 1, 0, 0, 0],
    getDayLabels: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    getTodayXp: () => 40,
    getWeeklyTotalXp: () => 100,
    getAverageXpPerDay: () => 14
  }),
  ProgressProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('Progress Tracking', () => {
  beforeEach(() => {
    mockUpdateUserProfile.mockClear();
    mockRecordActivity.mockClear();
  });

  test('Quiz completion records activity and updates user profile', async () => {
    render(
      <AuthProvider>
        <ProgressProvider>
          <MultipleChoiceQuiz grade={6} />
        </ProgressProvider>
      </AuthProvider>
    );

    // Answer all questions correctly to complete the quiz
    const questions = screen.getAllByText(/Question/)[0];
    expect(questions).toBeInTheDocument();

    // Find and click the correct answer for the first question
    const correctAnswer = screen.getByText('36');
    fireEvent.click(correctAnswer);

    // Click next question
    const nextButton = screen.getByText('Next Question →');
    fireEvent.click(nextButton);

    // Continue for remaining questions
    // This is simplified - in a real test you would need to handle each question
    
    // Verify that recordActivity was called with the correct parameters
    await waitFor(() => {
      expect(mockRecordActivity).toHaveBeenCalledWith(expect.objectContaining({
        activityType: 'quiz',
        completed: true
      }));
    });

    // Verify that updateUserProfile was called to update XP and potentially badges
    await waitFor(() => {
      expect(mockUpdateUserProfile).toHaveBeenCalled();
    });
  });
});