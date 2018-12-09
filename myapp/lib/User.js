var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

var userSchema = Schema({
	
	username: {type:String, unique:true},
	password: {type:String},
	firstname:{type:String},
	lastname:{type:String},
	email:{type:String},
	dateOfBrith:{type:Date},
	position:{type:String} 
	
});




var User = mongodb.mongoose.model("user",userSchema);


module.exports = User;
