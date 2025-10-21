import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { interviewAPI } from "../services/api";

const MockInterviewSetup = () => {
  const navigate = useNavigate();
  const [interviewType, setInterviewType] = useState("behavioral");
  const [difficulty, setDifficulty] = useState("beginner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStartInterview = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await interviewAPI.startInterview({
        category: interviewType,
        difficulty: difficulty
      });

      if (response.data?.success && response.data?.data?._id) {
        navigate('/interview', { 
          state: { 
            interviewId: response.data.data._id,
            category: interviewType,
            difficulty: difficulty
          }
        });
      } else {
        setError('Unexpected response starting interview');
      }
    } catch (error) {
      setError(error.response?.data?.error || error.response?.data?.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-white">
      {/* Navbar */}
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

      {/* Main container */}
      <div className="flex justify-center items-center w-full h-[85%] p-4">
        <div className="bg-[#E9EEEA] p-6 sm:p-10 rounded-2xl w-full max-w-[650px] shadow-md text-center">
          {/* Title */}
          <h2 className="text-2xl font-semibold mb-8">
            Get Ready For Your Mock Interview
          </h2>

          {/* Inner white box */}
          <div className="bg-white p-8 rounded-xl shadow-sm text-left">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}
            
            <p className="text-sm text-gray-700 mb-6">
              Select the parameters for your mock interview below and click
              <br />
              "Start Mock Interview" to begin.
            </p>

            {/* Interview Type */}
            <label className="block text-gray-800 mb-2 font-medium">
              Interview Type
            </label>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full border rounded-md p-3 mb-8 bg-[#8D8A8A] focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="behavioral">Behavioral</option>
              <option value="technical">Technical</option>
              <option value="situational">Situational</option>
              <option value="softskills">Soft Skills</option>
            </select>

            {/* Difficulty Level */}
            <label className="block text-gray-800 mb-2 font-medium">
              Difficulty Level
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="difficulty"
                  value="beginner"
                  checked={difficulty === "beginner"}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="accent-black"
                />
                Beginner
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="difficulty"
                  value="intermediate"
                  checked={difficulty === "intermediate"}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="accent-black"
                />
                Intermediate
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="difficulty"
                  value="advanced"
                  checked={difficulty === "advanced"}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="accent-black"
                />
                Advanced
              </label>
            </div>
          </div>

          {/* Start Button */}
          <button 
            onClick={handleStartInterview}
            disabled={loading}
            className="mt-8 w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? 'Starting Interview...' : 'Start Mock Interview'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockInterviewSetup;
