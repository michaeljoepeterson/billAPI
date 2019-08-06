const express = require("express");
const router = express.Router();
const {Bills} = require("../models/billModel");
const {checkBody} = require('../tools/checkBody');
const {checkEmails} = require('../tools/checkEmails');

router.post('/',checkBody,checkEmails,(req,res)=>{
	const legId = req.query.legid;
	const email = req.body.email;
	let newEmails = req.billEmails;
	if(!newEmails.includes(email)){
		newEmails.push(email);
		console.log(newEmails);
		return Bills.updateOne({legisinfo_id:legId},{$set:{
			emails:newEmails
		}})

		.then(bill => {
			console.log('updated bill: ', bill);
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
	}
	else{
		return res.json({
			status:400,
			message:"You already voted for this bill"
		});
	}
});

module.exports = {router};