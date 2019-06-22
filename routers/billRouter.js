const express = require("express");
const {APIURL} = require('../config');
const {GetBills} = require('../getBills/GetBills');
const router = express.Router();

router.get("/",(req,res) => {
	let limit = req.query.limit;
	let getBills;
	getBills = new GetBills(APIURL,limit);

	return getBills.getBillData(0)

	.then(billData => {
		console.log("Bill data==================================================",billData.length);
		return res.json({
			status:400,
			message:"All done"
		});
	})
});

module.exports = {router};