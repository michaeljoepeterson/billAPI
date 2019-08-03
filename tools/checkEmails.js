const {Bills} = require("../models/billModel");

let checkEmails = function(req, res, next){
	const email = req.body.email;
	const legId = req.query.legid;
	return Bills.find({legisinfo_id:legId})

	.then(bill => {
		//console.log(bill);
		if(!bill[0].emails[email]){
			req.billEmails = bill[0].emails;
			console.log('Email good');
			next();
		}
		else{
			return res.status(422).json({
				code:422,
				message:"You already voted for this bill"
			});
		}
	})

	.catch(err => {
		console.log('Email err', err);
		return res.status(422).json({
			code:422,
			message:"Error checking email"
		});
	})
}

module.exports = {checkEmails};