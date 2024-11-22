// Import necessary modules and middleware
const data = require('../data/data.js');
const mongoose = require('mongoose');
const express = require('express');
const User = require('../models/userModel.js');
const Student = require('../models/Student.js');
const expressAsyncHandler = require('express-async-handler'); 
const { generateToken } = require('../utils/utils.js');
const { isAuth } = require('../utils/isAuth.js');
const bcrypt = require('bcrypt');
const userRouter = express.Router();

// Add this new route at the beginning of your route definitions
userRouter.get('/', expressAsyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
}));

// Seed route to populate initial users from data.js
userRouter.get('/seed', expressAsyncHandler(async (req, res) => {
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdUsers });
}));

userRouter.post('/signin',expressAsyncHandler(async(req,res) =>{
  const user = await User.findOne({email: req.body.email})
  .populate('children', 'name');;

  if (!user) {
    return res.status(401).send({ message: 'Invalid email or password' });
  }
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  
  if (user && isMatch) {
    // Send user details and token if authentication is successful
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      linkingCode: user.linkingCode,
      children: user.children,
      mobileNumber: user.mobileNumber,
      residentialAddress: user.residentialAddress,
      educationalBackground: user.educationalBackground,
      occupationalArea: user.occupationalArea,
      annualEducationBudget: user.annualEducationBudget,
      preferredFoE: user.preferredFoE,
      notes: user.notes,
      avatar: user.avatar,
      token: generateToken(user),
    });
  } else {
    res.status(401).send({ message: 'Invalid email or password' });
  }
}));

// Register route for new users with linking code validation
userRouter.post('/register', expressAsyncHandler(async (req, res) => {
  const { name, email, password, linkingCode } = req.body;
  
  // Validate linking code from the students collection
  const student = await Student.findOne({ linkingCode });
  const hashedPassword = await bcrypt.hash(password, 10); // Hash password

  if (!student) {
    // If linking code is invalid
    return res.status(400).send({ message: 'Invalid linking code. Registration failed.' });
  }

  // Create new user with hashed password
  const user = new User({
    name,
    email,
    password: hashedPassword,
    linkingCode,
  });

  const createdUser = await user.save();

  // Link the new user to the student
  student.parents.push(createdUser._id);
  await student.save();

  res.send({
    name: createdUser.name,
    email: createdUser.email,
    token: generateToken(createdUser),
  });
}));

// Get user details by ID
userRouter.get('/:id', expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
}));

// Update user profile route, with authentication required
userRouter.put('/profile', isAuth, expressAsyncHandler(async (req, res) => {
  console.log(req.body);
  const user = await User.findById(req.user._id); // Fetch user by ID
  
  if (user) {
    // Update user profile details
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.mobileNumber = req.body.mobileNumber || user.mobileNumber;
    user.residentialAddress = req.body.residentialAddress || user.residentialAddress;
    user.educationalBackground = req.body.educationalBackground || user.educationalBackground;
    user.occupationalArea = req.body.occupationalArea || user.occupationalArea;
    user.annualEducationBudget = req.body.annualEducationBudget || user.annualEducationBudget;
    user.notes = req.body.notes || user.notes;
    user.avatar = req.body.avatar || user.avatar;

    if (req.body.password) {
      // Hash new password if provided
      user.password = bcrypt.hashSync(req.body.password, 8);
    }

    const updatedUser = await user.save();

    
    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      mobileNumber: updatedUser.mobileNumber,
      residentialAddress: updatedUser.residentialAddress,
      educationalBackground: updatedUser.educationalBackground,
      occupationalArea: updatedUser.occupationalArea,
      annualEducationBudget: updatedUser.annualEducationBudget,
      notes: updatedUser.notes,
      avatar: updatedUser.avatar,
      token: generateToken(updatedUser),
    });
  } else {
    res.status(404).send({ message: 'User not found' });
  }
}));

// Change password route with authentication
userRouter.put('/change-password', isAuth, expressAsyncHandler(async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  const user = await User.findById(userId);
  const isMatch = await bcrypt.compare(oldPassword, user.password); // Compare old password with hashed password

  if (user && isMatch) {
    // Hash the new password and save
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.send({ message: 'Password updated successfully' });
  } else {
    res.status(400).send({ message: 'Old password is incorrect' });
  }
}));

// Reset password route
userRouter.put('/reset-password', expressAsyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;
  
  // Find user by email
  const user = await User.findOne({ email });
  if (user) {
    // Hash new password and save
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).send({ message: 'Password updated successfully.' });
  } else {
    res.status(404).send({ message: 'User not found with this email.' });
  }
}));

// Route to find user by linking code and populate children
userRouter.get('/linkingCode/:linkingCode', expressAsyncHandler(async (req, res) => {
  const user = await User.findOne({ linkingCode: req.params.linkingCode })
    .populate('children', 'name recentEmotion'); // Populate children's name and recentEmotion

  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
}));

module.exports = userRouter; // Export the router
