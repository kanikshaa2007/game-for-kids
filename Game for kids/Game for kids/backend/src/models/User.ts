import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  age: number;
  avatar: string;
  score: number;
  level: number;
  accuracy: number;
  totalGamesPlayed: number;
  streak: number;
  badges: string[];
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Username must be at least 2 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [4, 'Age must be at least 4'],
      max: [12, 'Age cannot exceed 12'],
    },
    avatar: {
      type: String,
      default: '/avatars/default.png',
    },
    score: {
      type: Number,
      default: 0,
      min: [0, 'Score cannot be negative'],
    },
    level: {
      type: Number,
      default: 1,
      min: [1, 'Level starts at 1'],
    },
    accuracy: {
      type: Number,
      default: 0,
      min: [0, 'Accuracy cannot be below 0'],
      max: [100, 'Accuracy cannot exceed 100'],
    },
    totalGamesPlayed: {
      type: Number,
      default: 0,
      min: [0, 'Games played cannot be negative'],
    },
    streak: {
      type: Number,
      default: 0,
      min: [0, 'Streak cannot be negative'],
    },
    badges: {
      type: [String],
      default: [],
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update lastActive before saving
UserSchema.pre('save', function (next) {
  this.lastActive = new Date();
  next();
});

// Virtual for level based on score
UserSchema.virtual('levelFromScore').get(function () {
  return Math.floor(this.score / 100) + 1;
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
