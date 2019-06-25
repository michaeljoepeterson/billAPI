const express = require("express");
const {APIURL,ck} = require('../config');
const {GetBills} = require('../getBills/GetBills');
const router = express.Router();
const {getBillsStatus,saveBill,checkLegIds,removeCopies} = require('../db/billDB');

router.get("/",(req,res) => {
	let limit = req.query.limit;
	let CK = req.query.ck;
	if(CK !== ck){
		return res.json({
			status:500,
			message:"Error"
		});
	}
	let getBills;
	getBills = new GetBills(APIURL,limit);
	let allBillData;
	//get all bill data
	return getBills.getBillData(0)
	//filter data copies
	.then(billData => {
		console.log("Bill data==================================================",billData.length);
		return removeCopies(billData)
	})
	//check filtered copies
	.then(billData => {
		console.log("Filtered Bill data==================================================",billData.length);
		allBillData = billData;
		return checkLegIds(allBillData)
	})
	//get bill indexes with the correct status
	.then(billData => {
		return getBillsStatus(allBillData,0,[])
	})
	//save to database modify to work with the 
	//correct status index array
	.then(billIndexes => {
		console.log("bill indexes=================================",billIndexes.length)
		let finalBills = [];
		for(let i = 0;i < billIndexes.length;i++){
			finalBills.push(allBillData[billIndexes[i]]);
		}
		console.log("final bill data length", finalBills.length);
		return saveBill(finalBills,0)
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