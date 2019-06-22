const {Bills} = require("../models/billModel");
const request = require('request');
//this function will need to check the status of the bill
//by sending request to get individual bill
//then if it at 2nd reading then add it to the database 
//will also need to do this for all data

function getSingleBill(billUrl){
	let promise = new Promise((resolve,reject) => {
		resolve();
	});

	return promise;
}

function saveBill(billData){
	let promise = new Promise((resolve,reject) => {
		resolve(Bills.create({
			bill_description:billData.name,
			bill_url:billData.url,
			bill_number:billData.number,
			session:billData.session,
			introduced_date:billData.introduced,
			legisinfo_id:billData.legisinfo_id
		}));
	});

	return promise;
}

module.exports = {saveBill};