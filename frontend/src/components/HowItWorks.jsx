import React, { useState } from "react";

const slides = [
  {
    step: "01",
    title: "Create an Account",
    description: `Sign up with your email to get started. 
You'll gain access to our AI-powered platform and start customizing your experience.`,
  },
  {
    step: "02",
    title: "Choose Your Interview Type",
    description: `Select your interview field and difficulty level.
AI customizes questions tailored to your selection. Give text or voice-based mock interviews.`,
  },
  {
    step: "03",
    title: "Start Your Mock Interview",
    description: `Click "Start Mock Interview" and begin your mock session. Receive instant feedback and improve with every round.`,
  },
];

const HowItWorks = () => {
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="bg-[#131313] w-full h-auto text-white py-16 px-6">
      {/* Heading */}
      <div className="text-left px-10 mb-12">
        <p className="text-sm px-10 text-gray-400">Our Process</p>
        <h2 className="text-3xl font-semibold inline-block border-b-4 border-[#DCFF50] pb-1">
          How It Works?
        </h2>
      </div>

      {/* Slide Card */}
      <div className="flex items-center justify-center gap-6">
        {/* Left arrow */}
        <button
          onClick={handlePrev}
          className="text-8xl font-semibold text-gray-500 hover:text-white"
        >
          {"<"}
        </button>

        {/* Slide Content */}
        <div className="bg-gradient-to-br from-[#353333] to-black rounded-xl p-18 max-w-xl w-full shadow-lg transition-all duration-500">
          <p className="text-sm mb-3">{slides[current].step}</p>
          <h3 className="text-xl md:text-4xl font-semibold mb-6">
            {slides[current].title}
          </h3>
          <p className="text-gray-300 whitespace-pre-line leading-relaxed">
            {slides[current].description}
          </p>
        </div>

        {/* Right arrow */}
        <button
          onClick={handleNext}
          className="text-8xl font-semibold text-gray-500 hover:text-white"
        >
          {">"}
        </button>
      </div>
    </section>
  );
};

export default HowItWorks;
