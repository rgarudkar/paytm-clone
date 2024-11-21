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

        const senderBalanceBefore = senderAccount.balance;
        const senderBalanceAfter = senderBalanceBefore - amount;

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
            balanceBefore: senderBalanceBefore,
            balanceAfter: senderBalanceAfter,
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

router.get('/transactions', async (req, res) => {
    const userId = req.userId; // Assuming userMiddleware sets this
    const { page = 1, limit = 10 } = req.query;

    try {
        // Fetch transactions with selected fields
        const transactions = await Transaction.find({ fromId: userId })
            .select('toId amount balanceBefore balanceAfter createdAt') // Include `toId`
            .populate('receiverId', 'username firstName') // Include only specific fields
            .sort({ createdAt: -1 }) // Sort by latest transactions
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Get total count of transactions for pagination
        const total = await Transaction.countDocuments({ fromId: userId });

        res.json({
            transactions,
            currentPage: parseInt(page), // Ensure it's an integer
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});



module.exports = router;