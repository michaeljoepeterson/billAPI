const {Bills} = require("../models/billModel");
const {Votes} = require("../models/voteModel");
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
		if(billIndex !== billData.length){
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
				console.log("found one: ",parsedBody.status_code,newUrl,billIndex);
				if(billStatus[parsedBody.status_code]){
					//billIndexArray
					let extraData = {billIndex:billIndex,status:parsedBody.status_code}
					billIndexArray.push(extraData);
					console.log("found one add: ",billData[billIndex]);
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

function removeCopies(billData){
	let promise = new Promise((resolve,reject) => {
		let filteredData = [];
		let idObject = {};
		for(let i = 0;i < billData.length;i++){
			let identifier = billData[i].legisinfo_id;
			if(!idObject[identifier]){
				idObject[identifier] = i;
				filteredData.push(billData[i]);
			}
		}
		resolve(filteredData);
	});

	return promise;
}

function checkLegIds(billData){
	let promise = new Promise((resolve,reject) => {
		let idObject = {};
		let copyIds = {};
		for(let i = 0;i < billData.length;i++){
			//let identifier = billData[i].number + billData[i].session;
			//3621454 3628710 10586892
			let identifier = billData[i].legisinfo_id;
			if(!idObject[identifier]){
				idObject[identifier] = i;
			}
			else{
				console.log("found copy: ",billData[i],billData[idObject[identifier]],i,idObject[identifier]);
				copyIds[identifier] = i;
			}
		}
		if(Object.keys(copyIds).length === 0){
			console.log("no copies");
		}
		resolve(copyIds);
	});

	return promise;
}

function saveBill(billData,billIndex){
	let promise = new Promise((resolve,reject) => {
		console.log("save bill data: ",billIndex,billData.length,billData[billIndex]);
		if(billIndex !== billData.length){
			console.log("saving data");
			return Votes.create({
				legisinfo_id:billData[billIndex].legisinfo_id,
				yes:0,
				total:0,
				emails:[]
			})

			.then(vote => {
				return Bills.create({
					bill_description:billData[billIndex].name,
					bill_url:billData[billIndex].url,
					bill_number:billData[billIndex].number,
					session:billData[billIndex].session,
					introduced_date:billData[billIndex].introduced,
					legisinfo_id:billData[billIndex].legisinfo_id,
					status:billData[billIndex].status,
					votes:vote._id
				})
			})
			
			.then(data => {
				resolve(saveBill(billData,billIndex + 1));
			})
			
			.catch(err => {
				console.log("error saving data: ",err);
				console.log("error saving data bill data: ",billData[billIndex]);
				console.log("error saving data bill data cont: ",billIndex,billData.length);
				if(err.errmsg.includes("E11000")){
					resolve(saveBill(billData,billIndex + 1));
				}
			});
		}
		else{
			resolve("all done");
		}
		
	});

	return promise;
}

module.exports = {getBillsStatus,saveBill,checkLegIds,removeCopies};