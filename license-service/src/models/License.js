const mongoose = require('mongoose');
const argon2 = require('argon2');

const licenseSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
        unique:true,
    },
    permissions:{
        type:Array,
        required:true,
    },
    
},{
    timestamps:true
})


const License = mongoose.model('License',licenseSchema);

module.exports = License;