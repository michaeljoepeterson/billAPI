const express = require("express");
const {APIURL,ck} = require('../config');
const {GetBills} = require('../getBills/GetBills');
const {checkKey} = require('../tools/checkKey');
const router = express.Router();
const {getBillsStatus,saveBill,checkLegIds,removeCopies} = require('../db/billDB');

router.get("/",checkKey,(req,res) => {
	let limit = req.query.limit;
	let CK = req.query.ck;
	if(CK !== ck || !CK){
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
	//split here to make it faster? split seems to be missing bills
	.then(billData => {
		/*
		const halfIndex = Math.round(allBillData.length / 2);
		const halfData1 = allBillData.slice(0,halfIndex);
		const halfData2 = allBillData.slice(halfIndex - 1,allBillData.length);
		return Promise.all([getBillsStatus(halfData1,0,[]),getBillsStatus(halfData2,0,[])])
		*/
		return getBillsStatus(allBillData,0,[])
	})
	//save to database modify to work with the 
	//correct status index array
	.then(billIndexes => {
		console.log("bill indexes=================================",billIndexes.length)
		//let combinedIndexes = [].concat(billIndexes[0],billIndexes[1]);
		let combinedIndexes = billIndexes;
		let finalBills = [];
		for(let i = 0;i < combinedIndexes.length;i++){
			finalBills.push(allBillData[combinedIndexes[i].billIndex]);
			finalBills[i].status = combinedIndexes[i].status;
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