const fs = require('fs');
const path = require('path');
const transactionFilePath = path.join(__dirname, '../data/transactions.txt');

exports.getAll = (callback) => {
    fs.readFile(transactionFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading transactions file:', err);
            callback([]);
        } else {
            const transactions = data ? JSON.parse(data) : [];
            callback(transactions);
        }
    });
};

exports.getByPersonId = (personId, callback) => {
    fs.readFile(transactionFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading transactions file:', err);
            callback([]);
        } else {
            const transactions = data ? JSON.parse(data) : [];
            const personTransactions = transactions.filter(transaction => transaction.personId === personId);
            callback(personTransactions);
        }
    });
};

exports.add = (transaction, callback) => {
    fs.readFile(transactionFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading transactions file:', err);
            callback();
        } else {
            const transactions = data ? JSON.parse(data) : [];
            transactions.push(transaction);
            fs.writeFile(transactionFilePath, JSON.stringify(transactions, null, 2), (err) => {
                if (err) {
                    console.error('Error writing transactions file:', err);
                }
                callback();
            });
        }
    });
};
