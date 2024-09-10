const fs = require('fs');
const path = require('path');
const transactionFilePath = path.join(__dirname, '../data/transactions.txt');

// Get all transactions
exports.getAll = (callback) => {
    fs.readFile(transactionFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading transactions file:', err);
            callback([]); // Return an empty array if error occurs
        } else {
            try {
                const transactions = data ? JSON.parse(data) : [];
                callback(transactions);
            } catch (parseErr) {
                console.error('Error parsing transactions file:', parseErr);
                callback([]); // Return empty array if JSON is corrupted
            }
        }
    });
};

// Get transactions by personId
exports.getByPersonId = (personId, callback) => {
    fs.readFile(transactionFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading transactions file:', err);
            callback([]); // Return empty array if error occurs
        } else {
            try {
                const transactions = data ? JSON.parse(data) : [];
                const personTransactions = transactions.filter(transaction => transaction.personId === personId);
                callback(personTransactions);
            } catch (parseErr) {
                console.error('Error parsing transactions file:', parseErr);
                callback([]); // Return empty array if JSON is corrupted
            }
        }
    });
};

// Add a new transaction
exports.add = (transaction, callback) => {
    fs.readFile(transactionFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading transactions file:', err);
            callback(err); // Pass the error to the callback
        } else {
            let transactions = [];
            try {
                transactions = data ? JSON.parse(data) : [];
            } catch (parseErr) {
                console.error('Error parsing transactions file:', parseErr);
                return callback(parseErr); // Pass parsing error
            }

            // Add the new transaction to the array
            transactions.push(transaction);

            // Write the updated transactions back to the file
            fs.writeFile(transactionFilePath, JSON.stringify(transactions, null, 2), (err) => {
                if (err) {
                    console.error('Error writing transactions file:', err);
                    return callback(err); // Pass writing error
                }

                callback(null); // No error, successful write
            });
        }
    });
};
