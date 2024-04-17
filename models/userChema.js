const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    username: { type: String, required: [true, "username is required!"] },
    password: { type: String, required: [true, "password is required!"] },
    firstname: { type: String, required: [true, "firstname is required!"] },
    lastname: { type: String, required: [true, "lastname is required!"] },
    address: { type: String },
    phone: { type: String },
    birthday: { type: String, required: [true, "birthday is required!"] }
})
const User = model("user", userSchema);
module.exports = User;