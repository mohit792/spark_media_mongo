import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {type : String},
    name : {type : String, },
    image : {type : String},
    about : {type : String},
    email : {type : String, required : true,},
    password : {type : String},
    source : {type: String}
})

const UserModel = mongoose.model('users', userSchema)

export default UserModel;