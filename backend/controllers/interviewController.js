const asyncHandler = require('express-async-handler');
const Interview = require('../models/interviewModel');
const User = require('../models/userModel');

// Initialize Groq client if API key is available
let groq = null;
try {
    if (process.env.GROQ_API_KEY) {
        const { OpenAI } = require('openai');
        groq = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: 'https://api.groq.com/openai/v1'
        });
        console.log('Groq LLM initialized successfully');
    } else {
        console.log('No GROQ_API_KEY found, using fallback questions');
    }
} catch (error) {
    console.log('Error initializing Groq LLM, using fallback questions:', error.message);
}


// Fallback questions in case LLM fails
const getFallbackQuestions = (category, count = 5) => {
    const questions = {
        technical: [
            {
                questionText: "What is a RESTful API and what are its main principles?",
                explanation: "A good answer should cover: 1) Definition of REST (Representational State Transfer), 2) Key principles: Statelessness, Client-Server architecture, Cacheability, Uniform Interface, 3) HTTP methods (GET, POST, PUT, DELETE), 4) Status codes, 5) Examples of RESTful endpoints."
            },
            {
                questionText: "Explain the concept of asynchronous programming in JavaScript using Promises.",
                explanation: "Cover: 1) What Promises are and why they're needed, 2) Promise states (pending, fulfilled, rejected), 3) Promise chaining (.then(), .catch()), 4) Async/await syntax, 5) Real-world examples like API calls or file operations."
            },
            {
                questionText: "Compare and contrast SQL vs NoSQL databases. When would you choose one over the other?",
                explanation: "Discuss: 1) Data structure (tables vs documents/key-value), 2) Schema flexibility, 3) Scaling approaches (vertical vs horizontal), 4) ACID compliance, 5) Use cases for each with examples."
            },
            {
                questionText: "What is Docker and how does it simplify application deployment?",
                explanation: "Include: 1) Container concept vs VMs, 2) Docker architecture (daemon, images, containers), 3) Key commands (build, run, push), 4) Dockerfile structure, 5) Benefits in modern development."
            },
            {
                questionText: "Explain JWT (JSON Web Tokens) authentication flow in a web application.",
                explanation: "Cover: 1) JWT structure (header, payload, signature), 2) Authentication process flow, 3) Token storage and security, 4) Advantages over session-based auth, 5) Implementation best practices."
            }
        ],
        behavioral: [
            {
                questionText: "Tell me about a technically challenging project you've worked on. What made it difficult and how did you overcome those challenges?",
                explanation: "Structure using STAR method: 1) Situation: Project context and technical complexity, 2) Task: Your specific role and objectives, 3) Action: Technical decisions made and problem-solving approach, 4) Result: Impact on project/team, lessons learned, and metrics of success."
            },
            {
                questionText: "Describe a time when you had to resolve a technical disagreement with a team member. How did you handle it?",
                explanation: "Address: 1) The technical issue in dispute, 2) Your perspective and their perspective, 3) How you researched or validated different approaches, 4) The resolution process and compromise if any, 5) The outcome and lessons learned about technical collaboration."
            },
            {
                questionText: "Give an example of when you had to quickly learn and implement a new technology or framework. How did you approach it?",
                explanation: "Include: 1) The technology and why it was needed, 2) Your learning strategy and resources used, 3) How you practiced or experimented, 4) Challenges faced during implementation, 5) The end result and impact on the project."
            },
            {
                questionText: "How do you manage multiple competing deadlines in your development work? Give a specific example.",
                explanation: "Cover: 1) Your prioritization methodology, 2) Tools or systems used to track tasks, 3) How you communicate status and delays, 4) Handling dependencies and blockers, 5) Example of successfully managing parallel tasks."
            },
            {
                questionText: "Tell me about a time you took technical leadership on a project or feature. What was your approach and what was the outcome?",
                explanation: "Discuss: 1) The project scope and team composition, 2) How you established technical direction, 3) How you motivated and supported team members, 4) Technical decisions and their justification, 5) Project outcome and team feedback."
            }
        ]
    };

    // Defensive: handle undefined/null/empty category
    let safeCategory = 'technical';
    if (typeof category === 'string' && category.trim().length > 0) {
        safeCategory = category.toLowerCase();
    }
    const categoryQuestions = questions[safeCategory] || questions.technical;
    return categoryQuestions.slice(0, count);
};

