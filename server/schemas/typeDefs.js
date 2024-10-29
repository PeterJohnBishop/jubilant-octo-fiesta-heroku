const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    _id: String
    username: String!
    email: String!
    token: String  # Add token field here
  }

  type Query {
    me: User
    getUserById(_id: _id): User
    getAllUsers: [User!]!
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    updateUser()id: _id, username: String, email: String, password: String): User
    deleteUser(_id: _id): String
  }
`;

module.exports = typeDefs;