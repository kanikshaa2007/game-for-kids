import { Question } from '../types';
import { ollamaService } from './ollama.service';
import { claudeService } from './claude.service';

/**
 * Service for generating questions with AI fallback logic
 * Tries Ollama first, falls back to Claude if unavailable
 */
export class QuestionGeneratorService {
  /**
   * Generate questions for a specific game type
   */
  async generateQuestions(
    gameType: 'math' | 'letters' | 'image' | 'rhyme',
    difficulty: 'easy' | 'medium' | 'hard',
    count: number = 5
  ): Promise<Question[]> {
    // For image questions, use the dedicated method
    if (gameType === 'image') {
      return this.generateImageQuestions(difficulty, count);
    }

    // Try Ollama first
    const isOllamaAvailable = await ollamaService.isAvailable();

    if (isOllamaAvailable) {
      try {
        const questions = await this.generateWithOllama(gameType, difficulty, count);
        if (questions.length > 0) {
          console.log(`✅ Generated ${questions.length} questions using Ollama`);
          return questions;
        }
      } catch (error) {
        console.warn('Ollama failed, falling back to Claude:', error);
      }
    }

    // Fall back to Claude
    if (claudeService.isConfigured()) {
      try {
        const questions = await this.generateWithClaude(gameType, difficulty, count);
        if (questions.length > 0) {
          console.log(`✅ Generated ${questions.length} questions using Claude`);
          return questions;
        }
      } catch (error) {
        console.error('Claude also failed:', error);
      }
    }

    // Final fallback: use built-in questions
    console.warn('⚠️  Using fallback built-in questions');
    return this.getBuiltInQuestions(gameType, difficulty, count);
  }

  /**
   * Generate questions using Ollama
   */
  private async generateWithOllama(
    gameType: 'math' | 'letters' | 'rhyme',
    difficulty: string,
    count: number
  ): Promise<Question[]> {
    switch (gameType) {
      case 'math':
        return ollamaService.generateMathQuestions(difficulty, count);
      case 'letters':
        return ollamaService.generateLettersQuestions(difficulty, count);
      case 'rhyme':
        return ollamaService.generateRhymeQuestions(difficulty, count);
      default:
        return [];
    }
  }

  /**
   * Generate questions using Claude
   */
  private async generateWithClaude(
    gameType: 'math' | 'letters' | 'rhyme',
    difficulty: string,
    count: number
  ): Promise<Question[]> {
    switch (gameType) {
      case 'math':
        return claudeService.generateMathQuestions(difficulty, count);
      case 'letters':
        return claudeService.generateLettersQuestions(difficulty, count);
      case 'rhyme':
        return claudeService.generateRhymeQuestions(difficulty, count);
      default:
        return [];
    }
  }

  /**
   * Generate image recognition questions
   */
  private async generateImageQuestions(
    difficulty: string,
    count: number
  ): Promise<Question[]> {
    const questions: Question[] = [];

    // Try Claude first for image questions
    if (claudeService.isConfigured()) {
      try {
        for (let i = 0; i < count; i++) {
          const question = await claudeService.generateImageQuestion(difficulty);
          if (question) {
            questions.push(question);
          }
        }
      } catch (error) {
        console.warn('Claude image question generation failed:', error);
      }
    }

    // Fill with built-in if needed
    while (questions.length < count) {
      const builtIn = this.getBuiltInImageQuestion(difficulty);
      if (builtIn) {
        questions.push(builtIn);
      }
    }

    return questions;
  }

