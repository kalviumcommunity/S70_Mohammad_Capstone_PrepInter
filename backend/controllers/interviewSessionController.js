const asyncHandler = require('express-async-handler');
const Interview = require('../models/interviewModel');
const User = require('../models/userModel');
const axios = require('axios');

// @desc    Get next question from an active interview
// @route   GET /api/interview/question
// @access  Private
const getNextQuestion = asyncHandler(async (req, res) => {
  try {
    // Find the most recent incomplete interview for this user
    const interview = await Interview.findOne({
      userId: req.user._id,
      completed: false
    }).sort({ createdAt: -1 });

    if (!interview) {
      return res.status(404).json({
        message: 'No active interview found. Please start a new interview.'
      });
    }

    // Find the first unanswered question
    const nextQuestion = interview.questions.find(q => !q.answer || q.answer === '');

    if (!nextQuestion) {
      // All questions have been answered
      interview.completed = true;
      await interview.save();
      return res.status(404).json({
        message: 'All questions have been answered. Interview complete.'
      });
    }

    // Return the question
    res.json({
      id: nextQuestion._id,
      question: nextQuestion.questionText,
      interviewId: interview._id
    });
  } catch (error) {
    console.error('Error fetching next question:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Submit answer to a question and get feedback
// @route   POST /api/interview/answer
// @access  Private
const submitAnswer = asyncHandler(async (req, res) => {
  const { questionId, answer } = req.body;

  if (!questionId || !answer) {
    return res.status(400).json({ message: 'Please provide questionId and answer' });
  }

  try {
    // Find the interview containing this question
    const interview = await Interview.findOne({
      userId: req.user._id,
      'questions._id': questionId,
      completed: false
    });

    if (!interview) {
      return res.status(404).json({ message: 'Question not found or interview is already completed' });
    }

    // Find the question in the interview
    const questionIndex = interview.questions.findIndex(q => q._id.toString() === questionId);
    
    if (questionIndex === -1) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Generate feedback using OpenAI
    let feedback = '';
    let score = 0;

    try {
      // Prepare the prompt for OpenAI
      const prompt = `You are an expert interviewer evaluating a candidate's answer to a technical interview question.

Question: ${interview.questions[questionIndex].questionText}

Candidate's Answer: ${answer}

Please provide:
1. Detailed feedback on the answer (strengths, weaknesses, missing points)
2. A score from 1-10

Format your response as a JSON object with 'feedback' and 'score' fields.`;

      // Call OpenAI API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert technical interviewer providing feedback on candidate answers.',
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

      // Parse the response
      const content = response.data.choices[0].message.content;
      let parsedResponse;
      
      try {
        // Try to parse the response as JSON
        parsedResponse = JSON.parse(content);
        feedback = parsedResponse.feedback;
        score = parsedResponse.score;
      } catch (error) {
        // If parsing fails, extract feedback and score using regex or other methods
        const feedbackMatch = content.match(/feedback["']?\s*:\s*["']([^"']+)["']/i);
        const scoreMatch = content.match(/score["']?\s*:\s*([0-9]+)/i);
        
        feedback = feedbackMatch ? feedbackMatch[1] : 'Your answer was evaluated. Please continue with the interview.';
        score = scoreMatch ? parseInt(scoreMatch[1]) : 5;
      }

    } catch (error) {
      console.error('Error generating feedback:', error);
      // Provide default feedback if API call fails
      feedback = 'Thank you for your answer. Let\'s continue with the interview.';
      score = 5;
    }

    // Update the question with the answer and feedback
    interview.questions[questionIndex].answer = answer;
    interview.questions[questionIndex].feedback = feedback;
    
    await interview.save();

    // Return the feedback
    res.json({
      feedback,
      score
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = {
  getNextQuestion,
  submitAnswer
};