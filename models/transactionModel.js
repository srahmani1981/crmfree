const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/transactions.txt');

class TransactionModel {
    static getAll(callback) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) throw err;
            const transactions = data ? JSON.parse(data) : [];
            callback(transactions);
        });
    }

    static getByPersonId(personId, callback) {
        this.getAll((transactions) => {
            const personTransactions = transactions.filter(t => t.personId === personId);
            callback(personTransactions);
        });
    }

    static add(transaction, callback) {
        this.getAll((transactions) => {
            transactions.push(transaction);
            fs.writeFile(filePath, JSON.stringify(transactions, null, 2), (err) => {
                if (err) throw err;
                callback();
            });
        });
    }

    static getById(id, callback) {
        this.getAll((transactions) => {
            const transaction = transactions.find(t => t.id === id);
            callback(transaction);
        });
    }

    static update(id, updatedTransaction, callback) {
        this.getAll((transactions) => {
            const index = transactions.findIndex(t => t.id === id);
            if (index !== -1) {
                transactions[index] = { ...updatedTransaction, id };
                fs.writeFile(filePath, JSON.stringify(transactions, null, 2), (err) => {
                    if (err) throw err;
                    callback();
                });
            } else {
                callback(new Error('Transaction not found'));
            }
        });
    }

    static delete(id, callback) {
        this.getAll((transactions) => {
            const updatedTransactions = transactions.filter(t => t.id !== id);
            fs.writeFile(filePath, JSON.stringify(updatedTransactions, null, 2), (err) => {
                if (err) throw err;
                callback();
            });
        });
    }
}

module.exports = TransactionModel;