  /**
   * Get built-in questions as final fallback
   */
  private getBuiltInQuestions(
    gameType: 'math' | 'letters' | 'rhyme',
    difficulty: string,
    count: number
  ): Question[] {
    const builtInQuestions: Record<string, Question[]> = {
      'math-easy': [
        { id: '1', question: 'What is 2 + 3?', options: ['4', '5', '6', '7'], correctAnswer: '5', difficulty: 'easy', gameType: 'math' },
        { id: '2', question: 'What is 5 - 2?', options: ['2', '3', '4', '1'], correctAnswer: '3', difficulty: 'easy', gameType: 'math' },
        { id: '3', question: 'What is 4 + 1?', options: ['5', '6', '4', '3'], correctAnswer: '5', difficulty: 'easy', gameType: 'math' },
        { id: '4', question: 'What is 7 - 3?', options: ['3', '4', '5', '2'], correctAnswer: '4', difficulty: 'easy', gameType: 'math' },
        { id: '5', question: 'What is 6 + 2?', options: ['7', '8', '9', '6'], correctAnswer: '8', difficulty: 'easy', gameType: 'math' },
      ],
      'math-medium': [
        { id: '1', question: 'What is 15 + 10?', options: ['20', '25', '30', '35'], correctAnswer: '25', difficulty: 'medium', gameType: 'math' },
        { id: '2', question: 'What is 30 - 15?', options: ['10', '15', '20', '25'], correctAnswer: '15', difficulty: 'medium', gameType: 'math' },
        { id: '3', question: 'What is 3 × 4?', options: ['10', '12', '14', '16'], correctAnswer: '12', difficulty: 'medium', gameType: 'math' },
        { id: '4', question: 'What is 25 + 25?', options: ['40', '45', '50', '55'], correctAnswer: '50', difficulty: 'medium', gameType: 'math' },
        { id: '5', question: 'What is 40 - 20?', options: ['15', '20', '25', '30'], correctAnswer: '20', difficulty: 'medium', gameType: 'math' },
      ],
      'math-hard': [
        { id: '1', question: 'What is 45 + 37?', options: ['72', '82', '92', '78'], correctAnswer: '82', difficulty: 'hard', gameType: 'math' },
        { id: '2', question: 'What is 75 - 28?', options: ['43', '47', '53', '57'], correctAnswer: '47', difficulty: 'hard', gameType: 'math' },
        { id: '3', question: 'What is 7 × 8?', options: ['54', '56', '58', '64'], correctAnswer: '56', difficulty: 'hard', gameType: 'math' },
        { id: '4', question: 'What is 96 ÷ 8?', options: ['10', '11', '12', '14'], correctAnswer: '12', difficulty: 'hard', gameType: 'math' },
        { id: '5', question: 'What is 54 + 29?', options: ['73', '83', '93', '81'], correctAnswer: '83', difficulty: 'hard', gameType: 'math' },
      ],
      'letters-easy': [
        { id: '1', question: 'C _ T', options: ['A', 'O', 'U', 'E'], correctAnswer: 'A', difficulty: 'easy', gameType: 'letters' },
        { id: '2', question: 'D _ G', options: ['A', 'O', 'U', 'I'], correctAnswer: 'O', difficulty: 'easy', gameType: 'letters' },
        { id: '3', question: 'S _ N', options: ['A', 'O', 'U', 'E'], correctAnswer: 'U', difficulty: 'easy', gameType: 'letters' },
        { id: '4', question: 'B _ T', options: ['A', 'O', 'U', 'I'], correctAnswer: 'A', difficulty: 'easy', gameType: 'letters' },
        { id: '5', question: 'H _ T', options: ['A', 'O', 'U', 'E'], correctAnswer: 'A', difficulty: 'easy', gameType: 'letters' },
      ],
      'letters-medium': [
        { id: '1', question: 'A P P _ E', options: ['L', 'I', 'O', 'E'], correctAnswer: 'L', difficulty: 'medium', gameType: 'letters' },
        { id: '2', question: 'H O _ S E', options: ['U', 'A', 'O', 'I'], correctAnswer: 'U', difficulty: 'medium', gameType: 'letters' },
        { id: '3', question: 'T R _ E', options: ['A', 'O', 'I', 'E'], correctAnswer: 'E', difficulty: 'medium', gameType: 'letters' },
        { id: '4', question: 'B O _ K', options: ['A', 'O', 'U', 'I'], correctAnswer: 'O', difficulty: 'medium', gameType: 'letters' },
        { id: '5', question: 'M I _ K', options: ['A', 'O', 'L', 'E'], correctAnswer: 'L', difficulty: 'medium', gameType: 'letters' },
      ],
      'letters-hard': [
        { id: '1', question: 'E L E P H _ N T', options: ['A', 'O', 'I', 'E'], correctAnswer: 'A', difficulty: 'hard', gameType: 'letters' },
        { id: '2', question: 'B U T T E R F L _', options: ['A', 'O', 'Y', 'I'], correctAnswer: 'Y', difficulty: 'hard', gameType: 'letters' },
        { id: '3', question: 'G I R A F F _', options: ['A', 'O', 'E', 'I'], correctAnswer: 'E', difficulty: 'hard', gameType: 'letters' },
        { id: '4', question: 'U M B R E L _ A', options: ['L', 'I', 'O', 'A'], correctAnswer: 'L', difficulty: 'hard', gameType: 'letters' },
        { id: '5', question: 'K A N G A R _ O', options: ['L', 'I', 'O', 'U'], correctAnswer: 'O', difficulty: 'hard', gameType: 'letters' },
      ],
      'rhyme-easy': [
        { id: '1', question: 'Cat rhymes with ___', options: ['Dog', 'Bat', 'Fish', 'Bird'], correctAnswer: 'Bat', difficulty: 'easy', gameType: 'rhyme' },
        { id: '2', question: 'Sun rhymes with ___', options: ['Moon', 'Fun', 'Sky', 'Blue'], correctAnswer: 'Fun', difficulty: 'easy', gameType: 'rhyme' },
        { id: '3', question: 'Hat rhymes with ___', options: ['Shoe', 'Cat', 'Car', 'Ball'], correctAnswer: 'Cat', difficulty: 'easy', gameType: 'rhyme' },
        { id: '4', question: 'Bed rhymes with ___', options: ['Table', 'Red', 'Chair', 'Lamp'], correctAnswer: 'Red', difficulty: 'easy', gameType: 'rhyme' },
        { id: '5', question: 'Fish rhymes with ___', options: ['Dog', 'Dish', 'Cat', 'Bird'], correctAnswer: 'Dish', difficulty: 'easy', gameType: 'rhyme' },
      ],
      'rhyme-medium': [
        { id: '1', question: 'Tree rhymes with ___', options: ['Flower', 'Bee', 'Leaf', 'Grass'], correctAnswer: 'Bee', difficulty: 'medium', gameType: 'rhyme' },
        { id: '2', question: 'Star rhymes with ___', options: ['Moon', 'Sky', 'Car', 'Sun'], correctAnswer: 'Car', difficulty: 'medium', gameType: 'rhyme' },
        { id: '3', question: 'Book rhymes with ___', options: ['Read', 'Look', 'Page', 'Word'], correctAnswer: 'Look', difficulty: 'medium', gameType: 'rhyme' },
        { id: '4', question: 'Rain rhymes with ___', options: ['Snow', 'Pain', 'Cloud', 'Wind'], correctAnswer: 'Pain', difficulty: 'medium', gameType: 'rhyme' },
        { id: '5', question: 'Light rhymes with ___', options: ['Dark', 'Bright', 'Sun', 'Moon'], correctAnswer: 'Bright', difficulty: 'medium', gameType: 'rhyme' },
      ],
      'rhyme-hard': [
        { id: '1', question: 'Butterfly rhymes with ___', options: ['Dragonfly', 'Catch the eye', 'Flying high', 'All of the above'], correctAnswer: 'All of the above', difficulty: 'hard', gameType: 'rhyme' },
        { id: '2', question: 'Happy rhymes with ___', options: ['Sad', 'Snappy', 'Angry', 'Mad'], correctAnswer: 'Snappy', difficulty: 'hard', gameType: 'rhyme' },
        { id: '3', question: 'Morning rhymes with ___', options: ['Night', 'Warning', 'Evening', 'Day'], correctAnswer: 'Warning', difficulty: 'hard', gameType: 'rhyme' },
        { id: '4', question: 'Bunny rhymes with ___', options: ['Funny', 'Money', 'Both', 'None'], correctAnswer: 'Both', difficulty: 'hard', gameType: 'rhyme' },
        { id: '5', question: 'Candy rhymes with ___', options: ['Sweet', 'Dandy', 'Sugar', 'Treat'], correctAnswer: 'Dandy', difficulty: 'hard', gameType: 'rhyme' },
      ],
    };

    const key = `${gameType}-${difficulty}`;
    const questions = builtInQuestions[key] || [];

    // Shuffle and return requested count
    return questions.sort(() => Math.random() - 0.5).slice(0, count);
  }

