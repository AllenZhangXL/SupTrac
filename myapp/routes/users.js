var express = require('express');
var router = express.Router();
var User = require('../lib/User');
var Ticket = require('../lib/Ticket')
var Comment = require('../lib/Comment')
var ProductOwner = require('../lib/User');
var session = require('express-session');
var moment = require('moment');

/* GET users listing. */
router.get('/login',function(req,res){
  res.render('login',{title:'User Login'});
});

router.post('/login',function(req,res){
	var username = req.body.username;
	var password = req.body.password;

	User.findOne({username: username ,password: password},function(err,user){
		if(err){
			res.redirect('/login');
			console.log(err);
			return res.status(500).send();		
		}

		if(!user){
			res.redirect('/login');
			return res.status(404).send();
				
		}
		req.session.user = user;
		res.redirect('/index');
	})
});

/* Logout and Destroy the session*/
router.get('/logout',function(req,res){
	req.session.destroy();
	res.redirect('/users/login');
});



/* GET Register page*/
/*
router.get('/register',function(req,res){
	res.render('register',{title: 'Register'});
});

router.post('/register',function(req,res){
	var username =req.body.username;
	var password =req.body.password;
	var firstname =req.body.firstname;
	var lastname =req.body.lastname;
	var email = req.body.email;
	var dateOfBrith = req.body.dateOfBrith;

	var newuser = new User();
	newuser.username = username;
	newuser.password = password;
	newuser.firstname = firstname;
	newuser.lastname = lastname;
	newuser.email = email;
	newuser.dateOfBrith = dateOfBrith;
	newuser.position = "Developer";
	newuser.save(function(err,savedUser){
		if(err){
			console.log(err);
			return res.status(500).send();
		}
		return res.status(200).send();
	})
});
*/

/* Create a ProductorOwner  , use this to add a user quickly instead of using mongo shell command*/ 
router.get('/createProOwner',function(req,res){
	var productOwner = new ProductOwner();
	productOwner.username = "LiMing";
	productOwner.password = "123";
	productOwner.firstname = "Ming";
	productOwner.lastname = "Li";
	productOwner.email = "LiMing@123.com";
	productOwner.dateOfBrith = "1994/01/01";
	productOwner.position = "ProductOwner";

	productOwner.save(function(err,savedProductOwner){
		if(err){
			console.log(err);
			return res.status(500).send();
		}
		return res.status(200).send();
	})
});

module.exports = router;
