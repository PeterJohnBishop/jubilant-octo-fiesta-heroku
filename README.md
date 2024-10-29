# jubilant-octo-fiesta-heroku

Heroku Hosted at https://jubilant-octo-fiesta-heroku-6516beb7273f.herokuapp.com/

GraphQL at https://jubilant-octo-fiesta-heroku-6516beb7273f.herokuapp.com/graphql

//register user
mutation register {
    register(username: "test3", email: "test3@gmail.com", password: "test12345") {
        _id
        username
        token
    }
}

//login user
mutation Login {
  login(email: "test2@gmail.com", password: "test12345") {
    _id
    email
    token
  }
}

//get user by _id
query GetUserById($_id: ID!) {
  getUserById(_id: $_id) {
    _id
    username
    email
  }
}

//get all users
query {
  getAllUsers {
    _id
    username
    email
  }
}

//update user
mutation UpdateUser($_id: ID!, $username: String, $email: String, $password: String) {
  updateUser(_id: $_id, username: $username, email: $email, password: $password) {
    id
    username
    email
  }
}

//delete user
mutation DeleteUser($_id: ID!) {
  deleteUser(_id: $_id)
}


