const { buildSchema } = require('graphql');
let User = require('../db_setup/users');

const postSchema = buildSchema(`
    type Query {
        post(id: ID!): Post
        user(id: ID!): User      
    }
    type Post {
        _id: ID
        name: String
        body: String
        author: User
    }
    type User {
        _id: ID
        username: String
        email: String
        password: String
    }

    schema {
        query: Query
    }
`);

module.exports = postSchema;
