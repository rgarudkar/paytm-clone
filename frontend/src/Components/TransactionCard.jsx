// Add this export statement at the end of the file
export default function TransactionCard({ transaction }) {
    console.log(transaction)
    const {
        amount,
        balanceAfter,
        balanceBefore,
        createdAt,
        firstname,
        lastname,
        username,
    } = transaction;

    return (
        <div className="bg-white shadow-md rounded-md p-4 mb-4">
            {/* Receiver Details */}
            <div className="flex justify-between">
                <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-2xl text-white">{firstname[0].toUpperCase()}</span>
                    </div>
                    <div className="ml-4"> {/* Add margin to space text from the circle */}
                        <h2 className="text-lg font-bold">{firstname + " " + lastname}</h2>
                        <p className="text-gray-500 text-sm">{username}</p>
                    </div>
                </div>

                {/* Right Section: Amount */}
                <div className={`font-bold text-lg ${balanceBefore > balanceAfter ? "text-red-500" : "text-green-500"}`}>
                    {balanceBefore > balanceAfter ? `-₹${amount}` : `+₹${amount}`}
                </div>

            </div>

            {/* Balance Details */}
            <div className="mt-2 text-sm">
                <p>
                    <span className="font-semibold">Balance Before:</span> ₹{balanceBefore.toFixed(2)}
                </p>
                <p>
                    <span className="font-semibold">Balance After:</span> ₹{balanceAfter.toFixed(2)}
                </p>
            </div>

            {/* Date */}
            <div className="mt-4 text-gray-500 text-xs">
                {new Date(createdAt).toLocaleString()}
            </div>
        </div>
    );
}
