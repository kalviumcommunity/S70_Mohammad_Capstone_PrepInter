// Signup.jsx
import React from 'react';

const Signup = () => {
  return (
    <div className="min-h-screen font-epilogue bg-gradient-to-r from-black to-zinc-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl flex w-full max-w-4xl overflow-hidden">
        {/* Left form section */}
        <div className="flex flex-col justify-center items-center w-full max-w-md p-8 sm:p-10">
        <h1 className="text-4xl font-bold mb-8">
        <span style={{ fontFamily: 'Caveat' }}>PrepInter</span>
            </h1>


          <input type="text" placeholder="Name" className="border w-full px-4 py-2 mb-4 rounded" />
          <input type="email" placeholder="Email" className="border w-full px-4 py-2 mb-4 rounded" />
          <input type="password" placeholder="Password" className="border w-full px-4 py-2 mb-4 rounded" />
          <input type="password" placeholder="Confirm Password" className="border w-full px-4 py-2 mb-4 rounded" />

          <button className="bg-black text-white w-full py-2 rounded mb-2 hover:opacity-90">
            Sign Up
          </button>

          <p className="text-sm mb-2">
            Already have an account? <span className="text-blue-600 cursor-pointer">Sign In</span>
          </p>

          <div className="flex items-center w-full my-3">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-2 text-gray-400 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <button className="flex items-center justify-center w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition">
            <span className="mr-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center font-bold">
              G
            </span>
            Continue with Google
          </button>
        </div>

        {/* Right section */}
        <div className="hidden md:flex flex-col justify-center px-10 py-8 w-full max-w-md bg-gradient-to-tr from-zinc-100 to-white">
          <h2 className="text-2xl font-bold mb-6">Come join us</h2>
          <ul className="space-y-4 text-sm text-gray-700">
            <li>🧠 Practice mock interviews with AI-driven questions tailored to your field.</li>
            <li>⏳ Improve at your own pace with instant feedback and insights.</li>
            <li>🌍 Keep coming closer towards cracking your interview with PrepInter.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Signup;
