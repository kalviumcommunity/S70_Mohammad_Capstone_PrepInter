import React, { useEffect, useState } from "react";
import { FiMenu, FiUser, FiLogOut, FiLayers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

const ProfilePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "");
      setAvatarPreview(user.avatar || "");
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await authAPI.updateProfile({ name, email, ...(password ? { password } : {}) });
      updateUser(res.data);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (e) {
      console.error('Failed to update profile', e);
      setMessage("Failed to update profile. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await authAPI.uploadAvatar(file);
      setAvatarPreview(res.data.avatar);
      updateUser({ avatar: res.data.avatar });
    } catch (e) {
      console.error('Avatar upload failed', e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#B2BBAF] font-epilogue">
      {/* Navbar */}
      <nav className="bg-black text-white p-4 text-center font-['Caveat'] text-3xl">
        PrepInter
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`bg-black text-white flex flex-col justify-between transition-all duration-300
            ${sidebarOpen ? "w-56" : "w-16"} mt-4 mb-4 ml-4 rounded-tr-xl rounded-br-xl`}
        >
          {/* Top Section */}
          <div>
            {/* Hamburger */}
            <div
              className="p-4 cursor-pointer hover:text-[#DCFF50]"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FiMenu size={24} />
            </div>

            {/* Menu Items */}
            <div className="mt-6 flex flex-col space-y-6">
              {/* Dashboard */}
              <div
                className="flex items-center px-4 cursor-pointer font-bold hover:text-[#DCFF50]"
                onClick={() => navigate("/dashboard")}
              >
                <FiUser size={20} />
                {sidebarOpen && <span className="ml-3">Dashboard</span>}
              </div>

              {/* Strategies */}
              <div
                className="flex items-center px-4 cursor-pointer hover:text-[#DCFF50]"
                onClick={() => navigate("/strategies")}
              >
                <FiLayers size={20} />
                {sidebarOpen && <span className="ml-3">Strategies</span>}
              </div>

              {/* Performance */}
              <div
                className="flex items-center px-4 cursor-pointer hover:text-[#DCFF50]"
                onClick={() => navigate("/performance")}
              >
                <FiUser size={20} />
                {sidebarOpen && <span className="ml-3">Performance</span>}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div
            className="p-4 flex items-center cursor-pointer hover:text-[#DCFF50]"
            onClick={() => navigate("/")}
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span className="ml-3">Sign out</span>}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div
            className="bg-[#E9EEEA] rounded-2xl shadow-lg p-4 sm:p-8 w-full max-w-2xl min-h-[70vh] sm:h-[80vh] flex flex-col overflow-y-auto"
            style={{ transition: "all 0.3s ease" }}
          >
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-white text-3xl">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <FiUser className="text-black" />
                )}
              </div>
              <h2 className="text-xl font-bold mt-4">{name || 'User'}</h2>
              <p className="text-gray-600">{role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Free'}</p>
            </div>

            {/* Profile Form */}
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-sm font-medium">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  className="w-full mt-1 p-2 rounded bg-[#8D8A8A] text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className="w-full mt-1 p-2 rounded bg-[#8D8A8A] text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Role</label>
                <input
                  type="text"
                  value={role}
                  readOnly
                  className="w-full mt-1 p-2 rounded bg-[#8D8A8A] text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  className="w-full mt-1 p-2 rounded bg-[#8D8A8A] text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Profile Picture</label>
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="w-full mt-1" />
                {uploading && <p className="text-xs text-gray-600 mt-1">Uploading...</p>}
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-3 rounded ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
              <button className="bg-black text-white px-4 py-2 rounded hover:bg-[#DCFF50] hover:text-black transition" onClick={()=>{ logout(); navigate('/'); }}>
                Delete account
              </button>
              <button 
                className="bg-black text-white px-4 py-2 rounded hover:bg-[#DCFF50] hover:text-black transition disabled:opacity-50" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
