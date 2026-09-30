const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const RECOMMENDATIONS = {
  Dust: {
    Low: 'Schedule routine cleaning within 30 days to maintain optimal performance.',
    Medium: 'Clean panels within 14 days. Dust accumulation is reducing efficiency noticeably.',
    High: 'Clean panels immediately. Severe dust buildup is significantly blocking sunlight.',
  },
  Cracks: {
    Low: 'Monitor the cracked area closely. Schedule a professional inspection within 30 days.',
    Medium: 'Arrange professional inspection within 7 days. Cracks may worsen and affect output.',
    High: 'Immediate professional inspection required. Cracks pose a risk of further damage and safety hazards.',
  },
  'Physical Damage': {
    Low: 'Document the damage and schedule a maintenance review within 14 days.',
    Medium: 'Inspect and repair within 7 days. Physical damage is impacting panel function.',
    High: 'Urgent repair or panel replacement needed. Damaged panels can be a safety risk.',
  },
  Shading: {
    Low: 'Identify and monitor the shading source. Minor impact on performance.',
    Medium: 'Address shading obstruction within 14 days to restore panel output.',
    High: 'Remove shading obstruction immediately. Severe shading is drastically reducing generation.',
  },
};

const FAULT_TYPES = ['Dust', 'Cracks', 'Physical Damage', 'Shading'];
const SEVERITIES = ['Low', 'Medium', 'High'];

const PROFS = {
  Dust: 'Professional Panel Cleaning Service',
  Cracks: 'Certified Solar Panel Technician',
  'Physical Damage': 'Solar Installation Technician',
  Shading: 'Site Maintenance Team'
};

const getMockPrediction = () => {
  const faultType = FAULT_TYPES[Math.floor(Math.random() * FAULT_TYPES.length)];
  const severity = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
  const confidence = Math.floor(Math.random() * 24) + 75;
  const recommendation = RECOMMENDATIONS[faultType][severity];
  const recommendedProfessional = PROFS[faultType];
  let diySafe = false;
  let diyGuidance = "";
  if (faultType === 'Dust') {
    diySafe = true;
    diyGuidance = "Safe to clean yourself with water and a soft brush.";
  } else if (faultType === 'Shading') {
    diySafe = true;
    diyGuidance = "If caused by vegetation, trimming is safe to do yourself.";
  } else if (faultType === 'Cracks') {
    diySafe = false;
    diyGuidance = "Not safe for DIY -- contact a certified technician.";
  } else if (faultType === 'Physical Damage') {
    diySafe = false;
    diyGuidance = "Not safe for DIY -- contact a professional.";
  }
  return { faultType, severity, confidence, recommendation, recommendedProfessional, diyGuidance, diySafe };
};

const getPrediction = async (imagePath) => {
  try {
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));

    const response = await axios.post(process.env.AI_SERVICE_URL, form, {
      headers: form.getHeaders(),
      timeout: 10000,
    });

    const { faultType, severity, confidence, recommendation, recommendedProfessional, diyGuidance, diySafe } = response.data;
    console.log('Used real AI service for prediction');
    console.log('AI service raw response:', JSON.stringify(response.data));
    return { faultType, severity, confidence, recommendation, recommendedProfessional, diyGuidance, diySafe };
  } catch (error) {
    const networkErrors = ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNRESET', 'EAI_AGAIN'];
    const isNetworkError = !error.response && (
      networkErrors.includes(error.code) ||
      error.code === 'ERR_NETWORK' ||
      (error.message && error.message.toLowerCase().includes('timeout'))
    );

    if (isNetworkError) {
      console.log(`AI service unreachable (${error.code || error.message}), using mock predictor`);
      return getMockPrediction();
    }

    console.error('AI service error:', error.response?.status, JSON.stringify(error.response?.data));
    throw error;
  }
};

module.exports = { getPrediction };
