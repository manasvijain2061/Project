const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//require passport mongoose
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose);
//username, salting, hashing auto implement it
//some methods will also add (instance methods)

module.exports = mongoose.model("user", userSchema);
