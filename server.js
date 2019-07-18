const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const auth = require('./routes/auth');
const posts = require('./routes/posts');
const dotenv = require('dotenv').config();
const graphqlHTTP = require('express-graphql');

// Server setup
const app = express();
const port = process.env.PORT || 3001;

// Setting up database
mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
	console.log('Connected to DB!');
});

// Middleware
// Set up bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up CORS
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PATCH, POST, DELETE, PUT, OPTIONS');
	next();
});

// GraphQL
const postSchema = require('./graphql/schema');
const postRoot = require('./graphql/root');

app.use(
	'/graphql',
	graphqlHTTP(async (request, response, graphQLParams) => ({
		schema: postSchema,
		rootValue: postRoot,
		graphiql: true
	}))
);

// Routes for posts
app.use('/', posts);

// Routes for users
app.use('/auth', auth);

app.listen(port, () => {
	console.log(`Server running on port ${port}...`);
});
