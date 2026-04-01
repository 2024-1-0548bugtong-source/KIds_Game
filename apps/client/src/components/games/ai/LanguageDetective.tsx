import React, { useState, useEffect, JSX } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { useProgress } from '../../../contexts/ProgressContext';

interface LanguageDetectiveProps {
  grade: number;
}

interface GrammarRule {
  id: string;
  name: string;
  description: string;
  examples: string[];
  difficulty: number; // 1-5 scale
}

interface Challenge {
  id: string;
  text: string;
  issues: Issue[];
  difficulty: number; // 1-5 scale
  category: string;
}

interface Issue {
  id: string;
  start: number;
  end: number;
  ruleId: string;
  incorrectText: string;
  correctText: string;
  explanation: string;
}

interface GameState {
  currentChallenge: Challenge | null;
  grammarRules: GrammarRule[];
  selectedText: [number, number] | null;
  identifiedIssues: string[];
  score: number;
  round: number;
  totalRounds: number;
  feedback: string;
  showFeedback: boolean;
  timeRemaining: number;
  gameCompleted: boolean;
  showHint: boolean;
  hintPenalty: number;
  showExplanation: boolean;
}

// Mock data for grammar rules
const grammarRules: GrammarRule[] = [
  {
    id: 'subject_verb_agreement',
    name: 'Subject-Verb Agreement',
    description: 'The subject and verb in a sentence must agree in number (singular or plural).',
    examples: [
      'Incorrect: The dog bark loudly. | Correct: The dog barks loudly.',
      'Incorrect: They is going to the store. | Correct: They are going to the store.'
    ],
    difficulty: 1
  },
  {
    id: 'capitalization',
    name: 'Capitalization',
    description: 'The first word of a sentence, proper nouns, and proper adjectives should be capitalized.',
    examples: [
      'Incorrect: john lives in new york. | Correct: John lives in New York.',
      'Incorrect: we visited the museum on tuesday. | Correct: We visited the museum on Tuesday.'
    ],
    difficulty: 1
  },
  {
    id: 'punctuation',
    name: 'Punctuation',
    description: 'Proper punctuation marks should be used to end sentences and separate clauses.',
    examples: [
      'Incorrect: Where are you going | Correct: Where are you going?',
      'Incorrect: I went to the store I bought milk | Correct: I went to the store. I bought milk.'
    ],
    difficulty: 2
  },
  {
    id: 'pronoun_agreement',
    name: 'Pronoun Agreement',
    description: 'Pronouns must agree with their antecedents in number, gender, and person.',
    examples: [
      'Incorrect: Each student must bring their book. | Correct: Each student must bring his or her book.',
      'Incorrect: The team played their best game. | Correct: The team played its best game.'
    ],
    difficulty: 3
  },
  {
    id: 'run_on_sentence',
    name: 'Run-on Sentence',
    description: 'A run-on sentence contains two or more independent clauses that are not properly connected.',
    examples: [
      'Incorrect: I like to run I go jogging every day. | Correct: I like to run. I go jogging every day.',
      'Incorrect: She is smart she gets good grades. | Correct: She is smart, and she gets good grades.'
    ],
    difficulty: 3
  },
  {
    id: 'double_negative',
    name: 'Double Negative',
    description: 'Using two negative words in the same clause creates a double negative, which is incorrect in standard English.',
    examples: [
      'Incorrect: I don\'t have no money. | Correct: I don\'t have any money.',
      'Incorrect: She didn\'t say nothing. | Correct: She didn\'t say anything.'
    ],
    difficulty: 3
  },
  {
    id: 'dangling_modifier',
    name: 'Dangling Modifier',
    description: 'A modifier that has nothing to modify or modifies the wrong thing in a sentence.',
    examples: [
      'Incorrect: Walking down the street, the trees were beautiful. | Correct: Walking down the street, I thought the trees were beautiful.',
      'Incorrect: Having finished the assignment, the TV was turned on. | Correct: Having finished the assignment, she turned on the TV.'
    ],
    difficulty: 4
  },
  {
    id: 'parallelism',
    name: 'Parallelism',
    description: 'Parallel structure means using the same pattern of words for two or more ideas that have the same level of importance.',
    examples: [
      'Incorrect: She likes swimming, running, and to bike. | Correct: She likes swimming, running, and biking.',
      'Incorrect: The coach told the players that they should get plenty of sleep, that they should not eat too much, and to do some stretching. | Correct: The coach told the players that they should get plenty of sleep, that they should not eat too much, and that they should do some stretching.'
    ],
    difficulty: 5
  },
  {
    id: 'misplaced_modifier',
    name: 'Misplaced Modifier',
    description: 'A modifier that is placed too far from the word it modifies, causing confusion.',
    examples: [
      'Incorrect: The girl walked the dog in red pajamas. | Correct: The girl in red pajamas walked the dog.',
      'Incorrect: I only have one dollar. | Correct: I have only one dollar.'
    ],
    difficulty: 4
  },
  {
    id: 'comma_splice',
    name: 'Comma Splice',
    description: 'A comma splice occurs when two independent clauses are joined with just a comma.',
    examples: [
      'Incorrect: It was raining, we stayed inside. | Correct: It was raining, so we stayed inside.',
      'Incorrect: She studied hard, she passed the test. | Correct: She studied hard; she passed the test.'
    ],
    difficulty: 4
  }
];

