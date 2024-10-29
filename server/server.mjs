import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { Server } from 'socket.io';
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import resolvers from './schemas/resolvers.js';
import typeDefs from './schemas/typeDefs.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

// CORS configuration
const allowedOrigins = [
  /^http:\/\/localhost(:\d+)?$/,
  'http://192.168.0.165',
  'http://localhost:3000',
  'http://192.168.0.165:3000',
  'https://jubilant-octo-fiesta-heroku-6516beb7273f.herokuapp.com',
  'https://jubilant-octo-fiesta-heroku-6516beb7273f.herokuapp.com:3000'
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Welcome to my Node server with GraphQL!');
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// JWT helper function
const getUserFromToken = (token) => {
  try {
    return token ? jwt.verify(token, process.env.JWT_SECRET) : null;
  } catch (err) {
    throw new AuthenticationError('Session expired, please log in again.');
  }
};

// Initialize Apollo Server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start Apollo Server
await apolloServer.start();

// Apply Apollo middleware to the Express app
app.use(
  '/graphql',
  expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      const user = getUserFromToken(token.replace('Bearer ', ''));
      return { user };
    },
  }),
);

// Create HTTP server and initialize Socket.IO on the same port
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  },
});

// Configure Socket.IO
const configureSocketIO = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected on port:', io.httpServer.address().port);

    socket.on('fromSwiftUI', (data) => {
      console.log(`Message received on port ${io.httpServer.address().port}:`, data);
    });

    socket.on('fromFlutter', (data) => {
      console.log(`Message received on port ${io.httpServer.address().port}:`, data);
    });

    socket.on('fromReact', (data) => {
      console.log(`Message received on port ${io.httpServer.address().port}:`, data);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected from port ${io.httpServer.address().port}`);
    });
  });
};

configureSocketIO(io); // Attach Socket.IO event handlers

// Start the server
server.listen(port, () => {
  console.log(`Server with Socket.IO and Apollo GraphQL running on port ${port}`);
});