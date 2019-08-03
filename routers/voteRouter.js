const express = require("express");
const router = express.Router();
const {Bills} = require("../models/billModel");
const {checkBody} = require('../tools/checkBody');
const {checkEmails} = require('../tools/checkEmails');

router.post('/',checkBody,checkEmails,(req,res)=>{
	const legId = req.query.legid;
	const email = req.body.email;
	req.billEmails[email] = email;
	let newEmails = req.billEmails;
	let update = {$set:{}};    
    update.$set[email] = email;
	console.log(newEmails,update);
	return Bills.updateOne({legisinfo_id:legId},update)

	.then(bill => {
		//console.log('updated bill: ', bill);
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
	})
});

module.exports = {router};