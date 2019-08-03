const {ck} = require('../config');

let checkKey = function(req, res, next){
	if(req.query.ck !== ck){
		return res.status(422).json({
			code:422,
			message:"unathorized"
		});
	}
	else{
		next();
	}
}

module.exports = {checkKey};