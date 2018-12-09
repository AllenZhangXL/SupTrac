var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

var TicketSchema = Schema({
	
	summary: {type:String},
	description: {type:String},
	priority:{type:String},
	creationDate:{type:Date},
	status:{type:String},
	productOwner: {type:String},
	developer:{type:String}
});

var Ticket = mongodb.mongoose.model("ticket",TicketSchema);
module.exports = Ticket;