// Mock data for challenges
const challenges: Challenge[] = [
  {
    id: 'challenge_1',
    text: 'the boy walk to school every day with his friends.',
    issues: [
      {
        id: 'issue_1_1',
        start: 0,
        end: 3,
        ruleId: 'capitalization',
        incorrectText: 'the',
        correctText: 'The',
        explanation: 'The first word of a sentence should be capitalized.'
      },
      {
        id: 'issue_1_2',
        start: 8,
        end: 12,
        ruleId: 'subject_verb_agreement',
        incorrectText: 'walk',
        correctText: 'walks',
        explanation: 'The singular subject "boy" requires the singular verb form "walks".'
      }
    ],
    difficulty: 1,
    category: 'Basic Grammar'
  },
  {
    id: 'challenge_2',
    text: 'sarah and mike goes to the park on saturday',
    issues: [
      {
        id: 'issue_2_1',
        start: 0,
        end: 5,
        ruleId: 'capitalization',
        incorrectText: 'sarah',
        correctText: 'Sarah',
        explanation: 'Names are proper nouns and should be capitalized.'
      },
      {
        id: 'issue_2_2',
        start: 10,
        end: 14,
        ruleId: 'subject_verb_agreement',
        incorrectText: 'goes',
        correctText: 'go',
        explanation: 'The plural subject "Sarah and Mike" requires the plural verb form "go".'
      },
      {
        id: 'issue_2_3',
        start: 27,
        end: 35,
        ruleId: 'capitalization',
        incorrectText: 'saturday',
        correctText: 'Saturday',
        explanation: 'Days of the week are proper nouns and should be capitalized.'
      },
      {
        id: 'issue_2_4',
        start: 35,
        end: 35,
        ruleId: 'punctuation',
        incorrectText: '',
        correctText: '.',
        explanation: 'Sentences should end with appropriate punctuation.'
      }
    ],
    difficulty: 2,
    category: 'Basic Grammar'
  },
  {
    id: 'challenge_3',
    text: 'The team played their best game they won the championship.',
    issues: [
      {
        id: 'issue_3_1',
        start: 10,
        end: 16,
        ruleId: 'pronoun_agreement',
        incorrectText: 'their',
        correctText: 'its',
        explanation: 'The collective noun "team" takes the singular pronoun "its".'
      },
      {
        id: 'issue_3_2',
        start: 26,
        end: 26,
        ruleId: 'run_on_sentence',
        incorrectText: '',
        correctText: '.',
        explanation: 'This is a run-on sentence. It should be split into two sentences or joined with a conjunction.'
      }
    ],
    difficulty: 3,
    category: 'Intermediate Grammar'
  },
  {
    id: 'challenge_4',
    text: 'I don\'t have no money so I can\'t buy nothing at the store.',
    issues: [
      {
        id: 'issue_4_1',
        start: 9,
        end: 11,
        ruleId: 'double_negative',
        incorrectText: 'no',
        correctText: 'any',
        explanation: 'Using "don\'t" and "no" together creates a double negative. Use "any" instead of "no".'
      },
      {
        id: 'issue_4_2',
        start: 30,
        end: 37,
        ruleId: 'double_negative',
        incorrectText: 'nothing',
        correctText: 'anything',
        explanation: 'Using "can\'t" and "nothing" together creates a double negative. Use "anything" instead of "nothing".'
      }
    ],
    difficulty: 3,
    category: 'Intermediate Grammar'
  },
  {
    id: 'challenge_5',
    text: 'Walking down the street, the trees were beautiful.',
    issues: [
      {
        id: 'issue_5_1',
        start: 0,
        end: 23,
        ruleId: 'dangling_modifier',
        incorrectText: 'Walking down the street,',
        correctText: 'Walking down the street, I noticed that',
        explanation: 'The phrase "Walking down the street" is a dangling modifier because it doesn\'t clearly modify any subject in the main clause.'
      }
    ],
    difficulty: 4,
    category: 'Advanced Grammar'
  },
  {
    id: 'challenge_6',
    text: 'She likes swimming, running, and to bike on weekends.',
    issues: [
      {
        id: 'issue_6_1',
        start: 31,
        end: 38,
        ruleId: 'parallelism',
        incorrectText: 'to bike',
        correctText: 'biking',
        explanation: 'For parallel structure, all items in a list should use the same grammatical form. Since "swimming" and "running" are gerunds, "to bike" should be changed to "biking".'
      }
    ],
    difficulty: 4,
    category: 'Advanced Grammar'
  },
  {
    id: 'challenge_7',
    text: 'The teacher told the students that they should study hard, that they should get enough sleep, and to eat a good breakfast.',
    issues: [
      {
        id: 'issue_7_1',
        start: 92,
        end: 110,
        ruleId: 'parallelism',
        incorrectText: 'to eat a good breakfast',
        correctText: 'that they should eat a good breakfast',
        explanation: 'For parallel structure, all items in a list should use the same grammatical form. Since the first two items use "that they should", the third item should follow the same pattern.'
      }
    ],
    difficulty: 5,
    category: 'Advanced Grammar'
  },
  {
    id: 'challenge_8',
    text: 'I saw a dog walking to school.',
    issues: [
      {
        id: 'issue_8_1',
        start: 6,
        end: 23,
        ruleId: 'misplaced_modifier',
        incorrectText: 'a dog walking to school',
        correctText: 'a dog while walking to school',
        explanation: 'The phrase "walking to school" is a misplaced modifier because it appears to modify "dog" rather than the subject "I".'
      }
    ],
    difficulty: 4,
    category: 'Advanced Grammar'
  },
  {
    id: 'challenge_9',
    text: 'It was raining, we stayed inside all day.',
    issues: [
      {
        id: 'issue_9_1',
        start: 14,
        end: 14,
        ruleId: 'comma_splice',
        incorrectText: ',',
        correctText: ', so',
        explanation: 'This is a comma splice. Two independent clauses are joined with just a comma. Add a conjunction after the comma or use a semicolon instead.'
      }
    ],
    difficulty: 4,
    category: 'Advanced Grammar'
  },
  {
    id: 'challenge_10',
    text: 'john and mary went to new york city they visited the empire state building and the statue of liberty.',
    issues: [
      {
        id: 'issue_10_1',
        start: 0,
        end: 4,
        ruleId: 'capitalization',
        incorrectText: 'john',
        correctText: 'John',
        explanation: 'Names are proper nouns and should be capitalized.'
      },
      {
        id: 'issue_10_2',
        start: 9,
        end: 13,
        ruleId: 'capitalization',
        incorrectText: 'mary',
        correctText: 'Mary',
        explanation: 'Names are proper nouns and should be capitalized.'
      },
      {
        id: 'issue_10_3',
        start: 22,
        end: 35,
        ruleId: 'capitalization',
        incorrectText: 'new york city',
        correctText: 'New York City',
        explanation: 'City names are proper nouns and should be capitalized.'
      },
      {
        id: 'issue_10_4',
        start: 35,
        end: 35,
        ruleId: 'run_on_sentence',
        incorrectText: '',
        correctText: '.',
        explanation: 'This is a run-on sentence. It should be split into two sentences or joined with a conjunction.'
      },
      {
        id: 'issue_10_5',
        start: 46,
        end: 67,
        ruleId: 'capitalization',
        incorrectText: 'empire state building',
        correctText: 'Empire State Building',
        explanation: 'Names of landmarks are proper nouns and should be capitalized.'
      },
      {
        id: 'issue_10_6',
        start: 76,
        end: 95,
        ruleId: 'capitalization',
        incorrectText: 'statue of liberty',
        correctText: 'Statue of Liberty',
        explanation: 'Names of landmarks are proper nouns and should be capitalized.'
      }
    ],
    difficulty: 5,
    category: 'Advanced Grammar'
  }
];

