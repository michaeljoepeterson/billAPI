const express = require("express");
const router = express.Router();
const {Votes} = require("../models/voteModel");
const {checkBody} = require('../tools/checkBody');
const {checkEmails} = require('../tools/checkEmails');

router.post('/',checkBody,checkEmails,(req,res)=>{
	const legId = req.query.legid;
	const email = req.body.email;
	let newEmails = req.voteEmails;
	newEmails.push(email);
	//1 for y 2 for n
	let yesInc = req.body.vote === 1 ? 1 : 0;
	console.log(newEmails);
	return Votes.updateOne({legisinfo_id:legId},{$set:{
		emails:newEmails
	},$inc:{yes:yesInc,total:1}})

	.then(vote => {
		console.log('updated vote: ', vote);
		return res.json({
			status:200,
			message:'Voted'
		});
	})
	.catch(err => {
		console.log('errr voting',err);
		return res.json({
			status:200,
			message:'Error voting'
		});
	});
});

router.get('/',(req,res)=>{
	const legId = req.query.legid;

	return Votes.find({legisinfo_id:legId})

	.then(vote => {
		console.log('got vote: ', vote);
		return res.json({
			status:200,
			vote
		});
	})
	.catch(err => {
		console.log('errr voting',err);
		return res.json({
			status:200,
			message:'Error voting'
		});
	});
});

module.exports = {router};