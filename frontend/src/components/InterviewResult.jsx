import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { analyticsAPI } from "../services/api";

export default function InterviewComplete() {
  const navigate = useNavigate();
  const [mood, setMood] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  const moods = [
    { key: "bad", label: "Not Good", emoji: "🙁" },
    { key: "okay", label: "Okayish", emoji: "😐" },
    { key: "good", label: "Good", emoji: "🙂" },
    { key: "great", label: "Very Good", emoji: "😄" },
  ];

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const response = await analyticsAPI.getInsights();
      setResults(response.data.insights);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Your nav (kept as-is) */}
      <nav className="bg-black text-white px-8 py-4 flex items-center justify-between mb-6">
        <div className="flex-1 text-center font-bold font-['Caveat'] text-3xl">
          PrepInter
        </div>
        <div
          className="font-epilogue text-sm cursor-pointer hover:text-[#DCFF50] transition"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-4 text-center">
        <h1 className="font-epilogue font-semibold text-xl md:text-2xl text-black">
          Great! You Finished This Interview
        </h1>

        {loading ? (
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="mt-8 bg-[#E9EEEA] rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Your Performance Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4">
                <p className="text-2xl font-bold text-[#DCFF50]">{results?.recentAverage || 'N/A'}</p>
                <p className="text-sm text-gray-600">Average Score</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-2xl font-bold text-[#DCFF50]">{results?.totalSessions || 0}</p>
                <p className="text-sm text-gray-600">Total Sessions</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-2xl font-bold text-[#DCFF50]">{results?.averageDuration || 0}m</p>
                <p className="text-sm text-gray-600">Avg Duration</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[#DCFF50] px-6 py-3 text-sm md:text-base font-semibold text-black shadow-sm hover:brightness-95 active:translate-y-px transition"
        >
          Back to Dashboard
        </button>

        {/* Feedback card */}
        <section className="mt-8 bg-[#E9EEEA] rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="font-epilogue font-semibold text-lg md:text-xl text-black mb-6">
            Share Your Experience
          </h2>

          {/* Emoji options */}
          <div className="flex flex-wrap items-start justify-center gap-6 mb-6">
            {moods.map((m) => (
              <div key={m.key} className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  aria-label={m.label}
                  aria-pressed={mood === m.key}
                  onClick={() => setMood(m.key)}
                  className={`grid place-items-center w-16 h-16 md:w-20 md:h-20 rounded-lg bg-[#8D8A8A] text-3xl text-white transition
                    ${mood === m.key ? "ring-4 ring-[#DCFF50] scale-[1.03]" : "hover:scale-[1.02]"}`}
                >
                  <span>{m.emoji}</span>
                </button>
                <span className="text-xs md:text-sm text-gray-700">{m.label}</span>
              </div>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share Your experience!"
            className="w-full min-h-[110px] resize-y rounded-xl bg-[#8D8A8A] p-4 text-white placeholder:text-white/80 outline-none focus:ring-4 ring-[#DCFF50]"
          />
        </section>

        <div className="h-10" />
      </main>
    </div>
  );
}