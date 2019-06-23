const express = require("express");
const {APIURL} = require('../config');
const {GetBills} = require('../getBills/GetBills');
const router = express.Router();
const {getBillsStatus,saveBill} = require('../db/billDB');

router.get("/",(req,res) => {
	let limit = req.query.limit;
	let getBills;
	getBills = new GetBills(APIURL,limit);
	let allBillData;
	return getBills.getBillData(0)

	.then(billData => {
		console.log("Bill data==================================================",billData.length);
		allBillData = billData;
		return getBillsStatus(billData,0,[])
	})

	.then(billIndexes => {
		console.log("bill indexes=================================",billIndexes.length)
		return saveBill(allBillData[0])
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