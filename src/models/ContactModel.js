const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ContactSchema = new Schema({
    name: String, 
    designation: String, 
    company: String, 
    industry: String,
    email: {type : String, required: true},
    phoneNumber: String,
    country: String, 
    date: {type: Date, default:Date.now()},
    user:{type: ObjectId, ref: "users"}     // NOT COMPLETED 
  })

const ContactModel = mongoose.model('contacts', ContactSchema );  // NOT COMPLETED 
module.exports = ContactModel ;