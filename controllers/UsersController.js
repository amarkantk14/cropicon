'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models/user');

 
exports.ListUser = function(req, res, next){
 /* User.createUser();
  User.search('rakesh', function (err,users) {
    if (err) return next(err);
    res.json(users);
  })*/

	User.find({},function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
};


exports.login = function(req, res, next){
	res.render( 'login', { title : 'Login'});
};

exports.doLogin = function(req, res, next){
  req.assert('password', 'Password is required').notEmpty();
	req.assert('email', 'A valid email is required').notEmpty().isEmail();
	var errors = req.validationErrors();
	if (errors)
  	res.render('login', {errors: errors});
	else
 		res.render('login', {email: req.email});
};