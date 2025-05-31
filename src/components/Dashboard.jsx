import React, { useState } from 'react'; 
import { FaUserCircle, FaChartBar, FaClipboardList, FaSignOutAlt, FaCode, FaCog, FaGhost } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';

const Dashboard = () => {
    const [selectedMonth, setSelectedMonth] = useState('April');
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = today.toLocaleString('default', { month: 'long' });
  return (
    <div className="min-h-screen flex flex-col bg-[#BFC5BB]">
      {/* Navbar */}
      <div className="w-full bg-black py-4 text-white text-center text-3xl font-bold font-[cursive]"
      style={{ fontFamily: 'caveat'}}>
        PrepInter
      </div>

      <div className="flex flex-1">
        
      {/* Sidebar */}
      <aside className="bg-black text-white w-60 p-6 flex flex-col justify-between">
        <div>
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Dashboard</h2>
            <div className="flex items-center gap-3 text-base hover:text-[#DCFF50] cursor-pointer">
              <FaChartBar size={20} />
              Performance
            </div>
            <div className="flex items-center gap-3 text-base hover:text-[#DCFF50] cursor-pointer">
              <FaClipboardList size={20} />
              Strategies
            </div>
          </div>
        </div>
        
        <a href="/" className="flex items-center gap-3 text-base hover:text-[#DCFF50] cursor-pointer">
          <FaSignOutAlt size={20} />
          Sign out
        </a>
      </aside>

      {/* Main Section */}
      <main className="flex-1 bg-[#C5CCC3] p-14">
        <div className="flex justify-between items-start">
          {/* Left side - Profile & Interview Stats */}
          <div className="flex flex-col gap-6 w-1/3">
            {/* Profile Card */}
            <div className="bg-gradient-to-r from-[#DCFF50] to-[#C6FF4C] rounded-2xl p-4 flex flex-col gap-2 w-[410px] shadow-md">
              <div className="flex items-center gap-4">
                <FaUserCircle size={50} className="text-white" />
                <div>
                  <h2 className="text-black text-lg font-semibold">Alex Martin</h2>
                  <p className="text-xs text-black">Frontend Developer</p>
                  <p className="text-xs text-black">alexmartin@gmail.com</p>
                  <p className="text-xs text-black">Level: Beginner</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2">
                <p className="text-black text-sm mb-1">Interview progress</p>
                <div className="w-full h-2 bg-white rounded-full">
                  <div className="h-full bg-black rounded-full" style={{ width: '43%' }}></div>
                </div>
                <p className="text-right text-sm text-black mt-1">43%</p>
              </div>

              <button className="bg-black text-white py-2 rounded-md mt-2 hover:bg-gray-800 transition">
                View Profile
              </button>
            </div>

            {/* Interview Taken Card */}
            <div className="bg-white p-6 rounded-2xl w-[410px]">
              <h3 className="text-lg font-bold mb-1">Interview Taken</h3>
              <p className="text-3xl font-bold mb-4">12</p> 

              <div className="bg-[#8D8A8A] p-4 rounded-xl">
                <p className="text-sm text-black mb-2">Total Interview Time</p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">5h</p>
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
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Categories */}
          <div className="bg-[#E9EEEA] rounded-2xl p-6 w-[400px] flex flex-col justify-between">
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

            <button className="bg-black text-white py-3 rounded-lg mt-10 hover:bg-gray-800 transition">
              Start Mock Interview
            </button>
          </div>
        </div>
      </main>
    </div>
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
