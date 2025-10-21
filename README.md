# PrepInter - AI-Powered Mock Interview Platform

PrepInter is a comprehensive mock interview web application that helps users practice and improve their interview skills through AI-powered questions and feedback.

## 🚀 Features

### Core Features
- **User Authentication**: Secure JWT-based authentication with registration and login
- **Mock Interviews**: AI-powered interview questions across multiple categories
- **Real-time Analytics**: Track progress with detailed performance metrics
- **Multiple Interview Types**: Behavioral, Technical, Situational, and Soft Skills
- **Difficulty Levels**: Beginner, Intermediate, and Advanced
- **Progress Tracking**: Monthly analytics and performance insights
- **Payment Integration**: Razorpay integration for premium features

### Interview Categories
- **Behavioral**: Questions about past experiences and situations
- **Technical**: Technical knowledge and problem-solving
- **Situational**: How you would handle specific scenarios  
- **Soft Skills**: Communication, leadership, and teamwork

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons
- **Framer Motion** for animations

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Razorpay** for payments
- **OpenAI API** for AI feedback

## 📁 Project Structure

```
capstone-project/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── interviewController.js
│   │   ├── interviewSessionController.js
│   │   ├── paymentController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── interviewModel.js
│   │   ├── interviewSession.js
│   │   ├── paymentModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── interviewRoutes.js
│   │   ├── interviewSessionRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   ├── aiHelper.js
│   │   ├── generateToken.js
│   │   └── logger.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── InterviewPage.jsx
│   │   │   ├── InterviewResult.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MockInterviewSetup.jsx
│   │   │   ├── Performance.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Signup.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd capstone-project/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp env.example .env
   ```

4. **Configure environment variables**
   ```env
   MONGO_URI=mongodb://localhost:27017/prepinter
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_SECRET=your_razorpay_secret
   OPENAI_API_KEY=your_openai_api_key
   PORT=5000
   NODE_ENV=development
   ```

5. **Start the server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd capstone-project/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp env.example .env
   ```

4. **Configure environment variables**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 API Endpoints

### Authentication
- `POST /api/users` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Interviews
- `POST /api/interviews/start` - Start new interview
- `GET /api/interviews` - Get user interviews
- `GET /api/interviews/:id` - Get specific interview
- `GET /api/interview/question` - Get next question
- `POST /api/interview/answer` - Submit answer

### Analytics
- `GET /api/analytics/progress` - Get user progress
- `GET /api/analytics/history` - Get interview history
- `GET /api/analytics/insights` - Get performance insights

### Payments
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Get payment history
- `GET /api/payments/subscription` - Get subscription status

## 🎯 Usage

### For Users

1. **Sign Up/Login**: Create an account or login to access the platform
2. **Start Interview**: Choose interview type and difficulty level
3. **Answer Questions**: Respond to AI-generated questions with time limits
4. **View Results**: Get detailed feedback and performance analytics
5. **Track Progress**: Monitor improvement over time with monthly analytics

### For Developers

1. **Clone the repository**
2. **Set up both backend and frontend as described above**
3. **Configure environment variables**
4. **Start both servers**
5. **Access the application at `http://localhost:5173`**

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Input validation
- CORS configuration
- Error handling middleware

## 📊 Analytics & Insights

- **Monthly Progress**: Track interviews taken each month
- **Category Breakdown**: Performance across different interview types
- **Completion Rates**: Success rates and improvement trends
- **Average Scores**: Performance metrics and feedback
- **Time Tracking**: Duration and efficiency metrics

## 💳 Payment Integration

- Razorpay integration for premium features
- Secure payment processing
- Subscription management
- Payment history tracking

## 🚀 Deployment

### Backend Deployment (Render/Vercel)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@prepinter.com or create an issue in the repository.

## 🔮 Future Enhancements

- Video interview recording
- Advanced AI feedback
- Interview scheduling
- Company-specific questions
- Mobile app development
- Social features and leaderboards

---

**PrepInter** - Master your interviews with AI-powered practice sessions! 🚀