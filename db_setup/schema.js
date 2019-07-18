const mongoose = require('mongoose');


const mainSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	body: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	author: {
        type: Object,
		required: true
    }
});

let Articles = module.exports = mongoose.model('Articles', mainSchema);
