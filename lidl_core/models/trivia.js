let mongoose = require('mongoose');

let schema = new mongoose.Schema({ question: String, response: String},{collection:'trivia'});
let trivia;
try {
	trivia = mongoose.model('trivia');
} catch (error){
	trivia = mongoose.model('trivia',schema);
}


module.exports = trivia;
