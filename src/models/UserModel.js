const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({    
    email: {type : String,unique:true, required: true},
    password: {type : String, required: true},

    // NOT COMPLITED 
    userPicURL: {type:String, default:"https://st.depositphotos.com/1052233/2885/v/600/depositphotos_28850541-stock-illustration-male-default-profile-picture.jpg"}, //static one image	
    name: String, //	demo1	
    accessDesignation: {type :String, default:"normal" }	//normal, Admin, superAdmin, 
  })
  const UserModel = mongoose.model('users', UserSchema ); // NOT COMPLITED 
  module.exports = UserModel;
