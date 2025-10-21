const asyncHandler = require('express-async-handler');
const Interview = require('../models/interviewModel');
const InterviewSession = require('../models/interviewSession');
const axios = require('axios');

// @desc    Get user analytics and progress
// @route   GET /api/analytics/progress
// @access  Private
const getUserProgress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { month, year } = req.query;

  // Get current date info
  const currentDate = new Date();
  const currentYear = year || currentDate.getFullYear();
  const currentMonth = month || currentDate.getMonth() + 1;

  // Create date range for the requested month
  const startDate = new Date(currentYear, currentMonth - 1, 1);
  const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);

  // Get interviews for the month
  const monthlyInterviews = await Interview.find({
    userId,
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  });

  // Get all-time stats
  const totalInterviews = await Interview.countDocuments({ userId });
  const completedInterviews = await Interview.countDocuments({ 
    userId, 
    completed: true 
  });

  // Get category breakdown
  const categoryStats = await Interview.aggregate([
    { $match: { userId: userId } },
    { $group: { 
        _id: '$category', 
        count: { $sum: 1 },
        completed: { $sum: { $cond: ['$completed', 1, 0] } }
      }
    }
  ]);

  // Get monthly progress data for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyProgress = await Interview.aggregate([
    {
      $match: {
        userId,
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        interviews: { $sum: 1 },
        completed: { $sum: { $cond: ['$completed', 1, 0] } },
        totalDuration: { $sum: '$duration' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  // Calculate average scores if available
  const averageScore = await InterviewSession.aggregate([
    { $match: { user: userId } },
    { $unwind: '$scores' },
    { $group: { _id: null, avgScore: { $avg: '$scores' } } }
  ]);

  res.json({
    success: true,
    data: {
      currentMonth: {
        interviews: monthlyInterviews.length,
        completed: monthlyInterviews.filter(i => i.completed).length,
        totalDuration: monthlyInterviews.reduce((sum, i) => sum + (i.duration || 0), 0)
      },
      totalStats: {
        totalInterviews,
        completedInterviews,
        completionRate: totalInterviews > 0 ? (completedInterviews / totalInterviews * 100).toFixed(1) : 0,
        averageScore: averageScore.length > 0 ? averageScore[0].avgScore.toFixed(1) : 0
      },
      categoryBreakdown: categoryStats,
      monthlyProgress: monthlyProgress.map(month => ({
        month: month._id.month,
        year: month._id.year,
        interviews: month.interviews,
        completed: month.completed,
        totalDuration: month.totalDuration
      }))
    }
  });
});

// @desc    Get interview history with pagination
// @route   GET /api/analytics/history
// @access  Private
const getInterviewHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const interviews = await Interview.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-questions.answer -questions.feedback');

  const total = await Interview.countDocuments({ userId });

  res.json({
    success: true,
    data: {
      interviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalInterviews: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }
  });
});

// @desc    Get performance insights
// @route   GET /api/analytics/insights
// @access  Private
const getPerformanceInsights = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get recent performance trends
  const recentSessions = await InterviewSession.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(10);

  // Calculate improvement trends
  const scores = recentSessions.map(session => 
    session.scores.length > 0 ? session.scores.reduce((a, b) => a + b, 0) / session.scores.length : 0
  );

  const insights = {
    recentAverage: scores.length > 0 ? (scores.slice(0, 5).reduce((a, b) => a + b, 0) / Math.min(5, scores.length)).toFixed(1) : 0,
    previousAverage: scores.length > 5 ? (scores.slice(5, 10).reduce((a, b) => a + b, 0) / Math.min(5, scores.slice(5, 10).length)).toFixed(1) : 0,
    improvement: scores.length > 5 ? 
      ((scores.slice(0, 5).reduce((a, b) => a + b, 0) / Math.min(5, scores.length)) - 
       (scores.slice(5, 10).reduce((a, b) => a + b, 0) / Math.min(5, scores.slice(5, 10).length))).toFixed(1) : 0,
    totalSessions: recentSessions.length,
    averageDuration: recentSessions.length > 0 ? 
      (recentSessions.reduce((sum, session) => sum + (session.duration || 0), 0) / recentSessions.length / 60).toFixed(1) : 0
  };

  res.json({
    success: true,
    insights
  });
});