// Get challenges based on grade level
const getChallengesForGrade = (grade: number): Challenge[] => {
  if (grade <= 6) {
    // Simple challenges for younger students (difficulty 1-2)
    return challenges.filter(challenge => challenge.difficulty <= 2);
  } else if (grade <= 8) {
    // Medium difficulty challenges (difficulty 1-4)
    return challenges.filter(challenge => challenge.difficulty <= 4);
  } else {
    // All challenges including the most difficult ones
    return challenges;
  }
};

// Get grammar rules based on grade level
const getGrammarRulesForGrade = (grade: number): GrammarRule[] => {
  if (grade <= 6) {
    // Basic rules for younger students (difficulty 1-2)
    return grammarRules.filter(rule => rule.difficulty <= 2);
  } else if (grade <= 8) {
    // More rules for middle grades (difficulty 1-4)
    return grammarRules.filter(rule => rule.difficulty <= 4);
  } else {
    // All rules including the most advanced ones
    return grammarRules;
  }
};

// Get number of rounds based on grade
const getNumberOfRounds = (grade: number): number => {
  if (grade <= 6) return 5; // Fewer rounds for younger students
  if (grade <= 8) return 7; // More rounds for middle grades
  return 10; // Most rounds for older students
};

// Get time per round based on grade
const getTimePerRound = (grade: number): number => {
  if (grade <= 6) return 90; // More time for younger students
  if (grade <= 8) return 75; // Less time for middle grades
  return 60; // Least time for older students
};

