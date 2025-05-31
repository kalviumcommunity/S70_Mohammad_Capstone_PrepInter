import React from "react";
import aiInsightsImage from "../assets/aiImage.png"; 

const CoreFeatures = () => {
  return (
    <section className="bg-[#0D0D0D] py-20 text-white font-epilogue">
      <div className="text-center mb-16">
        <p className="text-sm text-gray-400">What we offer</p><br />
        <h2 className="text-7xl font-bold mt-2">Core Features</h2>
        <p className="mt-4 max-w-xl mx-auto text-sm text-gray-300">
          We provide cutting-edge AI-powered mock interviews, offering personalized feedback and realistic practice to help you succeed.
        </p>
      </div><br />

      <div className="flex flex-col md:flex-row justify-center items-start gap-20 px-6 md:px-0">
  {/* Left side - Big Card 1 */}
  <div 
    className="bg-white text-black p-6 rounded-xl shadow-lg w-full md:w-[400px]"
    style={{ 
        boxShadow: '0 0 5px 2px rgba(220, 255, 80, 0.8)',
    }}
  >
    <p className="text-xs font-semibold text-gray-500 mb-2">01</p>
    <img src={aiInsightsImage} alt="AI Insights" className="mb-4 w-full h-auto" />
    <h3 className="text-xl font-bold mb-2">AI Insights</h3>
    <p className="text-sm text-gray-600">
      Elevate specific skills with targeted practice. Master challenging questions and refine your technique for optimal performance.
    </p>
  </div>

  {/* Right side - Stack Card 2 and Card 3 */}
  <div className="flex flex-col gap-15 w-full md:w-[350px]">
    {/* Card 2 */}
    <div
      className="p-6 rounded-xl shadow-lg bg-black text-white"
      style={{ 
        boxShadow: '0 0 5px 2px rgba(220, 255, 80, 0.8)',
      }}
    >
      <p className="text-xs font-semibold text-gray-500 mb-2">02</p>
      <h3 className="text-2xl font-bold mb-2">Skill Boost</h3>
      <p className="text-sm text-gray-300">
        AI provides instant, personalized feedback for improvement.
      </p>
    </div>

    {/* Card 3 */}
    <div
      className="p-6 rounded-xl shadow-lg bg-black text-white"
      style={{ 
        boxShadow: '0 0 5px 2px rgba(220, 255, 80, 0.8)',
      }}
    >
      <p className="text-xs font-semibold text-gray-500 mb-2">03</p>
      <h3 className="text-2xl font-bold mb-2">Progress Tracking</h3>
      <p className="text-sm text-gray-300">
        Detailed analytics track progress and identify areas.
      </p>
    </div>
    
    </div>
    </div> <br />
    <div className="text-center mt-10 text-sm text-gray-500">
        Explore all Features
      </div> 
    </section>
  );
};

export default CoreFeatures;
