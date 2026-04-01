import Groq from 'groq-sdk';
import { logger } from '../server';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface ChatbotResponse {
  success: boolean;
  response?: string;
  error?: string;
}

/**
 * Process a user question using Groq API
 * @param question User's question
 * @returns Chatbot response
 */
export const processQuestion = async (question: string): Promise<ChatbotResponse> => {
  try {
    // For development purposes, use a mock response if API key is not configured
    if (!process.env.GROQ_API_KEY) {
      logger.warn('Groq API key not configured, using mock response');
      
      // Simple mock response for basic questions
      if (question.toLowerCase().includes('hi') || question.toLowerCase().includes('hello')) {
        return {
          success: true,
          response: "Hello there! 👋 I'm Chatty, your friendly learning assistant. How can I help you today?"
        };
      } else if (question.toLowerCase().includes('name')) {
        return {
          success: true,
          response: "I'm Chatty, your friendly learning assistant for GameLearn! What would you like to learn about today?"
        };
      } else if (question.toLowerCase().includes('2+2') || question.toLowerCase().includes('2 + 2')) {
        return {
          success: true,
          response: "2 + 2 = 4! That's a great math question. Would you like to learn more about addition or try a more challenging math problem?"
        };
      } else {
        // Default mock response
        return {
          success: true,
          response: `I'd be happy to help with "${question}"! As your learning assistant, I'm here to support your educational journey. What specific aspect would you like to explore further?`
        };
      }
    }

    // System prompt to define Chatty's personality and behavior
    const systemPrompt = `You are Chatty, a friendly and knowledgeable AI learning assistant for GameLearn, an educational gaming platform for students in grades 5-10. Your personality traits:

- Kind, encouraging, and patient
- Factual and educational, but conversational
- Enthusiastic about learning and games
- Supportive of student growth

Your capabilities:
- Answer questions about various school subjects (math, science, language arts, social studies, etc.)
- Explain concepts in age-appropriate ways for grades 5-10
- Provide study tips and learning strategies
- Help with homework and assignments
- Discuss educational games and learning techniques
- Offer encouragement and motivation

Contact Information to provide when needed:
- Phone: +1-800-GAMELEARN
- Email: support@gamelearn.com
- Available 24/7

If you cannot answer a question or if it's outside your educational scope, politely direct the user to contact customer care using the above information.

Always be encouraging and end responses with enthusiasm for learning!`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: question
        }
      ],
      model: 'llama3-8b-8192', // Using Llama 3 8B model
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      stream: false
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response generated from Groq API');
    }

    return {
      success: true,
      response: response.trim()
    };
  } catch (error: any) {
    logger.error('Error in chatbot service:', error);
    
    // Return fallback response for any errors
    return {
      success: true,
      response: `I'm sorry, I'm having trouble processing your question right now. 😔\n\nFor immediate assistance, please contact our customer care team:\n\n📞 Phone: +1-800-GAMELEARN\n📧 Email: support@gamelearn.com\n\nOur friendly team is available 24/7 to help you with any questions or concerns!\n\nDon't worry, we'll get you back to learning and having fun in no time! 🚀`
    };
  }
};

/**
 * Validate and sanitize user input
 * @param question User's question
 * @returns Sanitized question or null if invalid
 */
export const validateQuestion = (question: string): string | null => {
  if (!question || typeof question !== 'string') {
    return null;
  }

  // Trim and check length
  const trimmed = question.trim();
  if (trimmed.length === 0 || trimmed.length > 1000) {
    return null;
  }

  // Basic sanitization - remove potentially harmful content
  const sanitized = trimmed
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .trim();

  return sanitized.length > 0 ? sanitized : null;
};