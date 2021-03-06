const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
	bill_description:{type:Object,required:true},
	bill_url:{type:String,required:true},
	bill_number:{type:String,required:true},
	session:{type:String,required:true},
	introduced_date:{type:String,required:true},
	legisinfo_id:{type:String,required:true,unique:true},
	status:{type:String},
	votes:{type: mongoose.Schema.Types.ObjectId, ref: 'Vote', unique: false, required: [false, 'No vote found']}
},{minimize:false});

billSchema.methods.serialize = function(){
	return{
		bill_description:this.bill_description,
		bill_url:this.bill_url,
		bill_number:this.bill_number,
		session:this.session,
		introduced_date:this.introduced_date,
		legisinfo_id:this.legisinfo_id,
		status:this.status,
		votes:this.votes
	}
};

const Bills = mongoose.model("Bill",billSchema);
module.exports = {Bills};