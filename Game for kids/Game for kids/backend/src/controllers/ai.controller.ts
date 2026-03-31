import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { questionGeneratorService } from '../services/question-generator.service';
import { claudeService } from '../services/claude.service';
import { ollamaService } from '../services/ollama.service';
import { ApiResponse } from '../types';

/**
 * Generate content using AI (Ollama or Claude)
 */
export async function generate(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({
        success: false,
        error: 'Prompt is required',
      } as ApiResponse);
      return;
    }

    // Check Ollama availability first
    const isOllamaAvailable = await ollamaService.isAvailable();

    let response: string;

    if (isOllamaAvailable) {
      response = await ollamaService.generate(prompt);
    } else if (claudeService.isConfigured()) {
      response = await claudeService.generate(prompt);
    } else {
      res.status(503).json({
        success: false,
        error: 'No AI service available. Please configure Ollama or Claude API.',
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        response,
        source: isOllamaAvailable ? 'ollama' : 'claude',
      },
    } as ApiResponse<{ response: string; source: string }>);
  } catch (error) {
    console.error('AI generate error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate content',
    } as ApiResponse);
  }
}

/**
 * Generate questions for a specific game type
 */
export async function generateQuestions(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { gameType, difficulty = 'easy', count = 5 } = req.body;

    if (!gameType || !['math', 'letters', 'image', 'rhyme'].includes(gameType)) {
      res.status(400).json({
        success: false,
        error: 'Invalid game type',
      } as ApiResponse);
      return;
    }

    const questions = await questionGeneratorService.generateQuestions(
      gameType,
      difficulty,
      count
    );

    if (questions.length === 0) {
      res.status(500).json({
        success: false,
        error: 'Failed to generate questions',
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        questions,
        count: questions.length,
        gameType,
        difficulty,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Generate questions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate questions',
    } as ApiResponse);
  }
}

/**
 * Check AI service status
 */
export async function checkStatus(
  _req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const [ollamaAvailable, claudeConfigured] = await Promise.all([
      ollamaService.isAvailable(),
      Promise.resolve(claudeService.isConfigured()),
    ]);

    res.status(200).json({
      success: true,
      data: {
        ollama: {
          available: ollamaAvailable,
          baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
          model: process.env.OLLAMA_MODEL || 'llama2',
        },
        claude: {
          configured: claudeConfigured,
          model: 'claude-3-haiku-20240307',
        },
        primary: ollamaAvailable ? 'ollama' : claudeConfigured ? 'claude' : 'none',
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Check status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check AI status',
    } as ApiResponse);
  }
}
