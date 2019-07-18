let Article = require('../db_setup/schema');
let User = require('../db_setup/users');

const postRoot = {
	post: args => {
		return Article.findOne({ _id: args.id });
	},
	user: args => {
		return User.findOne({ _id: args.id });
	}
};

module.exports = postRoot;
