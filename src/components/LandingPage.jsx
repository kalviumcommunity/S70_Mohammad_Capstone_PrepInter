import React from 'react';
import { Link } from "react-router-dom";
import Feature from './Feature'
import EdgeSection from './EdgeSection'
import PricingSection from './priceSection';
import HowItWorks from './HowItWorks';
import Footer from './footer';
import DotsBg from '../assets/dotbg.png';


const Home = () => {
  return (
    <div
      className="w-full min-h-screen overflow-hidden relative font-epilogue"
      style={{
        background: 'radial-gradient(ellipse at top left, #000000 0%, #000000 30%, #4E4E4E 100%)',
      }}
    >
      <img
        src={DotsBg}
        alt="dots"
        className="absolute top-0 left-0 w-full min-h-screen object-cover opacity-80 mix-blend-darken z-0"
      />

      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-4 text-white bg-black z-50">
        <h1 className="text-2xl w-1/3">
          <span style={{ fontFamily: 'Caveat' }}>PrepInter</span>
        </h1>

        <div className="flex-1 flex justify-center gap-8 font-inclusive text-base whitespace-nowrap">
          <a href="#" className="hover:text-[#DCFF50] transition">Home</a>
          <a href="#" className="hover:text-[#DCFF50] transition">About us</a>
          <a href="#" className="hover:text-[#DCFF50] transition">Features</a>
          <a href="#" className="hover:text-[#DCFF50] transition">How it Works</a>
          <a href="#" className="hover:text-[#DCFF50] transition">Contact</a>
        </div>

        <div className="w-1/3 flex justify-end">
          <a href="/signIn" className="hover:text-[#DCFF50] transition font-inclusive text-base">Sign In</a>
        </div>
      </div>

      {/* Hero Section */}
      <div className="pt-10 min-h-screen ml-10 flex flex-col items-center justify-center relative z-10">
        <div className="self-start ml-20 mb-2">
          <p
            className="text-[#DCFF50] font-semibold italic leading-snug text-left"
            style={{
              fontSize: '35px',
              fontFamily: 'Inclusive Sans'
            }}
          >
            Crush Your <br />
            Next Interview <br />
            with
          </p>
        </div>

        <h1
          className="font-bold bg-gradient-to-r from-white via-[#999] to-black bg-clip-text text-transparent drop-shadow-hero text-[70px] sm:text-[120px] md:text-[160px] lg:text-[200px] leading-tight"
          style={{
            fontFamily: 'Epilogue'
          }}
        >
          PrepInter
        </h1>

        <p className="text-[#8D8A8A] mt-2 ml-10 text-sm font-normal text-center font-inclusive">
          Your AI-powered mock interview coach – Practice. Improve. Succeed.
        </p>

        <Link to='/signup'>
        <button className="bg-black px-6 ml-10 py-3 rounded-full mt-4 font-epilogue font-semibold text-white hover:scale-105 transition-all">
          Get Started
        </button>
          </Link>
      </div>

      {/* About Us Section */}
      <div className="w-full h-screen px-8 sm:px-20 py-16 flex flex-col justify-center items-start" 
        style={{ backgroundColor: '#171717' }}>
      {/* Heading */}
      <h2
        className="text-white text-5xl sm:text-5xl mb-2"
        style={{ fontFamily: 'Anonymous Pro' }}
      >
      About&nbsp;&nbsp;Us
      </h2>

  {/* Small Yellow Line */}
  <div className="h-[2px] w-50 mb-10" style={{ backgroundColor: '#DCFF50' }}></div>

  {/* Paragraph */}
  <p
    className="text-white text-lg leading-10 max-w-xl self-end text-left"
    style={{ 
      fontSize: '40px',
      fontFamily: 'Crimson Text' }}
  >
    PrepInter is an AI-powered mock interview platform that helps you practice,
    get real-time feedback, and improve your interview skills. Whether you're a student
    or a professional, our smart system prepares you to succeed and push you
    closer to cracking your interviews.
  </p>

  {/* Full-width Gradient Bottom Line */}
  <div
    className="absolute bottom-0 left-0 h-[2px] w-full"
    style={{
      background: 'linear-gradient(to right, #DCFF50, #171717)'
    }}
  />
      </div>
      <Feature />
      <EdgeSection />
      <PricingSection />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Home;