const LanguageDetective: React.FC<LanguageDetectiveProps> = ({ grade }) => {
  const [gameState, setGameState] = useState<GameState>({
    currentChallenge: null,
    grammarRules: getGrammarRulesForGrade(grade),
    selectedText: null,
    identifiedIssues: [],
    score: 0,
    round: 0,
    totalRounds: getNumberOfRounds(grade),
    feedback: '',
    showFeedback: false,
    timeRemaining: getTimePerRound(grade),
    gameCompleted: false,
    showHint: false,
    hintPenalty: 0,
    showExplanation: false
  });

  const { currentUser } = useAuth();
  const { recordActivity } = useProgress();

  // Initialize game
  useEffect(() => {
    startNewRound();
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState.gameCompleted || gameState.showFeedback) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 1) {
          clearInterval(timer);
          // Time's up - show feedback
          return {
            ...prev,
            timeRemaining: 0,
            showFeedback: true,
            feedback: 'Time\'s up! Let\'s see the grammar issues.'
          };
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameCompleted, gameState.showFeedback]);

  const startNewRound = () => {
    // Get challenges appropriate for this grade level
    const gradeChallenges = getChallengesForGrade(grade);

    // Select a random challenge that hasn't been used yet
    const availableChallenges = gradeChallenges.filter(challenge =>
      !gameState.identifiedIssues.includes(challenge.id)
    );

    const randomChallenge = availableChallenges.length > 0
      ? availableChallenges[Math.floor(Math.random() * availableChallenges.length)]
      : gradeChallenges[Math.floor(Math.random() * gradeChallenges.length)];

    setGameState(prev => ({
      ...prev,
      currentChallenge: randomChallenge,
      selectedText: null,
      showFeedback: false,
      timeRemaining: getTimePerRound(grade),
      showHint: false,
      hintPenalty: 0,
      showExplanation: false
    }));
  };

  const handleTextSelection = () => {
    if (gameState.showFeedback) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const textElement = document.getElementById('challenge-text');
    if (!textElement || !textElement.contains(range.commonAncestorContainer)) return;

    // Calculate the start and end positions relative to the text content
    const textContent = gameState.currentChallenge?.text || '';
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(textElement);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const start = preSelectionRange.toString().length;

    const selectedText = range.toString();
    const end = start + selectedText.length;

    setGameState(prev => ({
      ...prev,
      selectedText: [start, end]
    }));
  };

  const handleIssueIdentification = (ruleId: string) => {
    if (!gameState.currentChallenge || !gameState.selectedText || gameState.showFeedback) return;

    const [start, end] = gameState.selectedText;

    // Check if the selection matches any issue in the current challenge
    const matchingIssue = gameState.currentChallenge.issues.find(issue => {
      // Allow for some flexibility in selection
      const selectionOverlapsIssue =
        (start <= issue.start && end > issue.start) || // Selection starts before issue and ends within or after
        (start >= issue.start && start < issue.end); // Selection starts within issue

      return selectionOverlapsIssue && issue.ruleId === ruleId;
    });

    if (matchingIssue) {
      // Correct identification
      const alreadyIdentified = gameState.identifiedIssues.includes(matchingIssue.id);

      if (!alreadyIdentified) {
        // Calculate points based on difficulty and time remaining
        const difficultyBonus = gameState.currentChallenge.difficulty * 2;
        const timeBonus = Math.floor(gameState.timeRemaining / 10);
        const points = 10 + difficultyBonus + timeBonus - gameState.hintPenalty;

        setGameState(prev => ({
          ...prev,
          identifiedIssues: [...prev.identifiedIssues, matchingIssue.id],
          score: prev.score + points,
          feedback: `Correct! You identified a ${getGrammarRuleName(ruleId)} issue. +${points} points!`,
          selectedText: null
        }));

        // Check if all issues in the challenge have been identified
        const updatedIdentifiedIssues = [...gameState.identifiedIssues, matchingIssue.id];
        const allIssuesIdentified = gameState.currentChallenge.issues.every(issue =>
          updatedIdentifiedIssues.includes(issue.id)
        );

        if (allIssuesIdentified) {
          // All issues identified, show feedback and prepare for next round
          setGameState(prev => ({
            ...prev,
            showFeedback: true,
            feedback: 'Great job! You found all the grammar issues in this text.'
          }));
        }
      } else {
        // Already identified this issue
        setGameState(prev => ({
          ...prev,
          feedback: 'You already identified this issue.',
          selectedText: null
        }));

        // Clear feedback after a short delay
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            feedback: ''
          }));
        }, 2000);
      }
    } else {
      // Incorrect identification
      setGameState(prev => ({
        ...prev,
        feedback: 'That\'s not quite right. Try again!',
        selectedText: null
      }));

      // Clear feedback after a short delay
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          feedback: ''
        }));
      }, 2000);
    }
  };

  const handleNextRound = () => {
    const newRound = gameState.round + 1;

    if (newRound >= gameState.totalRounds) {
      // Game completed
      setGameState(prev => ({
        ...prev,
        gameCompleted: true
      }));

      // Record activity in progress context
      const xpEarned = calculateXpEarned();
      recordActivity({
        gamePlayed: true,
        gameCompleted: true,
        xpEarned
      });
    } else {
      // Start next round
      setGameState(prev => ({
        ...prev,
        round: newRound
      }));
      startNewRound();
    }
  };

  const handleShowHint = () => {
    setGameState(prev => ({
      ...prev,
      showHint: true,
      hintPenalty: 5 // Penalty for using hint
    }));
  };

  const handleShowExplanation = () => {
    setGameState(prev => ({
      ...prev,
      showExplanation: true
    }));
  };

  // Calculate XP earned based on score and grade level
  const calculateXpEarned = () => {
    const baseXp = 25; // Base XP for completing the game
    const scoreMultiplier = 0.5; // Multiplier for score
    const gradeMultiplier = grade / 5; // Higher grades earn more XP

    return Math.round(baseXp + (gameState.score * scoreMultiplier * gradeMultiplier));
  };

  // Get grammar rule name by ID
  const getGrammarRuleName = (ruleId: string): string => {
    const rule = gameState.grammarRules.find(r => r.id === ruleId);
    return rule ? rule.name : 'Unknown';
  };

  // Generate a hint based on the current challenge and grade level
  const generateHint = (): string => {
    if (!gameState.currentChallenge) return '';

    // Get issues that haven't been identified yet
    const remainingIssues = gameState.currentChallenge.issues.filter(
      issue => !gameState.identifiedIssues.includes(issue.id)
    );

    if (remainingIssues.length === 0) return 'You\'ve found all the issues!';

    // Select a random remaining issue
    const randomIssue = remainingIssues[Math.floor(Math.random() * remainingIssues.length)];

    if (grade <= 6) {
      // Simple hint for younger students - tell them the type of error
      return `Look for a ${getGrammarRuleName(randomIssue.ruleId)} error.`;
    } else if (grade <= 8) {
      // More specific hint for middle grades - narrow down the location
      const textParts = gameState.currentChallenge.text.split(' ');
      let wordCount = 0;
      let issueWordIndex = 0;

      for (let i = 0; i < textParts.length; i++) {
        if (wordCount <= randomIssue.start && wordCount + textParts[i].length >= randomIssue.start) {
          issueWordIndex = i;
          break;
        }
        wordCount += textParts[i].length + 1; // +1 for the space
      }

      return `Look for a ${getGrammarRuleName(randomIssue.ruleId)} error around word ${issueWordIndex + 1}.`;
    } else {
      // Conceptual hint for higher grades - explain the rule but not the location
      const rule = gameState.grammarRules.find(r => r.id === randomIssue.ruleId);
      return rule ? `Remember: ${rule.description}` : 'Look carefully at the text for grammar issues.';
    }
  };

  // Render the challenge text with highlighted identified issues
  const renderChallengeText = () => {
    if (!gameState.currentChallenge) return null;

    const text = gameState.currentChallenge.text;
    const issues = gameState.currentChallenge.issues;

    // Sort issues by start position (to handle overlapping issues)
    const sortedIssues = [...issues].sort((a, b) => a.start - b.start);

    // Create an array of text segments with highlighting
    const segments: JSX.Element[] = [];
    let lastEnd = 0;

    sortedIssues.forEach((issue, index) => {
      // Add text before the issue
      if (issue.start > lastEnd) {
        segments.push(
          <span key={`text-${index}`}>
            {text.substring(lastEnd, issue.start)}
          </span>
        );
      }

      // Add the issue text with appropriate highlighting
      const isIdentified = gameState.identifiedIssues.includes(issue.id) || gameState.showFeedback;
      const isSelected = gameState.selectedText &&
        gameState.selectedText[0] <= issue.start &&
        gameState.selectedText[1] >= issue.end;

      let className = '';
      if (isIdentified) {
        className = 'bg-yellow-300 text-black px-1 rounded';
      } else if (isSelected) {
        className = 'bg-blue-300 text-black px-1 rounded';
      }

      segments.push(
        <span
          key={`issue-${issue.id}`}
          className={className}
          title={isIdentified ? getGrammarRuleName(issue.ruleId) : ''}
        >
          {text.substring(issue.start, issue.end)}
        </span>
      );

      lastEnd = issue.end;
    });

    // Add any remaining text
    if (lastEnd < text.length) {
      segments.push(
        <span key="text-end">
          {text.substring(lastEnd)}
        </span>
      );
    }

    return (
      <div
        id="challenge-text"
        className="text-lg text-white leading-relaxed p-4 bg-white/5 rounded-xl mb-4"
        onMouseUp={handleTextSelection}
      >
        {segments}
      </div>
    );
  };

  if (gameState.gameCompleted) {
    const xpEarned = calculateXpEarned();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">🔍 Language Detective Completed!</h2>
        <div className="text-center">
          <p className="text-xl text-gray-300 mb-4">Your Score:</p>
          <p className="text-4xl font-bold text-blue-400 mb-6">{gameState.score}</p>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((gameState.score / (gameState.totalRounds * 50)) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-gray-400 mb-4">
            {gameState.score >= gameState.totalRounds * 40 ? 'Grammar Master! 🏆' :
              gameState.score >= gameState.totalRounds * 30 ? 'Great language skills! 🌟' :
                gameState.score >= gameState.totalRounds * 20 ? 'Good effort! 👍' : 'Keep practicing grammar! 💪'}
          </p>
          <p className="text-green-400 font-semibold">+ {xpEarned} XP earned!</p>
          <p className="text-gray-300 mt-4 text-sm">
            You've learned how to identify and correct grammar issues in text!
            {grade >= 9 && ' This demonstrates the AI concept of natural language processing and grammar rule systems.'}
          </p>
        </div>
      </motion.div>
    );
  }

  if (!gameState.currentChallenge) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Language Detective</h2>
        <div className="text-right">
          <p className="text-sm text-gray-400">Round {gameState.round + 1} of {gameState.totalRounds}</p>
          <p className="text-lg font-semibold text-blue-400">Score: {gameState.score}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-white text-lg">Find and identify grammar issues in the text</p>
          <div className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
            Time: {gameState.timeRemaining}s
          </div>
        </div>

        {/* Challenge Information */}
        <div className="bg-white/5 p-4 rounded-xl mb-6">
          <h3 className="text-xl font-bold text-white mb-3">Grammar Challenge</h3>
          <p className="text-gray-300 mb-2">
            Category: {gameState.currentChallenge.category}
          </p>
          <p className="text-gray-300 mb-2">
            Difficulty: {gameState.currentChallenge ? Array(gameState.currentChallenge.difficulty).fill('★').join('') : ''}
          </p>
          <p className="text-gray-300 mb-4">
            Issues Found: {gameState.currentChallenge ? gameState.identifiedIssues.filter(id =>
              gameState.currentChallenge?.issues.some(issue => issue.id === id)
            ).length : 0} / {gameState.currentChallenge?.issues.length || 0}
          </p>

          {/* AI Concept Explanation for higher grades */}
          {grade >= 9 && (
            <div className="mt-3 text-xs text-gray-400 bg-white/5 p-2 rounded-lg">
              <p>AI Concept: Natural Language Processing (NLP) systems analyze text to identify patterns, grammar rules, and linguistic structures.</p>
            </div>
          )}
        </div>

        {/* Challenge Text */}
        {renderChallengeText()}

        {/* Feedback */}
        {gameState.feedback && !gameState.showFeedback && (
          <div className="mb-4 p-3 bg-white/10 rounded-lg text-center">
            <p className="text-white">{gameState.feedback}</p>
          </div>
        )}

        {/* Grammar Rules Selection */}
        {!gameState.showFeedback && (
          <div className="mb-6">
            <h4 className="text-white font-semibold mb-3">Select the grammar rule that applies to your selection:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {gameState.grammarRules.map(rule => (
                <motion.button
                  key={rule.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-2 rounded-lg text-left text-sm ${gameState.selectedText ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 cursor-not-allowed'} transition-colors`}
                  onClick={() => handleIssueIdentification(rule.id)}
                  disabled={!gameState.selectedText}
                >
                  {rule.name}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {!gameState.showFeedback && (
          <div className="p-3 bg-white/5 rounded-lg mb-4">
            <p className="text-white text-sm">
              {grade <= 6 ? (
                "Select text with grammar mistakes, then click the rule that was broken."
              ) : grade <= 8 ? (
                "Identify grammar issues by selecting the problematic text and choosing the appropriate grammar rule that's being violated."
              ) : (
                "Analyze the text for grammatical errors, select the problematic portions, and classify them according to the appropriate linguistic rule being violated."
              )}
            </p>
          </div>
        )}

        {/* Feedback and Next Button */}
        {gameState.showFeedback ? (
          <div className="text-center">
            <p className="text-white mb-4">{gameState.feedback}</p>

            {!gameState.showExplanation && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors mr-4"
                onClick={handleShowExplanation}
              >
                Show Explanations
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleNextRound}
            >
              {gameState.round < gameState.totalRounds - 1 ? 'Next Challenge' : 'Finish Game'}
            </motion.button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            {!gameState.showHint && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-transparent border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-500/10 transition-colors"
                onClick={handleShowHint}
              >
                Get Hint (-5 points)
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => {
                setGameState(prev => ({
                  ...prev,
                  showFeedback: true,
                  feedback: 'Let\'s see all the grammar issues in this text.'
                }));
              }}
            >
              Show All Issues
            </motion.button>
          </div>
        )}

        {/* Hint */}
        {gameState.showHint && !gameState.showFeedback && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-yellow-300 text-sm">
              <span className="font-bold">Hint:</span> {generateHint()}
            </p>
          </div>
        )}

        {/* Explanations */}
        {gameState.showExplanation && (
          <div className="mt-6 p-4 bg-white/5 rounded-xl">
            <h4 className="text-white font-semibold mb-3">Grammar Issue Explanations:</h4>
            <div className="space-y-3">
              {gameState.currentChallenge.issues.map(issue => {
                const rule = gameState.grammarRules.find(r => r.id === issue.ruleId);

                return (
                  <div key={issue.id} className="p-3 bg-white/5 rounded-lg">
                    <p className="text-blue-300 font-medium mb-1">{rule?.name}</p>
                    <p className="text-gray-300 text-sm mb-2">{issue.explanation}</p>
                    <div className="flex flex-col sm:flex-row gap-2 text-sm">
                      <div className="bg-red-900/30 p-2 rounded">
                        <span className="text-gray-400">Incorrect: </span>
                        <span className="text-white">{issue.incorrectText}</span>
                      </div>
                      <div className="bg-green-900/30 p-2 rounded">
                        <span className="text-gray-400">Correct: </span>
                        <span className="text-white">{issue.correctText}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional NLP explanation for higher grades */}
            {grade >= 8 && (
              <div className="mt-4 p-3 bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-300">
                  <span className="font-bold">AI Connection:</span> Natural Language Processing (NLP) systems use rule-based approaches and machine learning to identify grammar patterns.
                  {grade >= 9 ? ' Advanced NLP models can detect context-dependent grammar issues and suggest corrections based on statistical patterns learned from vast text corpora.' : ''}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LanguageDetective;