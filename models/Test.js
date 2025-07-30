const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const testSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    saveData: { type: String, required: true },
    date : { type: String }
});

//On rajoute le validateur comme plugin à notre schéma
testSchema.plugin(uniqueValidator);

module.exports = mongoose.model("test", testSchema);