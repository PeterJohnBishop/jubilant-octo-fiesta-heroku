const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');
const User = require('../models/User');  // Import the User model

const resolvers = {
  Query: {
    // Retrieves the current user based on token
    me: async (parent, args, { user }) => {
      if (!user) throw new AuthenticationError('You are not authenticated');
      const dbUser = await User.findById(user.id);
      if (!dbUser) throw new AuthenticationError('User not found');
      return dbUser;
    },

    // Finds a user by their MongoDB _id
    getUserById: async (_, { _id }) => {
      const user = await User.findById(_id);
      if (!user) throw new Error('User not found');
      return user;
    },

    // Retrieves all users
    getAllUsers: async () => {
      return await User.find();
    },
  },

  Mutation: {
    // Registers a new user
    register: async (_, { username, email, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('User with this email already exists');

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();

      const token = generateToken(user);
      return { ...user.toObject(), token };
    },

    // Logs in an existing user
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new AuthenticationError('Invalid email or password');

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new AuthenticationError('Invalid email or password');

      const token = generateToken(user);
      user.token = token
      return { ...user.toObject() };
    },

    // Updates user details
    updateUser: async (_, { _id, username, email, password }) => {
      const updateFields = {};

      if (username) updateFields.username = username;
      if (email) updateFields.email = email;
      if (password) updateFields.password = await bcrypt.hash(password, 10);  // Hash password if provided

      const updatedUser = await User.findByIdAndUpdate(_id, updateFields, { new: true });
      if (!updatedUser) throw new Error('User not found');
      return updatedUser;
    },

    // Deletes a user by _id
    deleteUser: async (_, { _id }) => {
      const user = await User.findByIdAndDelete(_id);
      if (!user) throw new Error('User not found');
      return `User with _id ${id} has been deleted`;
    },
  },
};

// Helper function to generate JWT token
function generateToken(user) {
  return jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = resolvers;