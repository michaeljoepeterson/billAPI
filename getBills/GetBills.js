const request = require('request');
//get bill data and put urls into array
//probably do this through recursive function
//endpoint entually next url will be null
function GetBills(apiURL,limit){
	this.apiURL = apiURL;
	this.limit = limit
}

GetBills.prototype.getBillData = function() {
	let promise = new Promise((resolve,reject) => {
		let newUrl = this.apiURL + "bills/?limit=" + this.limit;
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
			console.log("parsed data: ",this.apiURL);
			resolve(parsedBody);
		}.bind(this));
	});

	return promise
};

module.exports = {GetBills};