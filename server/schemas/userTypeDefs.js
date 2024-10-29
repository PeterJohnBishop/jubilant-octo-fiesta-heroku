const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    _id: ID!               # Use ID for MongoDB _id
    username: String!
    email: String!
    password: String!
    token: String          # The token field, to return on login/register
  }

  type Query {
    getCurrentUser: User
    getUserById(_id: ID!): User
    getAllUsers: [User!]!
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    updateUser(_id: ID!, username: String, email: String, password: String): User
    deleteUser(_id: ID!): String
  }
`;

module.exports = typeDefs;
