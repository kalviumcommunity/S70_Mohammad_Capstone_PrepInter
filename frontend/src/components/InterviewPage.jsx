import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { interviewAPI } from "../services/api";

const QUESTION_SECONDS = 600; // 10 minutes per question

function formatTime(total) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function InterviewQuestionScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { interviewId, category, difficulty } = location.state || {};

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [confidence, setConfidence] = useState(50);
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_SECONDS - 1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const timeUp = secondsLeft <= 0;

  // Load first question
  useEffect(() => {
    if (interviewId) {
      loadNextQuestion();
    } else {
      navigate('/mock-interview-setup');
    }
  }, [interviewId]);

  // Countdown timer
  useEffect(() => {
    if (currentQuestion) {
      setSecondsLeft(QUESTION_SECONDS - 1);
      const id = setInterval(() => {
        setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
      return () => clearInterval(id);
    }
  }, [currentQuestion]);

  const loadNextQuestion = async () => {
    try {
      setLoading(true);
      const response = await interviewAPI.getNextQuestion();
      if (response.data.completed || response.data.message === 'All questions have been answered. Interview complete.') {
        navigate('/result');
      } else {
        setCurrentQuestion(response.data);
        setAnswer("");
        setConfidence(50);
        // Update progress based on current question index (approximate)
        if (response.data.interviewId) {
          // For now, we'll use a simple increment - in a real app, you'd get total questions from the interview
          setProgress(prev => Math.min(prev + 10, 100));
        }
      }
    } catch (error) {
      setError('Failed to load question');
      console.error('Error loading question:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    if (!currentQuestion || !answer.trim()) return;
    
    setSubmitting(true);
    try {
      await interviewAPI.submitAnswer({
        questionId: currentQuestion.id,
        answer: answer
      });
      loadNextQuestion();
    } catch (error) {
      setError('Failed to submit answer');
      console.error('Error submitting answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const onSkip = async () => {
    try {
      await interviewAPI.skipQuestion();
      await loadNextQuestion();
    } catch (e) {
      console.error('Skip failed', e);
    }
  };

  const handleExitInterview = async () => {
  if (!interviewId) {
    navigate("/dashboard");
    return;
  }

  try {
    await interviewAPI.completeInterview(interviewId); // ✅ mark completed in backend
  } catch (error) {
    console.error("Error marking interview completed:", error);
  } finally {
    navigate("/dashboard");
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No questions available</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-black text-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="font-['Caveat'] text-2xl font-bold">PrepInter</div>
          </div>
          <button
            onClick={handleExitInterview}
            className="text-sm font-medium hover:text-[#DCFF50] transition"
          >
            Exit Interview
          </button>
        </div>
        <div className="h-1 bg-[#1e90ff]" />
      </nav>

      {/* Sticky progress + timer bar */}
      <div className="sticky top-[48px] z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Question pill with progress */}
          <div className="flex items-center gap-3 bg-black text-white rounded-full px-3 py-1.5">
            <span className="text-xs font-semibold">
              {category?.charAt(0).toUpperCase() + category?.slice(1)} Interview
            </span>
            <ProgressBar progress={progress} />
          </div>

          {/* Timer pill */}
          <div className="ml-auto flex items-center gap-2 bg-black text-white rounded-full px-3 py-1.5">
            <ClockIcon className="w-4 h-4" />
            <span className="text-xs font-semibold">{formatTime(secondsLeft)}</span>
          </div>

          {/* Skip */}
          <button
            onClick={onSkip}
            className="ml-2 text-sm font-medium text-gray-700 hover:text-black"
          >
            Skip
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-0 py-6">
          <section className="bg-[#E9EEEA] rounded-2xl p-5 md:p-7 shadow-sm">
            {/* Question header */}
            <div className="flex items-start gap-3">
              <span className="text-lg md:text-xl font-semibold text-black">
                Q
              </span>
              <h1 className="flex-1 text-base md:text-lg font-semibold leading-relaxed text-black">
                {currentQuestion.question}
              </h1>
              <button
                type="button"
                className="shrink-0 text-gray-600 hover:text-black"
                title="Play question audio"
                aria-label="Play question audio"
              >
                <SpeakerIcon className="w-5 h-5" />
              </button>
            </div>

            {/* STAR Tip */}
            <div className="mt-4 text-sm text-gray-700">
              <div className="font-semibold mb-1">Tip: Use the STAR method to structure your answer:</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>Situation – What was the context?</li>
                <li>Task – What were you responsible for?</li>
                <li>Action – What actions did you take?</li>
                <li>Result – What was the final outcome?</li>
              </ul>
            </div>

            {/* Answer area */}
            <div className="mt-5">
              <div className="relative">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter Your Answer Here"
                  disabled={timeUp}
                  className="w-full min-h-[150px] rounded-xl bg-white border border-black/10 p-4 pr-10 text-sm outline-none focus:ring-4 ring-[#DCFF50]"
                />
                <span
                  className="absolute right-3 bottom-3 text-gray-500"
                  title="Use microphone"
                >
                  <MicIcon className="w-5 h-5" />
                </span>
              </div>
            </div>

            {/* Confidence + Submit */}
            <div className="mt-6 text-center">
              <p className="text-xs md:text-sm text-gray-600 mb-4">
                Mark your confidence level on the above answer and hit submit to proceed
              </p>

              {/* Decorative line with center submit button (to match mock) */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <div className="absolute -top-[7px] left-0 w-3 h-3 rounded-full border border-gray-500 bg-white" />
                  <div className="h-[2px] bg-gray-400 w-full" />
                </div>

                <button
                  onClick={onSubmit}
                  disabled={timeUp || submitting || !answer.trim()}
                  className={`relative select-none inline-flex items-center gap-2 rounded-md border px-5 py-2 text-sm font-semibold shadow-sm
                    ${timeUp || submitting || !answer.trim() ? "bg-gray-200 text-gray-500 border-gray-300" : "bg-white text-black hover:bg-gray-50 border-gray-400"}`}
                >
                  <CheckIcon className="w-4 h-4 text-[#25C85B]" />
                  {submitting ? 'Submitting...' : 'Submit Answer'}
                </button>

                <div className="relative flex-1">
                  <div className="absolute -top-[7px] right-0 w-3 h-3 rounded-full border border-gray-500 bg-white" />
                  <div className="h-[2px] bg-gray-400 w-full" />
                </div>
              </div>

              {/* Actual confidence slider + labels */}
              <div className="mt-4">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={confidence}
                  onChange={(e) => setConfidence(parseInt(e.target.value, 10))}
                  className="w-full accent-[#B8FF1D]"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Not Sure</span>
                  <span>Reasonably Sure</span>
                  <span>Very Sure</span>
                </div>
              </div>
            </div>
          </section>

          <div className="h-10" />
        </div>
      </main>
    </div>
  );
}
function ProgressBar({ progress = 0 }) {
  return (
    <div className="w-40 md:w-64 h-2 bg-white/30 rounded-full overflow-hidden">
      <div className="h-full bg-[#B8FF1D] transition-all duration-300" style={{ width: `${progress}%` }} />
    </div>
  );
}

/* Simple inline SVG icons so you don't need any extra packages */
function ClockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SpeakerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 10v4h4l5 4V6L8 10H4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 9.5a3.5 3.5 0 010 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 7a6 6 0 010 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function MicIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="9" y="3" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M5 11a7 7 0 0014 0M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}