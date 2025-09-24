const asyncHandler = require('express-async-handler');
const Interview = require('../models/interviewModel');
const User = require('../models/userModel');
const axios = require('axios');

// @desc    Start a new interview
// @route   POST /api/interviews/start
// @access  Private
const startInterview = asyncHandler(async (req, res) => {
  const { category, difficulty } = req.body;

  if (!category || !difficulty) {
    res.status(400);
    throw new Error('Please provide category and difficulty');
  }

  // Check if user is free and has reached interview limit (5)
  if (req.user.role === 'free') {
    const interviewCount = await Interview.countDocuments({ userId: req.user._id });
    if (interviewCount >= 5) {
      res.status(403);
      throw new Error('Free users are limited to 5 interviews. Please upgrade to continue.');
    }
  }

  // Generate questions using OpenAI API
  let questions = [];
  try {
    // Prepare the prompt for OpenAI
    const prompt = `Generate 15 interview questions for a ${difficulty} level ${category} developer interview. Format the response as a JSON array of strings containing only the questions.`;

    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a technical interviewer for software development positions.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    // Parse the response to get questions
    const content = response.data.choices[0].message.content;
    let parsedQuestions;
    
    try {
      // Try to parse the response as JSON
      parsedQuestions = JSON.parse(content);
    } catch (error) {
      // If parsing fails, extract questions using regex
      const questionRegex = /"([^"]+)"/g;
      parsedQuestions = [];
      let match;
      while ((match = questionRegex.exec(content)) !== null) {
        parsedQuestions.push(match[1]);
      }
      
      // If still no questions, split by newlines and clean up
      if (parsedQuestions.length === 0) {
        parsedQuestions = content
          .split('\n')
          .filter(line => line.trim() !== '')
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .filter(line => line.length > 10);
      }
    }

    // Format questions for the database
    questions = parsedQuestions.slice(0, 15).map(q => ({
      questionText: q,
      aiGenerated: true,
    }));

  } catch (error) {
    console.error('Error generating questions:', error);
    
    // Fallback questions if API call fails
    questions = [
      { questionText: `What are the key features of ${category} development?`, aiGenerated: true },
      { questionText: `Explain the MVC architecture in ${category} development.`, aiGenerated: true },
      { questionText: `What are the best practices for error handling in ${category}?`, aiGenerated: true },
      { questionText: `How do you optimize performance in ${category} applications?`, aiGenerated: true },
      { questionText: `Explain RESTful API design principles.`, aiGenerated: true },
      { questionText: `What are the differences between synchronous and asynchronous programming?`, aiGenerated: true },
      { questionText: `How do you implement authentication and authorization in ${category}?`, aiGenerated: true },
      { questionText: `Explain the concept of dependency injection.`, aiGenerated: true },
      { questionText: `What are the SOLID principles in software development?`, aiGenerated: true },
      { questionText: `How do you handle state management in ${category} applications?`, aiGenerated: true },
      { questionText: `Explain the concept of microservices architecture.`, aiGenerated: true },
      { questionText: `What are design patterns and why are they important?`, aiGenerated: true },
      { questionText: `How do you implement testing in ${category} applications?`, aiGenerated: true },
      { questionText: `What is continuous integration and continuous deployment?`, aiGenerated: true },
      { questionText: `How do you ensure security in ${category} applications?`, aiGenerated: true },
    ];
  }

  // Create interview in database
  const interview = await Interview.create({
    userId: req.user._id,
    category,
    difficulty,
    questions,
  });

  // Increment user's interviewsTaken count
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { interviewsTaken: 1 },
  });

  res.status(201).json(interview);
});

// @desc    Get all interviews for a user
// @route   GET /api/interviews
// @access  Private
const getInterviews = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(interviews);
});

// @desc    Get interview by ID
// @route   GET /api/interviews/:id
// @access  Private
const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    res.status(404);
    throw new Error('Interview not found');
  }

  // Check if the interview belongs to the user
  if (interview.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to access this interview');
  }

  res.json(interview);
});

// @desc    Update interview
// @route   PUT /api/interviews/:id
// @access  Private
const updateInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    res.status(404);
    throw new Error('Interview not found');
  }

  // Check if the interview belongs to the user
  if (interview.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this interview');
  }

  // Update interview fields
  if (req.body.questions) {
    interview.questions = req.body.questions;
  }
  
  if (req.body.completed !== undefined) {
    interview.completed = req.body.completed;
    
    // If marking as completed, calculate duration
    if (req.body.completed) {
      const endTime = new Date();
      const startTime = new Date(interview.startedAt);
      interview.duration = Math.floor((endTime - startTime) / 60000); // Duration in minutes
    }
  }

  const updatedInterview = await interview.save();
  res.json(updatedInterview);
});

// @desc    Delete interview
// @route   DELETE /api/interviews/:id
// @access  Private
const deleteInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    res.status(404);
    throw new Error('Interview not found');
  }

  // Check if the interview belongs to the user
  if (interview.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to delete this interview');
  }

  await interview.remove();
  res.json({ message: 'Interview removed' });
});

module.exports = {
  startInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
};