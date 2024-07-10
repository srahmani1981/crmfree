const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/users.txt');

class UserModel {
    static getAll(callback) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) throw err;
            const users = data ? JSON.parse(data) : [];
            callback(users);
        });
    }

    static authenticate(username, password, callback) {
        this.getAll((users) => {
            const user = users.find(u => u.username === username && u.password === password);
            callback(user);
        });
    }
}

module.exports = UserModel;

