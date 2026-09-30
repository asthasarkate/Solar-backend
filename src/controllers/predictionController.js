const Prediction = require('../models/Prediction');
const User = require('../models/User');
const { getPrediction: predictFault } = require('../services/aiService');

const analyzeImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const result = await predictFault(req.file.path);
    const imageUrl = `/uploads/${req.file.filename}`;

    const predictionPayload = {
      user: req.user._id,
      faultType: result.faultType,
      severity: result.severity,
      confidence: result.confidence,
      recommendation: result.recommendation,
      recommendedProfessional: result.recommendedProfessional,
      diyGuidance: result.diyGuidance,
      diySafe: result.diySafe,
      imageUrl,
    };
    console.log('Payload being saved to DB:', JSON.stringify(predictionPayload));

    const prediction = await Prediction.create(predictionPayload);

    await User.findByIdAndUpdate(req.user._id, { $inc: { totalScans: 1 } });

    res.status(200).json({
      id: prediction._id,
      faultType: prediction.faultType,
      severity: prediction.severity,
      confidence: prediction.confidence,
      recommendation: prediction.recommendation,
      recommendedProfessional: prediction.recommendedProfessional,
      diyGuidance: prediction.diyGuidance,
      diySafe: prediction.diySafe,
      imageUrl: prediction.imageUrl,
      createdAt: prediction.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const { search, faultType, sort, page = 1, limit = 10 } = req.query;
    const filter = { user: req.user._id };

    if (faultType) {
      filter.faultType = faultType;
    }

    if (search) {
      filter.faultType = { $regex: search, $options: 'i' };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    else if (sort === 'confidence') sortOption = { confidence: -1 };
    else if (sort === 'severity') {
      sortOption = { severity: 1 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Prediction.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    let data;
    if (sort === 'severity') {
      data = await Prediction.aggregate([
        { $match: filter },
        {
          $addFields: {
            severityOrder: {
              $switch: {
                branches: [
                  { case: { $eq: ['$severity', 'High'] }, then: 1 },
                  { case: { $eq: ['$severity', 'Medium'] }, then: 2 },
                  { case: { $eq: ['$severity', 'Low'] }, then: 3 },
                ],
                default: 4,
              },
            },
          },
        },
        { $sort: { severityOrder: 1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNum },
        { $project: { severityOrder: 0, __v: 0 } },
      ]);
    } else {
      data = await Prediction.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .select('-__v');
    }

    data = data.map((item) => ({
      id: item._id,
      faultType: item.faultType,
      severity: item.severity,
      confidence: item.confidence,
      imageUrl: item.imageUrl,
      createdAt: item.createdAt,
    }));

    res.status(200).json({ data, total, page: pageNum, totalPages });
  } catch (error) {
    next(error);
  }
};

const getPrediction = async (req, res, next) => {
  try {
    const prediction = await Prediction.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).select('-__v');

    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found' });
    }

    res.status(200).json({
      id: prediction._id,
      faultType: prediction.faultType,
      severity: prediction.severity,
      confidence: prediction.confidence,
      recommendation: prediction.recommendation,
      recommendedProfessional: prediction.recommendedProfessional,
      diyGuidance: prediction.diyGuidance,
      diySafe: prediction.diySafe,
      imageUrl: prediction.imageUrl,
      createdAt: prediction.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { analyzeImage, getHistory, getPrediction };
