const emailValidator = require("email-validator");
//0 no 1 yes
let checkBody = function(req, res, next){
	const vote = req.body.vote;
	const email = req.body.email;
	if(!vote || !email || Object.keys(req.body).length !== 2){
		return res.status(422).json({
			code:500,
			message:"Missing field"
		});
	}
	console.log(req.body,!Number.isInteger(vote), !(typeof email === 'string'))
	if(!Number.isInteger(vote) || !(typeof email === 'string')){
		return res.status(422).json({
			code:500,
			message:"Incorrect data"
		});
	}

	if(!emailValidator.validate(email)){
		return res.status(422).json({
			code:422,
			message:"Incorrect Email"
		});
	}

	else{
		next();
	}
}

module.exports = {checkBody};