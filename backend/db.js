const mongoose = require("mongoose");

// Connect to MongoDB with additional options
mongoose.connect("mongodb://localhost:27017/paytmApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define the user schema with additional validation
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, maxLength: 20 },
    firstName: { type: String, required: true, trim: true, maxLength: 50},
    lastName: { type: String, required: true, trim: true, maxLength: 50},
});

const accountSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    balance : {
        type : Number,
        required : true

    }
})

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account",accountSchema);

module.exports = {
    User,
    Account
};
