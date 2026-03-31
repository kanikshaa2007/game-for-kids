import axios from 'axios';
import { ClaudeRequest, Question } from '../types';

export class ClaudeService {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.CLAUDE_API_KEY || '';
    this.baseUrl = 'https://api.anthropic.com/v1';
    this.model = 'claude-3-haiku-20240307';
  }

  /**
   * Generate text using Claude API
   */
  async generate(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Claude API key not configured');
    }

    try {
      const request: ClaudeRequest = {
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1024,
      };

      const response = await axios.post(`${this.baseUrl}/messages`, request, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        timeout: 30000,
      });

      const content = response.data.content?.[0]?.text;
      if (!content) {
        throw new Error('Empty response from Claude');
      }

      return content.trim();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid Claude API key');
        }
        if (error.response?.status === 429) {
          throw new Error('Claude API rate limit exceeded');
        }
        throw new Error(`Claude API error: ${error.message}`);
      }
      throw new Error('Failed to generate with Claude');
    }
  }

  /**
   * Generate math questions using Claude
   */
  async generateMathQuestions(difficulty: string, count: number = 5): Promise<Question[]> {
    const prompt = this.buildMathPrompt(difficulty, count);
    const response = await this.generate(prompt);
    return this.parseQuestions(response, difficulty, 'math');
  }

  /**
   * Generate missing letters questions using Claude
   */
  async generateLettersQuestions(difficulty: string, count: number = 5): Promise<Question[]> {
    const prompt = this.buildLettersPrompt(difficulty, count);
    const response = await this.generate(prompt);
    return this.parseQuestions(response, difficulty, 'letters');
  }

  /**
   * Generate rhyme questions using Claude
   */
  async generateRhymeQuestions(difficulty: string, count: number = 5): Promise<Question[]> {
    const prompt = this.buildRhymePrompt(difficulty, count);
    const response = await this.generate(prompt);
    return this.parseQuestions(response, difficulty, 'rhyme');
  }

  /**
   * Generate image recognition question (placeholder)
   */
  async generateImageQuestion(difficulty: string): Promise<Question | null> {
    // Since we don't have actual image recognition, generate a descriptive question
    const imageDescriptions = {
      easy: [
        { desc: '🍎', answer: 'Apple', options: ['Apple', 'Ball', 'Cat', 'Dog'] },
        { desc: '🐱', answer: 'Cat', options: ['Dog', 'Cat', 'Bird', 'Fish'] },
        { desc: '⭐', answer: 'Star', options: ['Moon', 'Sun', 'Star', 'Cloud'] },
      ],
      medium: [
        { desc: '🚗', answer: 'Car', options: ['Bus', 'Train', 'Car', 'Bike'] },
        { desc: '🌈', answer: 'Rainbow', options: ['Cloud', 'Rain', 'Rainbow', 'Snow'] },
        { desc: '🐘', answer: 'Elephant', options: ['Lion', 'Elephant', 'Giraffe', 'Zebra'] },
      ],
      hard: [
        { desc: '🦋', answer: 'Butterfly', options: ['Bee', 'Butterfly', 'Dragonfly', 'Ladybug'] },
        { desc: '🏰', answer: 'Castle', options: ['House', 'Castle', 'Tower', 'Palace'] },
        { desc: '🎢', answer: 'Roller coaster', options: ['Slide', 'Swing', 'Roller coaster', 'Merry-go-round'] },
      ],
    };

    const items = imageDescriptions[difficulty as keyof typeof imageDescriptions];
    const item = items[Math.floor(Math.random() * items.length)];

    return {
      id: Math.random().toString(36).substr(2, 9),
      question: `What is this? ${item.desc}`,
      options: item.options,
      correctAnswer: item.answer,
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      gameType: 'image',
    };
  }

  /**
   * Check if Claude API is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  private buildMathPrompt(difficulty: string, count: number): string {
    const difficultyInfo: Record<string, string> = {
      easy: 'single digit addition and subtraction (1-10)',
      medium: 'double digit addition and subtraction (10-50), simple multiplication (1-5)',
      hard: 'double digit operations (10-100), multiplication (1-10), simple division',
    };

    return `Generate exactly ${count} math questions for kids ages 5-10.
Difficulty: ${difficulty} - ${difficultyInfo[difficulty]}

Format each question as JSON on a separate line:
{"question": "What is 5 + 3?", "options": ["7", "8", "9", "10"], "answer": "8"}

Rules:
- Keep numbers age-appropriate
- Make options clearly different
- Answer must be one of the options
- Use simple language
- No negative results

Output ONLY the JSON lines, nothing else.`;
  }

  private buildLettersPrompt(difficulty: string, count: number): string {
    const difficultyInfo: Record<string, string> = {
      easy: 'simple 3-letter words (cat, dog, sun)',
      medium: '4-5 letter common words (apple, house, tree)',
      hard: '6+ letter words and compound words (elephant, butterfly)',
    };

    return `Generate exactly ${count} missing letters word puzzles for kids.
Difficulty: ${difficulty} - ${difficultyInfo[difficulty]}

Format each question as JSON on a separate line:
{"question": "D _ G", "options": ["A", "O", "U", "E"], "answer": "O", "fullWord": "DOG"}

Rules:
- Show word with ONE missing letter as underscore
- Options should be single letters
- Include the full word in the response
- Use common words kids know

Output ONLY the JSON lines, nothing else.`;
  }

  private buildRhymePrompt(difficulty: string, count: number): string {
    const difficultyInfo: Record<string, string> = {
      easy: 'simple rhyming words (cat/bat, sun/fun)',
      medium: 'common rhyming pairs (tree/bee, star/car)',
      hard: 'multi-syllable rhymes (butterfly/catch the eye)',
    };

    return `Generate exactly ${count} rhyme completion questions for kids.
Difficulty: ${difficulty} - ${difficultyInfo[difficulty]}

Format each question as JSON on a separate line:
{"question": "Cat rhymes with ___", "options": ["Dog", "Bat", "Fish", "Bird"], "answer": "Bat"}

Rules:
- Use simple, familiar words
- Make incorrect options clearly not rhyming
- Keep it fun and engaging

Output ONLY the JSON lines, nothing else.`;
  }

  private parseQuestions(response: string, difficulty: string, gameType: 'math' | 'letters' | 'rhyme'): Question[] {
    const questions: Question[] = [];
    const lines = response.split('\n');

    for (const line of lines) {
      try {
        const trimmed = line.trim();
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
          const parsed = JSON.parse(trimmed);
          questions.push({
            id: Math.random().toString(36).substr(2, 9),
            question: parsed.question,
            options: parsed.options || [],
            correctAnswer: parsed.answer || parsed.correctAnswer,
            difficulty: difficulty as 'easy' | 'medium' | 'hard',
            gameType,
          });
        }
      } catch {
        // Skip invalid JSON lines
      }
    }

    return questions;
  }
}

export const claudeService = new ClaudeService();