// Function to generate questions using Groq LLM with fallback
const generateQuestions = async (category, difficulty, count = 5) => {
    // Always fallback if Groq is not initialized
    if (!groq) {
        console.warn('Groq not initialized, using fallback questions.');
        return getFallbackQuestions(category, count);
    }

    const prompt = `Generate ${count} interview questions for a ${difficulty} level ${category} interview.
    Focus on these aspects based on the difficulty level:
    - For 'beginner': Fundamentals and basic concepts
    - For 'intermediate': Implementation and problem-solving
    - For 'advanced': System design and complex scenarios

    For ${category} interviews, include:
    - Real-world scenarios and practical applications
    - Clear and specific technical concepts
    - Industry best practices
    
    Format each question as a JSON object with these properties:
    - questionText: The actual interview question
    - explanation: Detailed guidelines for what a good answer should include, key points to cover, and any relevant examples or patterns to mention.

    Return only the JSON array of questions.`;
    
    const groqModel = process.env.GROQ_MODEL || "llama-3-8b-8192";
    let response;
    try {
        response = await groq.chat.completions.create({
            model: groqModel,
            messages: [
                {
                    role: "system",
                    content: "You are an expert technical interviewer. Generate challenging and relevant interview questions."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7
        });
    } catch (apiError) {
        // Always fallback if Groq model fails
        console.error(`Groq model '${groqModel}' error: ${apiError.message}`);
        console.error('Check https://console.groq.com/docs/deprecations for the latest supported model and update your .env file (GROQ_MODEL).');
        return getFallbackQuestions(category, count);
    }

    // Parse the response and ensure it's in the correct format
    let questions;
    try {
        const content = response.choices[0].message.content;
        questions = JSON.parse(content);
    } catch (error) {
        console.error("Error parsing LLM response:", error);
        // Fallback to default questions if parsing fails
        questions = getFallbackQuestions(category, count);
    }

    return questions;
};

// @desc    Create a new interview
// @route   POST /api/interviews
// @access  Private
// @desc Create a new interview with normalized parameters
// @route POST /api/interviews
// @access Private
const createInterview = asyncHandler(async (req, res) => {
    // Get category and difficulty from request body
    let { category = 'technical', difficulty } = req.body;

    // Normalize category to lowercase and validate
    category = (category || '').toLowerCase();
    if (!['technical', 'behavioral'].includes(category)) {
        category = 'technical';
    }

    // Normalize difficulty to lowercase
    difficulty = (difficulty || '').toLowerCase();

    // Log incoming request for debugging
    console.log('Received createInterview request:', {
        user: req.user ? req.user._id : null,
        category,
        difficulty,
        headers: req.headers
    });

    // Validate required fields
    if (!req.user || !req.user._id) {
        console.error('Missing or invalid JWT/user in request.');
        return res.status(401).json({ success: false, error: 'Not authorized. Please log in.' });
    }
    if (!difficulty) {
        console.error('Missing difficulty in request body.');
        return res.status(400).json({ success: false, error: 'Missing difficulty.' });
    }

    try {
        // Generate questions using Groq LLM or fallback
        const questions = await generateQuestions(category, difficulty, 5);

    // Create interview with validated parameters
    const interview = await Interview.create({
            category,
            userId: req.user._id,
            difficulty,
            questions,
            startedAt: new Date(),
            completed: false
        });

        console.log('Successfully created interview. Sending response:', {
            success: true,
            interviewId: interview._id
        });

        res.status(201).json({
            success: true,
            data: interview
        });
    } catch (error) {
        console.error("Error creating interview:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Error creating interview"
        });
    }
});

// @desc    Get interview by ID
// @route   GET /api/interviews/:id
// @access  Private
const getInterviewById = asyncHandler(async (req, res) => {
    const interview = await Interview.findById(req.params.id);
    
    if (!interview) {
        res.status(404);
        throw new Error("Interview not found");
    }

    // Check if the interview belongs to the logged-in user
    if (interview.userId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("User not authorized to access this interview");
    }

    res.json({
        success: true,
        data: interview
    });
});

// @desc    Get all interviews for a user
// @route   GET /api/interviews
// @access  Private
const getInterviews = asyncHandler(async (req, res) => {
    const interviews = await Interview.find({ userId: req.user._id });
    
    res.json({
        success: true,
        data: interviews
    });
});

// @desc    Update interview (submit answers)
// @route   PUT /api/interviews/:id
// @access  Private
const updateInterview = asyncHandler(async (req, res) => {
    const { answers, status } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
        res.status(404);
        throw new Error("Interview not found");
    }

    // Check if the interview belongs to the logged-in user
    if (interview.userId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("User not authorized to update this interview");
    }

    // Update the interview
    if (answers) interview.answers = answers;
    if (status === "completed") {
        interview.completed = true;
        interview.completedAt = new Date();
        if (interview.startedAt) {
            interview.duration = Math.max(0, Math.floor((interview.completedAt - interview.startedAt) / 1000));
        }
    }

    const updatedInterview = await interview.save();

    res.json({
        success: true,
        data: updatedInterview
    });
});

// @desc    Delete interview
// @route   DELETE /api/interviews/:id
// @access  Private
const deleteInterview = asyncHandler(async (req, res) => {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
        res.status(404);
        throw new Error("Interview not found");
    }

    // Check if the interview belongs to the logged-in user
    if (interview.userId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("User not authorized to delete this interview");
    }

    await interview.deleteOne();

    res.json({
        success: true,
        message: "Interview removed"
    });
});

// @desc    Start an interview (convenience wrapper)
// @route   POST /api/interviews/start
// @access  Private
const startInterview = asyncHandler(async (req, res) => {
    // Reuse createInterview logic semantics: topic, difficulty, questionsCount
    // Some clients call this endpoint; forward to createInterview implementation
    return createInterview(req, res);
});

module.exports = {
    createInterview,
    startInterview,
    getInterviewById,
    getInterviews,
    updateInterview,
    deleteInterview
};
