const mongoose = require('mongoose');

const voteSchema = mongoose.Schema({
	legisinfo_id:{type:String,required:true,unique:true},
	yes:{type:Number},
	total:{type:Number},
	emails:{type:Array}
});

voteSchema.methods.serialize = function(){
	return{
		legisinfo_id:this.legisinfo_id,
		yes:this.yes,
		total:this.total,
		emails:this.emails
	}
};

const Votes = mongoose.model("Vote",voteSchema);
module.exports = {Votes};