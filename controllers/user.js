const {v4: uuidv4} = require('uuid');
const User = require("../models/user");
const {setUser} = require('../service/auth');

async function handleUserSignup(req, res) {
  const { username, email, password } = req.body;


  try {
    // Save user with plain password
    await User.create({ username, email, password });

    return res.redirect("/");
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).send("Signup failed. Email might already exist.");
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  try {
    // Find user with exact email and password match
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).send("Invalid email or password.");
    }
    const sessionId = uuidv4();
    setUser(sessionId, user);
    res.cookie("uid", sessionId);
    

    // Login success
    return res.redirect("/");
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).send("Login failed.");
  }
}

module.exports = { handleUserSignup, handleUserLogin };
