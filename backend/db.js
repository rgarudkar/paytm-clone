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

const transaction = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    amount: {
        type: Number,
        required: true,
        min: [0, "Amount must be positive"],
    },

    senderBalanceBefore: {
        type: Number,
        required: true,
    },

    senderBalanceAfter: {
        type: Number,
        required: true,
    },

    receiverBalanceBefore: {
        type: Number,
        required: true,
    },

    receiverBalanceAfter: {
        type: Number,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});


transaction.index({senderId : 1});
transaction.index({receiverId : 1})

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account",accountSchema);
const Transaction = mongoose.model("Transaction",transaction);

module.exports = {
    User,
    Account,
    Transaction 
};
