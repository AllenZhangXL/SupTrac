var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

var CommentSchema = Schema({
	
	creationDate:{type:Date},
	content:{type:String},
	commentOwner:{type:String},
	ticketID : {type:String}	

});

var Comment = mongodb.mongoose.model("comment",CommentSchema);
module.exports = Comment;