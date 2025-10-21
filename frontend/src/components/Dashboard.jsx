import React, { useState, useEffect } from 'react'; 
import { FaUserCircle, FaChartBar, FaClipboardList, FaSignOutAlt, FaCode, FaCog, FaGhost } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, interviewAPI } from '../services/api';
import PaymentModal from './PaymentModal';

const Dashboard = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = today.toLocaleString('default', { month: 'long' });
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
      loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
      try {
        const now = new Date();
        const response = await analyticsAPI.getProgress({ month: now.getMonth() + 1, year: now.getFullYear() });
        setAnalytics(response.data.data);
      } catch (error) {
        console.error('Error loading analytics:', error);
        // Set default analytics to prevent crashes
        setAnalytics({
          currentMonth: { totalDuration: 0 },
          totalStats: { totalInterviews: 0, completionRate: 0 },
          categoryBreakdown: []
        });
      } finally {
        setLoading(false);
      }
    };

    const handleStartInterview = () => {
      navigate('/mock-interview-setup');
    };

    const handleLogout = () => {
      logout();
      navigate('/');
    };

    const handleUpgrade = () => {
      setShowPaymentModal(true);
    };

    const handlePaymentSuccess = () => {
      // Refresh user data or show success message
      window.location.reload();
    };
  return (
    <div className="min-h-screen flex flex-col bg-[#BFC5BB]">
      {/* Navbar */}
      <div className="w-full bg-black py-4 text-white text-center text-3xl font-bold font-[cursive]"
      style={{ fontFamily: 'caveat'}}>
        PrepInter
      </div>

      <div className="flex flex-1">
        
      {/* Sidebar */}
      <div className="w-[190px] lg:w-[190px] md:w-[160px] sm:w-[140px] bg-black text-white p-6 flex flex-col">
        <h2 className="text-xl font-epilogue font-semibold mb-10">Dashboard</h2>
        
        <div className="flex-grow space-y-6">
          <button 
            className="flex items-center space-x-2 text-white hover:text-[#DCFF50] transition-all"
            onClick={() => navigate('/performance')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <span className="font-epilogue">Performance</span>
          </button>
          
          <button 
            className="flex items-center space-x-2 text-white hover:text-[#DCFF50] transition"
            onClick={() => navigate('/strategies')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            <span className="font-epilogue">Strategies</span>
          </button>
        </div>
        
        <button 
          className="flex items-center space-x-2 text-white hover:text-[#DCFF50] transition mt-auto"
          onClick={handleLogout}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span className="font-epilogue">Sign out</span>
        </button>
      </div>
      {/* Main Section */}
      <main className="flex-1 bg-[#C5CCC3] p-4 sm:p-8 lg:p-14">
        <div className="flex flex-col xl:flex-row justify-between items-start gap-6">
          {/* Left side - Profile & Interview Stats */}
          <div className="flex flex-col gap-6 w-full xl:w-1/3">
            {/* Profile Card */}
            <div className="bg-gradient-to-r from-[#DCFF50] to-[#C6FF4C] rounded-2xl p-4 flex flex-col gap-2 w-full max-w-[410px] shadow-md">
              <div className="flex items-center gap-4">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle size={50} className="text-white" />
                )}
                <div>
                  <h2 className="text-black text-lg font-semibold">{user?.name || 'User'}</h2>
                  <p className="text-xs text-black">{user?.role === 'paid' ? 'Premium User' : 'Free User'}</p>
                  <p className="text-xs text-black">{user?.email || 'user@example.com'}</p>
                  <p className="text-xs text-black">Level: {analytics?.totalStats?.completionRate > 70 ? 'Advanced' : analytics?.totalStats?.completionRate > 40 ? 'Intermediate' : 'Beginner'}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2">
                <p className="text-black text-sm mb-1">Interview progress</p>
                <div className="w-full h-2 bg-white rounded-full">
                  <div className="h-full bg-black rounded-full" style={{ width: `${analytics?.totalStats?.completionRate || 0}%` }}></div>
                </div>
                <p className="text-right text-sm text-black mt-1">{analytics?.totalStats?.completionRate || 0}%</p>
              </div>

              <button className="bg-black text-white py-2 rounded-md mt-2 hover:bg-gray-800 transition"
                onClick={() => navigate('/profile')}
              >
                View Profile
              </button>
            </div>

            {/* Interview Taken Card */}
            <div className="bg-white p-6 rounded-2xl w-full max-w-[410px]">
              <h3 className="text-lg font-bold mb-1">Interview Taken</h3>
              <p className="text-3xl font-bold mb-4">{analytics?.totalStats?.totalInterviews || 0}</p> 

              <div className="bg-[#8D8A8A] p-4 rounded-xl">
                <p className="text-sm text-black mb-2">Total Interview Time</p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">{Math.floor(((analytics?.currentMonth?.totalDuration || 0) / 3600))}h {Math.floor((((analytics?.currentMonth?.totalDuration || 0) % 3600) / 60))}m</p>
                  <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-[#DCFF50] text-black py-1 px-3 rounded-full"
              >
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Categories */}
          <div className="bg-[#E9EEEA] rounded-2xl p-6 w-full xl:w-[400px] flex flex-col justify-between">
            {/* Date Badge */}
            <div className="self-end mb-6">
              <div className="flex items-center bg-[#8D8A8A] text-white px-3 py-1 rounded-full text-sm gap-2">
                <span className="bg-[#DCFF50] text-black font-bold text-base px-2 py-1 rounded-full">{day}</span>
                {month}
              </div>
            </div>

            <h3 className="text-3xl font-bold mb-4">Interview categories</h3>

            <div className="space-y-6">
              <Category icon={<HiOutlineDocumentText size={26} />} label="Behavioral" />
              <Category icon={<FaCode size={26} />} label="Technical" />
              <Category icon={<FaCog size={26} />} label="Situational" />
              <Category icon={<FaGhost size={26} />} label="Soft skills" />
            </div>

            <button 
              className="bg-black text-white py-3 rounded-lg mt-10 hover:bg-gray-800 transition"
              onClick={handleStartInterview}
            >
              Start Mock Interview
            </button>
            
            {user?.role === 'free' && (
              <button 
                className="bg-[#DCFF50] text-black py-2 px-4 rounded-lg mt-4 hover:bg-[#B8E63C] transition"
                onClick={handleUpgrade}
              >
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
    
    <PaymentModal 
      isOpen={showPaymentModal}
      onClose={() => setShowPaymentModal(false)}
      onSuccess={handlePaymentSuccess}
    />
    </div>
  );
};

const Category = ({ icon, label }) => (
  <div className="flex items-center gap-4 text-black text-base">
    <div className="bg-[#9C9C9C] text-white p-2 rounded-md">{icon}</div>
    {label}
  </div>
);

export default Dashboard;
