const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');
const User = require('../models/User');  // Import the User model

const resolvers = {
  Query: {
    me: async (parent, args, { user }) => {
      if (!user) throw new AuthenticationError('You are not authenticated');

      // Fetch the user data from the database
      const dbUser = await User.findById(user.id);
      if (!dbUser) throw new AuthenticationError('User not found');
      return dbUser;
    },
  },
  Mutation: {
    register: async (_, { username, email, password }) => {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('User with this email already exists');

      // Hash the password and save the new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();

      // Generate a JWT token
      const token = generateToken(user);
      return { ...user.toObject(), token };
    },
    login: async (_, { email, password }) => {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) throw new AuthenticationError('Invalid email or password');

      // Verify the password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new AuthenticationError('Invalid email or password');

      // Generate a JWT token
      const token = generateToken(user);
      return { ...user.toObject(), token };
    },
  },
};

// Helper function to generate JWT token
function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = resolvers;