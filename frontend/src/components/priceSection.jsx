import React, { useState } from "react";

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section className="bg-black text-white py-16 px-6">
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        One simple plan unlocks everything.
      </h2>

      {/* Toggle */}
      <div className="flex justify-center mb-12">
        <div className="flex border border-gray-600 rounded-full overflow-hidden">
          <button
            className={`px-6 py-2 text-sm font-semibold ${
              isYearly ? "bg-white text-black" : "text-white"
            }`}
            onClick={() => setIsYearly(true)}
          >
            Yearly (39% off)
          </button>
          <button
            className={`px-6 py-2 text-sm font-semibold ${
              !isYearly ? "bg-white text-black" : "text-white"
            }`}
            onClick={() => setIsYearly(false)}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        {/* Basic Plan */}
        <div className="bg-[#f4f4f4] text-black rounded-2xl p-8 w-full max-w-sm">
          <h3 className="text-2xl font-bold mb-2">Basic</h3>
          <p className="text-lg mb-6">Free Plan</p>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3 text-gray-700">
              <span className="text-lg">⤿</span> Max 3 interviews
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <span className="text-lg">⤿</span> Normal AI feedback
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <span className="text-lg">⤿</span> Limited question access
            </li>
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="bg-[#0b0b0b] border border-[#dcff50] rounded-2xl p-8 w-full max-w-sm relative"
        style={{ 
            boxShadow: '0 0 5px 2px rgba(220, 255, 80, 0.8)',
          }}
          >
          {/* Tag */}
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#bcf7a8] text-black text-xs font-semibold px-4 py-1 rounded-full shadow-md">
            Limited Launch Special
          </span>

          <h3 className="text-4xl font-bold mb-6 text-right">Pro</h3>

          {/* Pricing */}
          <div className="mb-6 text-left">
            {isYearly ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-400 line-through text-lg">$48</span>
                  <span className="text-3xl font-bold text-[#DCFF50]">$29</span>
                  <span className="text-sm text-gray-300">USD</span>
                  <span className="text-sm text-gray-400">per year</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ~$2.42 per month
                </div>
              </>
            ) : (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-400 line-through text-lg">$12</span>
                  <span className="text-3xl font-bold text-[#DCFF50]">$4</span>
                  <span className="text-sm text-gray-300">USD</span>
                  <span className="text-sm text-gray-400">per month</span>
                </div>
              </>
            )}
          </div>

          {/* Features */}
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <span className="text-[#DCFF50] text-lg">⤿</span> Unlimited Mock Interviews
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#DCFF50] text-lg">⤿</span> Advanced AI Feedback
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#DCFF50] text-lg">⤿</span> Access to All Question Sets
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#DCFF50] text-lg">⤿</span> Detailed Performance Report
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#DCFF50] text-lg">⤿</span> Priority Customer Support
            </li>
            <li className="text-gray-400 text-sm pl-7">Many more</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
