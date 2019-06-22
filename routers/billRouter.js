const express = require("express");
const {APIURL} = require('../config');
const {GetBills} = require('../getBills/GetBills');
const router = express.Router();
const {saveBill} = require('../db/billDB');

router.get("/",(req,res) => {
	let limit = req.query.limit;
	let getBills;
	getBills = new GetBills(APIURL,limit);

	return getBills.getBillData(0)

	.then(billData => {
		console.log("Bill data==================================================",billData.length);
		return saveBill(billData[0])
	})
	.then(billCreatedData => {
		console.log("Bill created data==================================================",billCreatedData);
		return res.json({
			status:400,
			message:"All done"
		});
	})	

	.catch(err => {
		console.log("error in billData", err);
		return res.json({
			status:500,
			message:"Error"
		});
	});
	
});

module.exports = {router};