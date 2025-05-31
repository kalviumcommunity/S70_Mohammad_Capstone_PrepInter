import React from "react";
import { Mail, Linkedin, Github } from "lucide-react";
const Footer = () => {
  return (
    <footer className="bg-[#131313]  text-white px-6 md:px-16 py-18 space-y-24">
      {/* Newsletter box */}
      <div className="rounded-2xl p-10 max-w-5xl mx-auto text-left text-white" style={{background: `linear-gradient(135deg, black 0%, #DCFF50 50%, black 100%)`,}}>
        <h2 className="text-3xl md:text-4xl font-bold">Stay Updated & Level Up Your <br />
          <span style={{fontFamily: "",fontSize: "3.0rem",textShadow: "2px 2px 2px black opacity-25%"}}>Interview Skills</span>
        </h2>
        <p className="text-lg px-10 text-black font-medium mt-4 mb-8">
          Get exclusive tips, AI-driven interview insights, and feature updates straight to your inbox.
        </p>
        <form className="max-w-200 px-10">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-4 rounded-xl bg-black text-white placeholder:text-gray-400 text-base focus:outline-none"
          />
        </form><br />
        <p className="text-xs italic flex justify-center text-black mt-2">We respect your privacy. No spam, just valuable insights!</p>
      </div>

      {/* Footer content */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 text-gray-300">
        {/* Left - Brand & CTA */}
        <div className="max-w-sm space-y-4">
          <h3 className="text-3xl text-white" style={{ fontFamily: 'Caveat' }}> PrepInter </h3>
          <div className="h-1 w-full bg-gradient-to-r from-[#DCFF50] to-transparent"></div>
          <p> Prepare for your next job interview with confidence. Our AI-powered platform offers personalized mock interviews and detailed feedback to help you.</p>
          <button className="bg-[#2F2F2F] px-5 py-2 rounded-full mt-3 font-semibold text-white hover:bg-[#444] transition"> Join now! </button>
        </div>

        {/* Middle - Menu */}
        <div>
          <h4 className="text-white font-semibold mb-4">MENU</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">About us</a></li>
            <li><a href="#" className="hover:text-white">Features</a></li>
            <li><a href="#" className="hover:text-white">How it works</a></li>
          </ul>
        </div>

        {/* Right - Socials */}
        <div>
          <h4 className="text-white font-semibold mb-4">contact</h4>
          <div className="flex gap-4 text-white text-2xl">
            <a href="http://linkedin.com/in/mohammad-hasan-675251333" aria-label="LinkedIn">
              <Linkedin className="hover:text-[#DCFF50]" />
            </a>
            <a href="https://github.com/Mohammad90-ui/" aria-label="GitHub">
              <Github className="hover:text-[#DCFF50]" />
            </a>
            <a href="#" aria-label="Gmail">
              <Mail className="hover:text-[#DCFF50]" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )};
export default Footer;
