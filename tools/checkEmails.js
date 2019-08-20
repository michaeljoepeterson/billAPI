const {Votes} = require("../models/voteModel");

let checkEmails = function(req, res, next){
	const email = req.body.email;
	const legId = req.query.legid;
	return Votes.find({legisinfo_id:legId})

	.then(vote => {
		//console.log(bill);
		if(!vote[0].emails.includes(email)){
			req.voteEmails = vote[0].emails;
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