  /**
   * Get built-in image question
   */
  private getBuiltInImageQuestion(difficulty: string): Question | null {
    const imageQuestions: Record<string, Question[]> = {
      easy: [
        { id: '1', question: 'What is this? 🍎', options: ['Apple', 'Ball', 'Cat', 'Dog'], correctAnswer: 'Apple', difficulty: 'easy', gameType: 'image' },
        { id: '2', question: 'What is this? 🐱', options: ['Dog', 'Cat', 'Bird', 'Fish'], correctAnswer: 'Cat', difficulty: 'easy', gameType: 'image' },
        { id: '3', question: 'What is this? ⭐', options: ['Moon', 'Sun', 'Star', 'Cloud'], correctAnswer: 'Star', difficulty: 'easy', gameType: 'image' },
      ],
      medium: [
        { id: '1', question: 'What is this? 🚗', options: ['Bus', 'Train', 'Car', 'Bike'], correctAnswer: 'Car', difficulty: 'medium', gameType: 'image' },
        { id: '2', question: 'What is this? 🌈', options: ['Cloud', 'Rain', 'Rainbow', 'Snow'], correctAnswer: 'Rainbow', difficulty: 'medium', gameType: 'image' },
        { id: '3', question: 'What is this? 🐘', options: ['Lion', 'Elephant', 'Giraffe', 'Zebra'], correctAnswer: 'Elephant', difficulty: 'medium', gameType: 'image' },
      ],
      hard: [
        { id: '1', question: 'What is this? 🦋', options: ['Bee', 'Butterfly', 'Dragonfly', 'Ladybug'], correctAnswer: 'Butterfly', difficulty: 'hard', gameType: 'image' },
        { id: '2', question: 'What is this? 🏰', options: ['House', 'Castle', 'Tower', 'Palace'], correctAnswer: 'Castle', difficulty: 'hard', gameType: 'image' },
        { id: '3', question: 'What is this? 🎢', options: ['Slide', 'Swing', 'Roller coaster', 'Merry-go-round'], correctAnswer: 'Roller coaster', difficulty: 'hard', gameType: 'image' },
      ],
    };

    const questions = imageQuestions[difficulty] || [];
    return questions[Math.floor(Math.random() * questions.length)] || null;
  }
}

export const questionGeneratorService = new QuestionGeneratorService();