// Generate recommendations based on interview answers
const generateRecommendations = (qaPairs) => {
  const recommendations = [];
  
  // Analyze answer lengths
  const avgAnswerLength = qaPairs.reduce((sum, pair) => sum + pair.answer.length, 0) / qaPairs.length;
  
  // Analyze keywords in answers
  const allAnswers = qaPairs.map(pair => pair.answer.toLowerCase()).join(' ');
  const hasStar = allAnswers.includes('situation') && allAnswers.includes('task') && allAnswers.includes('action') && allAnswers.includes('result');
  const hasTechnicalTerms = allAnswers.includes('api') || allAnswers.includes('database') || allAnswers.includes('algorithm');
  const hasSoftSkills = allAnswers.includes('team') || allAnswers.includes('communicate') || allAnswers.includes('collaborate');
  
  // Generate recommendations based on analysis
  if (!hasStar) {
    recommendations.push("📋 Use the STAR method (Situation, Task, Action, Result) to structure your behavioral answers more effectively.");
  }
  
  if (avgAnswerLength < 100) {
    recommendations.push("💬 Provide more detailed answers. Expand on your experiences with specific examples and outcomes.");
  } else if (avgAnswerLength > 500) {
    recommendations.push("🎯 Keep answers concise and focused. Aim for 2-3 minutes per response.");
  }
  
  if (!hasTechnicalTerms && qaPairs.some(pair => pair.question.toLowerCase().includes('technical'))) {
    recommendations.push("🔧 Include more technical details and specific technologies in your technical answers.");
  }
  
  if (!hasSoftSkills && qaPairs.some(pair => pair.question.toLowerCase().includes('team'))) {
    recommendations.push("🤝 Emphasize collaboration and interpersonal skills in your responses.");
  }
  
  // Generic recommendations
  if (recommendations.length === 0) {
    recommendations.push(
      "🎯 Practice answering common interview questions out loud.",
      "📚 Research the company and role to tailor your answers.",
      "⏰ Work on timing - aim for 2-3 minute responses.",
      "🔄 Record yourself practicing to identify areas for improvement.",
      "💡 Prepare specific examples that demonstrate your skills and achievements."
    );
  } else {
    recommendations.push(
      "📚 Continue practicing with mock interviews to build confidence.",
      "⏰ Focus on timing your responses to 2-3 minutes each."
    );
  }
  
  return recommendations.join('\n\n');
};

module.exports = {
  getUserProgress,
  getInterviewHistory,
  getPerformanceInsights
};

// @desc    Get latest interview details
// @route   GET /api/analytics/latest
// @access  Private
module.exports.getLatestInterview = asyncHandler(async (req, res) => {
  const latest = await Interview.findOne({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .select('category difficulty createdAt completed duration');
  if (!latest) return res.json({ success: true, latest: null });
  res.json({ success: true, latest });
});

// @desc    Generate recommendations based on past answers
// @route   GET /api/analytics/recommendations
// @access  Private
module.exports.getRecommendations = asyncHandler(async (req, res) => {
  // Gather last 10 answered Q&A
  const interviews = await Interview.find({ userId: req.user._id, completed: true })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
  const qaPairs = [];
  for (const iv of interviews) {
    for (const q of iv.questions) {
      if (q.answer && q.answer.trim().length > 0) {
        qaPairs.push({ question: q.questionText, answer: q.answer });
      }
      if (qaPairs.length >= 10) break;
    }
    if (qaPairs.length >= 10) break;
  }
  const summary = qaPairs.map((p, i) => `${i + 1}. Q: ${p.question}\nA: ${p.answer}`).join('\n\n');

  let recommendations = 'Keep practicing; not enough data yet.';
  
  if (qaPairs.length > 0) {
    // Generate recommendations based on analysis of answers
    recommendations = generateRecommendations(qaPairs);
  } else {
    recommendations = 'Focus on structuring answers (STAR), clarifying trade-offs, and practicing mock sessions.';
  }
  res.json({ success: true, recommendations });
});

