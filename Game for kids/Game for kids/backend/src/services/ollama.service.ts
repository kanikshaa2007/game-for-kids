import axios from 'axios';
import { OllamaRequest, OllamaResponse, Question } from '../types';

export class OllamaService {
  private baseUrl: string;
  private model: string;
  private timeout: number;

  constructor(baseUrl?: string, model?: string) {
    this.baseUrl = baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = model || process.env.OLLAMA_MODEL || 'llama2';
    this.timeout = 30000; // 30 seconds
  }

  /**
   * Generate text using Ollama
   */
  async generate(prompt: string): Promise<string> {
    try {
      const request: OllamaRequest = {
        model: this.model,
        prompt,
        stream: false,
      };

      const response = await axios.post<OllamaResponse>(
        `${this.baseUrl}/api/generate`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: this.timeout,
        }
      );

      return response.data.response.trim();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Ollama request timed out');
        }
        if (error.response?.status === 404) {
          throw new Error('Ollama endpoint not found. Is Ollama running?');
        }
        throw new Error(`Ollama API error: ${error.message}`);
      }
      throw new Error('Failed to generate with Ollama');
    }
  }

  /**
   * Generate math questions for kids
   */
  async generateMathQuestions(difficulty: string, count: number = 5): Promise<Question[]> {
    const prompt = this.buildMathPrompt(difficulty, count);
    const response = await this.generate(prompt);
    return this.parseMathQuestions(response, difficulty);
  }

  /**
   * Generate missing letters questions
   */
  async generateLettersQuestions(difficulty: string, count: number = 5): Promise<Question[]> {
    const prompt = this.buildLettersPrompt(difficulty, count);
    const response = await this.generate(prompt);
    return this.parseLettersQuestions(response, difficulty);
  }

  /**
   * Generate rhyme/pattern questions
   */
  async generateRhymeQuestions(difficulty: string, count: number = 5): Promise<Question[]> {
    const prompt = this.buildRhymePrompt(difficulty, count);
    const response = await this.generate(prompt);
    return this.parseRhymeQuestions(response, difficulty);
  }

  /**
   * Check if Ollama is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/api/tags`, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Build prompt for math questions
   */
  private buildMathPrompt(difficulty: string, count: number): string {
    const difficultyInfo = {
      easy: 'single digit addition and subtraction (1-10)',
      medium: 'double digit addition and subtraction (10-50), simple multiplication (1-5)',
      hard: 'double digit operations (10-100), multiplication (1-10), simple division',
    };

    return `Generate exactly ${count} math questions for kids ages 5-10.
Difficulty: ${difficulty} - ${difficultyInfo[difficulty as keyof typeof difficultyInfo]}

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

  /**
   * Build prompt for missing letters questions
   */
  private buildLettersPrompt(difficulty: string, count: number): string {
    const difficultyInfo = {
      easy: 'simple 3-letter words (cat, dog, sun)',
      medium: '4-5 letter common words (apple, house, tree)',
      hard: '6+ letter words and compound words (elephant, butterfly)',
    };

    return `Generate exactly ${count} missing letters word puzzles for kids.
Difficulty: ${difficulty} - ${difficultyInfo[difficulty as keyof typeof difficultyInfo]}

Format each question as JSON on a separate line:
{"question": "D _ G", "options": ["A", "O", "U", "E"], "answer": "O", "fullWord": "DOG"}

Rules:
- Show word with ONE missing letter as underscore
- Options should be single letters
- Include the full word in the response
- Use common words kids know

Output ONLY the JSON lines, nothing else.`;
  }

  /**
   * Build prompt for rhyme questions
   */
  private buildRhymePrompt(difficulty: string, count: number): string {
    const difficultyInfo = {
      easy: 'simple rhyming words (cat/bat, sun/fun)',
      medium: 'common rhyming pairs (tree/bee, star/car)',
      hard: 'multi-syllable rhymes (butterfly/catch the eye)',
    };

    return `Generate exactly ${count} rhyme completion questions for kids.
Difficulty: ${difficulty} - ${difficultyInfo[difficulty as keyof typeof difficultyInfo]}

Format each question as JSON on a separate line:
{"question": "Cat rhymes with ___", "options": ["Dog", "Bat", "Fish", "Bird"], "answer": "Bat"}

Rules:
- Use simple, familiar words
- Make incorrect options clearly not rhyming
- Keep it fun and engaging

Output ONLY the JSON lines, nothing else.`;
  }

  /**
   * Parse math questions from AI response
   */
  private parseMathQuestions(response: string, difficulty: string): Question[] {
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
            gameType: 'math',
          });
        }
      } catch {
        // Skip invalid JSON lines
      }
    }

    return questions;
  }

  /**
   * Parse letters questions from AI response
   */
  private parseLettersQuestions(response: string, difficulty: string): Question[] {
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
            gameType: 'letters',
          });
        }
      } catch {
        // Skip invalid JSON lines
      }
    }

    return questions;
  }

  /**
   * Parse rhyme questions from AI response
   */
  private parseRhymeQuestions(response: string, difficulty: string): Question[] {
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
            gameType: 'rhyme',
          });
        }
      } catch {
        // Skip invalid JSON lines
      }
    }

    return questions;
  }
}

export const ollamaService = new OllamaService();
