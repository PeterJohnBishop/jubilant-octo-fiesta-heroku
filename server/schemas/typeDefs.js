const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    _id: String
    username: String!
    email: String!
    token: String  # Add token field here
  }

  type Query {
    meByToken: String
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
  }
`;

module.exports = typeDefs;