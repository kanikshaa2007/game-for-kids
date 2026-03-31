import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestionRecord {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  responseTime: number; // in seconds
  difficulty: string;
}

export interface IGameSession extends Document {
  userId: mongoose.Types.ObjectId;
  gameType: 'math' | 'letters' | 'image' | 'rhyme';
  difficulty: 'easy' | 'medium' | 'hard';
  startTime: Date;
  endTime?: Date;
  totalTime: number; // in seconds
  questions: IQuestionRecord[];
  score: number;
  isActive: boolean;
}

const QuestionRecordSchema = new Schema<IQuestionRecord>({
  question: {
    type: String,
    required: true,
  },
  userAnswer: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  responseTime: {
    type: Number,
    required: true,
    min: [0, 'Response time cannot be negative'],
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
  },
});

const GameSessionSchema = new Schema<IGameSession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  gameType: {
    type: String,
    required: true,
    enum: ['math', 'letters', 'image', 'rhyme'],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
  },
  startTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  endTime: {
    type: Date,
  },
  totalTime: {
    type: Number,
    default: 0,
    min: [0, 'Total time cannot be negative'],
  },
  questions: {
    type: [QuestionRecordSchema],
    default: [],
  },
  score: {
    type: Number,
    default: 0,
    min: [0, 'Score cannot be negative'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Calculate total time before saving
GameSessionSchema.pre('save', function (next) {
  if (this.endTime && this.startTime) {
    this.totalTime = Math.floor((this.endTime.getTime() - this.startTime.getTime()) / 1000);
  }
  next();
});

// Index for efficient queries
GameSessionSchema.index({ userId: 1, startTime: -1 });
GameSessionSchema.index({ userId: 1, isActive: 1 });

const GameSession = mongoose.model<IGameSession>('GameSession', GameSessionSchema);

export default GameSession;
