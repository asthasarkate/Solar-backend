const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    faultType: {
      type: String,
      enum: ['Dust', 'Cracks', 'Physical Damage', 'Shading'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    recommendation: {
      type: String,
      required: true,
    },
    recommendedProfessional: {
      type: String,
      required: true,
    },
    diyGuidance: {
      type: String,
      required: true,
    },
    diySafe: {
      type: Boolean,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

predictionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Prediction', predictionSchema);
