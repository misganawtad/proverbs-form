import mongoose from 'mongoose';

const ProverbSchema = new mongoose.Schema({
  originalText: { type: String, required: true },
  englishTranslation: String,
  language: { type: String, required: true },
  country: { type: String, required: true },
  literalMeaning: String,
  metaphoricalMeaning: String,
  usageScenarios: String,
  lifeLesson: String,
  therapeuticValue: String,
  relevantSituations: [String],
  moodCategory: { type: String, required: true },
  successStories: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Proverb || mongoose.model('Proverb', ProverbSchema);
