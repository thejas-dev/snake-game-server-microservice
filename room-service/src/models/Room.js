const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
	name:{
		type:String,
		min:3,
		max:20,
		unique:true,
	},
	users: Array,
	},
	{
		timestamps: true,
	},
)

RoomSchema.index({name: 'text'});

module.exports = mongoose.model('Room',RoomSchema);