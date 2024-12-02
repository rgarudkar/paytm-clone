const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account, Transaction } = require("../db");
const { default: mongoose, Mongoose } = require('mongoose');

const router = express.Router();

router.get("/balance",authMiddleware,async(req,res)=>{
    const account = await Account.findOne({
        userId : req.userId
    });

    res.status(200).json({
        balance : account.balance
    })
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const { amount, to } = req.body;

        const senderAccount = await Account.findOne({ userId: req.userId }).session(session);
        const receiverAccount = await Account.findOne({ userId: to }).session(session);

        if (!senderAccount || senderAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        if (!receiverAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid account" });
        }

        // Capture sender's balance before and after the transaction
        const senderBalanceBefore = senderAccount.balance;
        const senderBalanceAfter = senderBalanceBefore - amount;

        // Capture receiver's balance before and after the transaction
        const receiverBalanceBefore = receiverAccount.balance;
        const receiverBalanceAfter = receiverBalanceBefore + amount;

        // Deduct amount from sender's account
        await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -amount } },
            { session }
        );

        // Add amount to receiver's account
        await Account.updateOne(
            { userId: to },
            { $inc: { balance: amount } },
            { session }
        );

        // Record transaction in the transactions collection
        const transaction = new Transaction({
            senderId: senderAccount.userId,
            receiverId: receiverAccount.userId,
            amount,
            senderBalanceBefore: senderBalanceBefore, // Sender's balance before the transaction
            senderBalanceAfter: senderBalanceAfter,   // Sender's balance after the transaction
            receiverBalanceBefore, // Receiver's balance before the transaction
            receiverBalanceAfter,  // Receiver's balance after the transaction
        });

        await transaction.save({ session });

        // Commit the transaction
        await session.commitTransaction();

        res.status(200).json({ message: "Transfer successful" });
    } catch (error) {
        // Rollback the transaction in case of error
        await session.abortTransaction();
        res.status(500).json({ message: "Transaction failed", error: error.message });
    } finally {
        session.endSession();
    }
});


router.get('/transactions', authMiddleware, async (req, res) => {
    const userId = req.userId; // The logged-in user ID
    const { page = 1, limit = 10 } = req.query;

    try {
        // Fetch both sent and received transactions
        const transactions = await Transaction.find({
            $or: [
                { senderId: userId },    // User is the sender
                { receiverId: userId }    // User is the receiver
            ]
        })
            .select('senderId receiverId amount senderBalanceBefore senderBalanceAfter receiverBalanceBefore receiverBalanceAfter createdAt') // Fields to return
            .populate('senderId', 'username firstName lastName') // Populate sender info
            .populate('receiverId', 'username firstName lastName') // Populate receiver info
            .sort({ createdAt: -1 }) // Sort by latest transaction
            .skip((page - 1) * parseInt(limit)) // Pagination
            .limit(parseInt(limit)); // Limit the number of results
        console.log(transactions[0].senderId._id.toString())
        const processedTransactions = transactions.map(
            transaction => {
            if (transaction.receiverId._id.toString() === userId) {
                // User is the receiver, include sender details
                return {
                    createdAt:transaction.createdAt ,
                    balanceBefore: transaction.receiverBalanceBefore,
                    balanceAfter: transaction.receiverBalanceAfter,
                    firstname: transaction.senderId.firstName,
                    lastname: transaction.senderId.lastName,
                    username: transaction.senderId.username,
                    amount:transaction.amount,
                };
            } else if (transaction.senderId._id.toString() === userId) {
                console.log(transaction)
               return {
                    createdAt:transaction.createdAt ,
                    balanceBefore: transaction.senderBalanceBefore,
                    balanceAfter: transaction.senderBalanceAfter,
                    firstname: transaction.receiverId.firstName,
                    lastname: transaction.receiverId.lastName,
                    username: transaction.receiverId.username,
                    amount:transaction.amount,   
                };
            }
            return transaction;
        });          
            
            
        const total = await Transaction.countDocuments({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        });

        res.json({
            processedTransactions,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error fetching transactions:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;