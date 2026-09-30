const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');
const Prediction = require('../models/Prediction');

dotenv.config();

const SEED_PREDICTIONS = [
  {
    faultType: 'Dust',
    severity: 'Low',
    confidence: 82,
    recommendation: 'Schedule routine cleaning within 30 days to maintain optimal performance.',
    imageUrl: '/uploads/sample-dust-low.jpg',
  },
  {
    faultType: 'Cracks',
    severity: 'High',
    confidence: 95,
    recommendation: 'Immediate professional inspection required. Cracks pose a risk of further damage and safety hazards.',
    imageUrl: '/uploads/sample-cracks-high.jpg',
  },
  {
    faultType: 'Physical Damage',
    severity: 'Medium',
    confidence: 88,
    recommendation: 'Inspect and repair within 7 days. Physical damage is impacting panel function.',
    imageUrl: '/uploads/sample-damage-medium.jpg',
  },
  {
    faultType: 'Shading',
    severity: 'Medium',
    confidence: 79,
    recommendation: 'Address shading obstruction within 14 days to restore panel output.',
    imageUrl: '/uploads/sample-shading-medium.jpg',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    let user = await User.findOne({ email: 'test@solara.ai' });
    if (!user) {
      user = await User.create({
        name: 'Test User',
        email: 'test@solara.ai',
        password: 'test1234',
      });
      console.log('Created test user: test@solara.ai / test1234');
    } else {
      console.log('Test user already exists');
    }

    const existingCount = await Prediction.countDocuments({ user: user._id });
    if (existingCount === 0) {
      const predictions = SEED_PREDICTIONS.map((p) => ({ ...p, user: user._id }));
      await Prediction.insertMany(predictions);
      console.log(`Created ${predictions.length} sample predictions`);
    } else {
      console.log(`User already has ${existingCount} predictions, skipping seed`);
    }

    await mongoose.disconnect();
    console.log('Done');
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seed();
