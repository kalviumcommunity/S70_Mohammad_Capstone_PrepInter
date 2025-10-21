// Performance.jsx
import React, { useState, useEffect } from "react";
import { FaRegFileAlt, FaCode, FaCogs } from "react-icons/fa";
import { GiGhost } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { analyticsAPI } from "../services/api";

const Performance = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [latest, setLatest] = useState(null);
  const [recs, setRecs] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadAnalytics();
    loadLatestAndRecs();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await analyticsAPI.getProgress();
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLatestAndRecs = async () => {
    try {
      const [l, r] = await Promise.all([
        analyticsAPI.getLatest(),
        analyticsAPI.getRecommendations(),
      ]);
      setLatest(l.data.latest);
      setRecs(r.data.recommendations);
    } catch (e) {
      console.error('Error loading latest interview and recommendations:', e);
      setRecs('Focus on structuring answers (STAR), clarifying trade-offs, and practicing mock sessions.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
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

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 px-4 sm:px-6">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          {/* Recent Box */}
          <div
            className="rounded-2xl p-6 text-black shadow-lg"
            style={{
              background: "linear-gradient(180deg, #DCFF50 0%, #4c5622 100%)",
            }}
          >
            <h2 className="text-lg font-semibold mb-4">Recent</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-2 font-bold">
                <FaRegFileAlt className="text-xl" />
                Recent Interview
              </span>
              {latest && (
                <span className="flex items-center bg-white text-black text-sm font-semibold px-3 py-1 rounded-lg">
                  {new Date(latest.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit' })}
                </span>
              )}
            </div>
            {latest ? (
              <div className="text-sm space-y-1">
                <div><span className="font-semibold">Category:</span> {latest.category}</div>
                <div><span className="font-semibold">Difficulty:</span> {latest.difficulty}</div>
                <div><span className="font-semibold">Duration:</span> {Math.floor((latest.duration||0)/60)}m</div>
              </div>
            ) : (
              <div className="text-sm">No interviews yet.</div>
            )}
          </div>

          {/* Objectives Box */}
          <div className="bg-[#E8E8E8] rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Objectives</h2>
            <div className="space-y-3 text-sm whitespace-pre-wrap">{recs || 'Loading...'}</div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          {/* Interview Taken - Black Container */}
          <div className="bg-black rounded-2xl p-4 sm:p-8 text-white">
            <h2 className="text-lg sm:text-xl font-bold mb-6 sm:mb-8">
              Interview Taken -{" "}
              <span className="font-bold text-[#DCFF50]">
                {analytics?.totalStats?.totalInterviews || 0}
              </span>
            </h2>

            {/* Categories inside black box */}
            <div className="grid grid-cols-2 sm:flex sm:justify-between items-center gap-4">
              <div className="flex flex-col items-center">
                <FaRegFileAlt className="text-2xl mb-2 text-gray-300" />
                <span className="font-medium">Behavioral</span>
                <span className="text-[#DCFF50] font-bold text-lg mt-1">
                  {analytics?.categoryBreakdown?.find(c => c._id === 'behavioral')?.count || 0}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <FaCode className="text-2xl mb-2 text-gray-300" />
                <span className="font-medium">Technical</span>
                <span className="text-[#DCFF50] font-bold text-lg mt-1">
                  {analytics?.categoryBreakdown?.find(c => c._id === 'technical')?.count || 0}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <FaCogs className="text-2xl mb-2 text-gray-300" />
                <span className="font-medium">Situational</span>
                <span className="text-[#DCFF50] font-bold text-lg mt-1">
                  {analytics?.categoryBreakdown?.find(c => c._id === 'situational')?.count || 0}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <GiGhost className="text-2xl mb-2 text-gray-300" />
                <span className="font-medium">Soft skills</span>
                <span className="text-[#DCFF50] font-bold text-lg mt-1">
                  {analytics?.categoryBreakdown?.find(c => c._id === 'softskills')?.count || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Interview Progress - Now outside the black container */}
          <div className="bg-[#353333] rounded-2xl p-4 sm:p-6 text-white">
            <h3 className="text-lg font-semibold mb-4 sm:mb-6">Interview Progress</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 sm:divide-x divide-gray-600 text-sm">
              {/* January */}
              <div className="pr-4">
                <p className="mb-3 font-semibold">January</p>
                <div className="h-2 bg-white rounded mb-3 w-3/4"></div>
                <div className="h-2 bg-white rounded w-1/2"></div>
              </div>

              {/* February */}
              <div className="sm:px-4">
                <p className="mb-3 font-semibold">February</p>
                <div className="h-2 bg-white rounded mb-3 w-5/6"></div>
                <div className="h-2 bg-white rounded mb-3 w-2/3"></div>
                <div className="h-2 bg-white rounded w-1/2"></div>
              </div>

              {/* March */}
              <div className="sm:pl-4">
                <p className="mb-3 font-semibold">March</p>
                <div className="h-2 bg-white rounded mb-3 w-4/5"></div>
                <div className="h-2 bg-white rounded mb-3 w-2/3"></div>
                <div className="h-2 bg-white rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default Performance;