const {Bills} = require("../models/billModel");
const request = require('request');
const {APIURL} = require('../config');
//this function will need to check the status of the bill
//by sending request to get individual bill
//then if it at 2nd reading then add it to the database 
//will also need to do this for all data

function getBillsStatus(billData,billIndex,billIndexArray){
	let billStatus = {
		HouseAt2ndReading:"HouseAt2ndReading",
		RoyalAssentAwaiting:"RoyalAssentAwaiting",
		RoyalAssentGiven:"RoyalAssentGiven",
		SenateAt2ndReading:"SenateAt2ndReading",
		SenateAt3rdReading:"SenateAt3rdReading"
	};

	let promise = new Promise((resolve,reject) => {
		if(billIndex !== billData.length - 1){
			let newUrl = APIURL + billData[billIndex].url;
			
			const options = {
				url:newUrl,
				headers:{
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			};
			request(options,function(error,response,body){
				const parsedBody = JSON.parse(body);
				console.log("found one: ",parsedBody.status_code,newUrl,billIndexArray,billIndex);
				if(billStatus[parsedBody.status_code]){
					//billIndexArray
					
					billIndexArray.push(billIndex);
					console.log("found one add: ",billIndexArray);
					resolve(getBillsStatus(billData,billIndex + 1,billIndexArray));
				}
				else{
					resolve(getBillsStatus(billData,billIndex + 1,billIndexArray));
				}
			});
		}
		else{
			resolve(billIndexArray);
		}
		
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
//use this function to handle saving all the data then 
//return promise for router so router continues 
//when all checks and saving done
function handleBills(billData,billIndex){
	let promise = new Promise((resolve,reject) => {

		return getSingleBill(billData[billIndex])


		.then(billUrl => {

		})

		resolve();
	});

	return promise;
}

module.exports = {getBillsStatus,saveBill};