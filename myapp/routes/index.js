var express = require('express');
var router = express.Router();
var User = require('../lib/User');
var Ticket = require('../lib/Ticket')
var Comment = require('../lib/Comment')
var ProductOwner = require('../lib/User');
var session = require('express-session');
var moment = require('moment');
var nodemailer = require('nodemailer');


/* GET Home page. */
router.get('/', function(req, res, next) {
if(!req.session.user){
		res.redirect('/users/login');
	}
  res.render('index',{title:'Home'});
});

/* GET Tickets manager page*/
router.get('/index',function(req,res){
	if(!req.session.user){
		res.redirect('/users/login');
	}
  res.render('index',{title:'Home'});
});
/* GET login page*/

router.get('/AddTicket',function(req,res){
	if(!req.session.user){
		res.redirect('/users/login');
	}
	res.render('addticket',{title : 'Add Ticket'});
});

/*Add a new Ticket*/
router.post('/AddTicket',function(req,res){
	var productOwner = req.session.user.username;
	var summary = req.body.summary;
	var description = req.body.description;
	var priority = req.body.priority;
	var creationDate = moment().format();

	var newticket = new Ticket();
	newticket.productOwner = productOwner;
	newticket.summary = summary;
	newticket.description =description;
	newticket.priority = priority;
	newticket.creationDate = creationDate;
	newticket.status = "New";
	newticket.save(function(err,savedTicket){
		if(err){
			console.log(err);
			return res.status(500).send();
		}
		res.redirect('/AllTickets');
		
	});

});


/*All Tickets json page*/
router.get('/AllTicketslists',function(req,res){
	Ticket.find({},function(err,tickets){
		res.send({tickets});
	});
});
/*All New Tickets json page*/
router.get('/AllNewTicketslists',function(req,res){
	Ticket.find({status : "New"},function(err,tickets){
		res.send({tickets});
	});
});
/* Ticket Detail json page*/
router.get('/ticketdetaillists',function(req,res){

	var id = session.ticketid;
	Ticket.findOne({_id : id },function(err,tickets){
		res.send({tickets});
	});
});
/*All Comment Json page*/
router.get('/AllCommentlists',function(req,res){
	ticketid = session.ticketid;
	Comment.find({ticketID : ticketid},function(err,comments){
		res.send({comments});
	});
});
/*get Mytickets json page*/
router.get('/Myticketslists',function(req,res){
	if(!req.session.user){
		res.redirect('/users/login');
	}
	username = req.session.user.username;
	Ticket.find({developer : username},function(err,tickets){
		res.send({tickets});
	});
});

/* Render NewTickets page*/
router.get('/Newtickets',function(req,res){
	if(!req.session.user){
		res.redirect('/users/login');
	}
	res.render('newtickets',{title: 'New Tickets'});
});

/* Render Alltickets page*/
router.get('/AllTickets',function(req,res){
	if(!req.session.user){
		res.redirect('/users/login');
	}
	res.render('AllTickets',{title:'All Tickets'});
});

/*Render Mytickets page*/
router.get('/Mytickets',function(req,res){
	if(!req.session.user){
		res.redirect('/users/login');
	}
	res.render('mytickets',{title:'My Tickets'});
});
/*Get Ticket ID which will show detail*/
router.post('/AllTickets',function(req,res){
	var ticketid = req.body.id;
	session.ticketid = null;
	session.ticketid = ticketid;
	res.redirect('/ticketdetail');	
});

/*Render Ticket Detail Page*/
router.get('/ticketdetail',function(req,res){
	if(!req.session.user){
		res.redirect('/users/login');
	}
	res.render('ticketdetail',{title:'ticket detail'});
	
});

/*Start Working and Stop Working*/
router.post('/ticketdetail',function(req,res){
	var newststus = req.body.status;
	var id = session.ticketid;
	var developer = req.session.user.username;
	Ticket.update({ _id : id },
	{
		$set : { status : newststus, 
				developer : developer }
	},function(err,results){
		console.log(results);
	});
	res.redirect('/ticketdetail');
});

/*Delete Ticket*/
router.post('/deleteticket',function(req,res){
	var id = req.body.deleteid;
	Ticket.remove({_id : id },
		function(err,results){
			console.log(results);
		});
	res.redirect('/AllTickets');
});

/*Get Edit page */
router.get('/editticket',function(req,res){
	if(!req.session.user){
		res.redirect('/users/login');
	}
	res.render('editticket',{title: 'Edit Ticket'});
});

/*Edit Ticket Post*/
router.post('/editticket',function(req,res){
	var editid = req.body.editid;
	var summary = req.body.summary;
	var description = req.body.description;
	var priority = req.body.priority;
	Ticket.update(
	{
		_id : editid 
	},
	{
		$set: { summary : summary ,
				description : description,
				priority : priority
			}
	},function(err,results){
		console.log(results);
	});
	res.redirect('/ticketdetail');
	
});

/*Show comments post  */
router.post('/showcomments',function(req,res){
	if(!req.session.user){
		res.redirect('/users/login');
	}
	res.redirect('/showcomments');
});
/* Render the showcommetns page*/
router.get('/showcomments',function(req,res){
	if(!req.session.user){
		res.redirect('/users/login');
	}
	res.render('showcomments',{title: 'Show Comments'});
});
/* Render Add Comment page*/
router.get('/addcomment',function(req,res){
	if(!req.session.user){
		res.redirect('/users/login');
	}
	res.render('addcomment',{title : 'Add Comment'});
});

/* Save the Comment to Mongodb and Send An Email to productOwner*/
router.post('/addcomment',function(req,res){
	var ticketid = session.ticketid;
	var commentOwner = req.session.user.username;
	var content = req.body.content;
	var creationDate = moment().format();

	var newcomment = new Comment();
	newcomment.commentOwner = commentOwner;
	newcomment.creationDate = creationDate;
	newcomment.ticketID = ticketid;
	newcomment.content = content;

	newcomment.save(function(err,savedComment){
		if(err){
			console.log(err);
			return res.status(500).send();
		}
	});

	/*Set Transport to use  163.com*/
	var transport = nodemailer.createTransport({
		service : 'QQ',
		port:465,
		auth:{
			user:"2817743523@qq.com",
			pass:"dhhdrmdtbltndgej"
		}
	});
	
	/*Send a Email to TicketOwner When a comment added*/
	Ticket.findOne({_id : ticketid},function(err,MailTicket){
		  var TicketOwner = MailTicket.productOwner;
		  User.findOne({username : TicketOwner},function(err,Owner){
		  	var OwnerEmail = Owner.email;
			var mailOptions = {
				from:'2817743523@qq.com',
				to: OwnerEmail ,
				subject:'Hello there',
				text:'Someone just leave a comment for your ticket, LOL',
				html:'<b>Someone just leave a comment for your ticket!</b>'
		};
				transport.sendMail(mailOptions,function(err,info){
		  		if(err){
		  			console.log(err);
		  		}else{
		  			console.log('Message sent' + info.response);
		  		}
		  	});
			res.redirect('/ticketdetail');
		  	
		 });
	});
	
});


module.exports = router; 
