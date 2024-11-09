const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const OTP = require("../models/OTP");

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

exports.signup = async (req, res) => {
  const { username, password ,role} = req.body;
  try {
    const userExist = await User.findOne({ username });
    if (userExist)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword ,role});

    const otp = generateOTP();
    console.log("Generated OTP:", otp); // Log OTP in console
    await OTP.create({ username, otp });

    res
      .status(201)
      .json({ message: "User registered successfully. Please verify OTP." });
  } catch (error) {
    res.status(500).json({ message: " error" });
  }
};

exports.verifyOTP = async (req, res) => {
  const { username, otp } = req.body;
  try {
    const savedOTP = await OTP.findOne({ username, otp });
    if (!savedOTP)
      return res.status(400).json({ message: "OTP Invalid/Expired " });

    await User.updateOne({ username }, { user_verification: true });
    await OTP.deleteMany({ username });

    res
      .status(200)
      .json({ message: "OTP verified successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.resendOTP = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    console.log("Resent OTP:", otp); 

    await OTP.updateOne(
      { username },
      { otp, createdAt: new Date() },
      { upsert: true }
    );

    res.status(200).json({ message: "OTP resent successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.signIn = async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    // if (!user.verified)
    //   return res.status(403).json({ message: "User not verified" });

    const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};