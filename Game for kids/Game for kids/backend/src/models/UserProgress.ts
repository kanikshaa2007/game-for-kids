import mongoose, { Document, Schema } from 'mongoose';

interface SubjectProgress {
  easy: {
    correct: number;
    total: number;
  };
  medium: {
    correct: number;
    total: number;
  };
  hard: {
    correct: number;
    total: number;
  };
}

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  math: SubjectProgress;
  letters: SubjectProgress;
  image: SubjectProgress;
  rhyme: SubjectProgress;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectProgressSchema = new Schema<SubjectProgress>({
  easy: {
    correct: { type: Number, default: 0, min: 0 },
    total: { type: Number, default: 0, min: 0 },
  },
  medium: {
    correct: { type: Number, default: 0, min: 0 },
    total: { type: Number, default: 0, min: 0 },
  },
  hard: {
    correct: { type: Number, default: 0, min: 0 },
    total: { type: Number, default: 0, min: 0 },
  },
});

const UserProgressSchema = new Schema<IUserProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    math: {
      type: SubjectProgressSchema,
      default: () => ({
        easy: { correct: 0, total: 0 },
        medium: { correct: 0, total: 0 },
        hard: { correct: 0, total: 0 },
      }),
    },
    letters: {
      type: SubjectProgressSchema,
      default: () => ({
        easy: { correct: 0, total: 0 },
        medium: { correct: 0, total: 0 },
        hard: { correct: 0, total: 0 },
      }),
    },
    image: {
      type: SubjectProgressSchema,
      default: () => ({
        easy: { correct: 0, total: 0 },
        medium: { correct: 0, total: 0 },
        hard: { correct: 0, total: 0 },
      }),
    },
    rhyme: {
      type: SubjectProgressSchema,
      default: () => ({
        easy: { correct: 0, total: 0 },
        medium: { correct: 0, total: 0 },
        hard: { correct: 0, total: 0 },
      }),
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update lastUpdated before saving
UserProgressSchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  next();
});

// Virtual for overall accuracy per subject
UserProgressSchema.virtual('math.accuracy').get(function () {
  const total = this.math.easy.total + this.math.medium.total + this.math.hard.total;
  if (total === 0) return 0;
  const correct = this.math.easy.correct + this.math.medium.correct + this.math.hard.correct;
  return Math.round((correct / total) * 100);
});

UserProgressSchema.virtual('letters.accuracy').get(function () {
  const total = this.letters.easy.total + this.letters.medium.total + this.letters.hard.total;
  if (total === 0) return 0;
  const correct = this.letters.easy.correct + this.letters.medium.correct + this.letters.hard.correct;
  return Math.round((correct / total) * 100);
});

UserProgressSchema.virtual('image.accuracy').get(function () {
  const total = this.image.easy.total + this.image.medium.total + this.image.hard.total;
  if (total === 0) return 0;
  const correct = this.image.easy.correct + this.image.medium.correct + this.image.hard.correct;
  return Math.round((correct / total) * 100);
});

UserProgressSchema.virtual('rhyme.accuracy').get(function () {
  const total = this.rhyme.easy.total + this.rhyme.medium.total + this.rhyme.hard.total;
  if (total === 0) return 0;
  const correct = this.rhyme.easy.correct + this.rhyme.medium.correct + this.rhyme.hard.correct;
  return Math.round((correct / total) * 100);
});

const UserProgress = mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);

export default UserProgress;
