import React from "react";
import { Link } from "react-router-dom";
const OurEdgeSection = () => {
  return (
    <div className="bg-black text-white font-sans">
      {/* Our Edge Section */}
      <div className="max-w-7xl mx-auto px-15 py-16 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div>
          <p className="text-sm text-gray-400 mb-2">Why Choose Us</p>
          <h2 className="text-5xl font-bold mb-4">Our Edge</h2>
          <p className="text-sm text-gray-300 mb-6 max-w-md">
            Choose AI Mock Interviewer Hub for personalized, realistic interview practice.
            Gain confidence, improve skills, and land your dream job.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <span className="text-xl">⤿</span>
              <span className="text-lg">AI Analysis</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">⤿</span>
              <span className="text-lg">Real Practice</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">⤿</span>
              <span className="text-lg">Adaptive Learning</span>
            </li>
          </ul>
        </div>

        {/* Right Image */}
        <div className="rounded-lg overflow-hidden">
          <img
            src="/src/assets/interview.png"
            alt="Interview Practice"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Gradient Section */}
      <div className="relative overflow-hidden">
        <div
          className="text-white py-14 px-16 flex justify-between items-center"
          style={{
            background: `linear-gradient(135deg, black 0%, #DCFF50 50%, black 100%)`,
          }}
        >
          <div>
            <p className="text-sm mb-1">Your Success</p>
            <h2 className="text-4xl font-bold">Get Hired</h2>
          </div>
          <Link to='/signup'>
          <button className="bg-black text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-black transition">
            Get Started
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OurEdgeSection;
