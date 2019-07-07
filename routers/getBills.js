const express = require("express");
const router = express.Router();
const {Bills} = require("../models/billModel");
const {APIURL} = require('../config');
const {GetBills} = require('../getBills/GetBills');
//return all bills
router.get("/",(req,res) => {
	let billLimit = parseInt(req.query.limit ? req.query.limit : 0);
	return Bills.find({}).limit(billLimit)

	.then(bills => {
		console.log("Length: ",bills.length);
		return res.json({
			status:200,
			data:bills.map(bill => bill.serialize())
		});
	})
	.catch(err => {
		console.log("error getting data: ",err);
		return res.json({
			status:500,
			message:"An error occured"
		})
	})
});

router.get("/bill",(req,res) => {
	const legId = req.query.legid;
	const getBill = new GetBills(APIURL)
	return Bills.find({legisinfo_id:legId})

	.then(bill => {
		
		return getBill.getSingleBillData(bill)
		
	})

	.then(billData => {
		return res.json({
			status:200,
			data:billData
		});
	})
	.catch(err => {
		console.log("error getting data: ",err);
		return res.json({
			status:500,
			message:"An error occured"
		})
	})
});


module.exports = {router};