import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-800 mb-16 ">
          <span style={{ fontFamily: 'Caveat' }}>PrepInter</span>
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 px-35 mb-6">Welcome Back!</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <a href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-[#DCFF50] transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <p className="text-center text-gray-600 mt-6">
            New on PrepInter? <a href="/signup" className="text-blue-600 hover:underline">Sign Up</a>
          </p>
          
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition duration-200">
            <img 
              src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" 
              alt="Google logo" 
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden md:block md:w-1/2 bg-blue-50 relative">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center">
            <img 
              src="src/assets/boy.png" 
              alt="Ace your Interview now!" 
              className="mx-auto mb-4 max-w-full max-h-[600px] h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;