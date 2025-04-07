const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true,
     match: [
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    "Please enter a valid email",
],
 },
 password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters"],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must include uppercase, lowercase, number and special character",
    ],
  },

  googleId: { type: String }, 
  avatar: { type: String }, 
  role: { type: String, enum: ["free", "paid"], default: "free" },
  interviewsTaken: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
