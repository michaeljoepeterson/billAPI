const request = require('request');
//get bill data and put urls into array
function GetBills(apiURL,limit){
	this.apiURL = apiURL;
	this.limit = limit
}

GetBills.prototype.getSingleBillData = function(singleBill){
	let promise = new Promise((resolve,reject) => {
		let newUrl = this.apiURL + singleBill[0].bill_url;
		//console.log(singleBill,singleBill["bill_url"]);
		const options = {
			url:newUrl,
			headers:{
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		};

		request(options,function(error,response,body){
			//console.log(body);
			const parsedBody = JSON.parse(body);
			resolve(parsedBody);
		});
	});

	return promise;
}

GetBills.prototype.getBillData = function(offset,dataArray) {
	if(dataArray === undefined){
		dataArray = [];
	}
	let promise = new Promise((resolve,reject) => {
		let newUrl = this.apiURL + "bills/?limit=" + this.limit +"&offset=" + offset;
		console.log(newUrl);
		const options = {
			url:newUrl,
			headers:{
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		};
		//console.log(options);
		request(options,function(error,response,body){
			//console.log("parsed data: ",body);
			const parsedBody = JSON.parse(body);
			console.log("parsed data: ",parsedBody.objects.length);
			if(parsedBody.objects.length !== 0){

				//let newData = [];
				for(let i = 0;i < parsedBody.objects.length;i++){
					let currentBill = parsedBody.objects[i];
					let currentObject = {};
					currentObject.name = currentBill.name;
					currentObject.url = currentBill.url;
					currentObject.number = currentBill.number;
					currentObject.session = currentBill.session;
					currentObject.introduced = currentBill.introduced;
					currentObject.legisinfo_id = currentBill.legisinfo_id;
					//newData.push(currentObject);
					dataArray.push(currentObject);
				}
				//dataArray.push(newData);
				resolve(this.getBillData(offset + 500,dataArray));
			}
			else{
				resolve(dataArray);
			}
			
		}.bind(this));
	});

	return promise;
};

module.exports = {GetBills};