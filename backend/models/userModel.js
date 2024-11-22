const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{type: String, required: true},
    email:{type: String, required: true,unique:true},
    password:{type: String, required: true},
    linkingCode:{type: String, required: true},
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    mobileNumber: { type: String },
    residentialAddress: { type: String },
    educationalBackground: { type: String },
    occupationalArea: { type: String },
    annualEducationBudget: { type: String },
    preferredFoE: { type: [String] }, // Array of strings
    notes: { type: String },
    avatar: { type: String },
},{
    timestamps: true
})

const User =mongoose.model('User',userSchema);
module.exports = User;